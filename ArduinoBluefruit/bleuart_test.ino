/*********************************************************************
 This is an example for our nRF52 based Bluefruit LE modules

 Pick one up today in the adafruit shop!

 Adafruit invests time and resources providing this open source code,
 please support Adafruit and open-source hardware by purchasing
 products from Adafruit!

 MIT license, check LICENSE for more information
 All text above, and the splash screen below must be included in
 any redistribution
*********************************************************************/
#include <bluefruit.h>
#include <stdlib.h>
#include "pill.h"
#define START_SIZE 4
#define READ_SIZE 8
#define DAY 7
#define SLOT_NUM 4
#define DAY1 '0'
#define SLOT1 'A'
#define SLOT_MASK 0x01
#define BUTTON1 16
#define BUTTON2 15
#define BUTTON3 7
#define BUTTON4 11
#define LED1 30
#define LED2 27
#define LED3 A5
#define LED4 A4
#define REMINDER A3



// BLE Service
BLEDis  bledis;  // device information
BLEUart bleuart; // uart over ble
BLEBas  blebas;  // battery
DayEntry_t de[DAY] = {0};
int activeCount = 0;
unsigned long lastTime;
Time_t currTime = {0};
void setup()
{
  Serial.begin(115200);
  while ( !Serial ) delay(10);   // for nrf52840 with native usb
  
  Serial.println("Bluefruit52 BLEUART Example");
  Serial.println("---------------------------\n");

  // Setup the BLE LED to be enabled on CONNECT
  // Note: This is actually the default behaviour, but provided
  // here in case you want to control this LED manually via PIN 19
  Bluefruit.autoConnLed(true);

  // Config the peripheral connection with maximum bandwidth 
  // more SRAM required by SoftDevice
  // Note: All config***() function must be called before begin()
  Bluefruit.configPrphBandwidth(BANDWIDTH_MAX);

  Bluefruit.begin();
  // Set max power. Accepted values are: -40, -30, -20, -16, -12, -8, -4, 0, 4
  Bluefruit.setTxPower(4);
  Bluefruit.setName("Bluefruit52");
  //Bluefruit.setName(getMcuUniqueID()); // useful testing with multiple central connections
   Bluefruit.Periph.setConnectCallback(connect_callback);
  Bluefruit.Periph.setDisconnectCallback(disconnect_callback);
  
  // Configure and Start Device Information Service
  bledis.setManufacturer("Adafruit Industries");
  bledis.setModel("Bluefruit Feather52");
  bledis.begin();

  // Configure and Start BLE Uart Service
  bleuart.begin();

  // Start BLE Battery Service
  blebas.begin();
  blebas.write(100);

  // Set up and start advertising
  startAdv();

  Serial.println("Please use Adafruit's Bluefruit LE app to connect in UART mode");
  Serial.println("Once connected, enter character(s) that you wish to send");

 
}

void startAdv(void)
{
  // Advertising packet
  Bluefruit.Advertising.addFlags(BLE_GAP_ADV_FLAGS_LE_ONLY_GENERAL_DISC_MODE);
  Bluefruit.Advertising.addTxPower();
  
  // Include bleuart 128-bit uuid
  Bluefruit.Advertising.addService(bleuart);

  // Secondary Scan Response packet (optional)
  // Since there is no room for 'Name' in Advertising packet
  Bluefruit.ScanResponse.addName();
 
  
  /* Start Advertising
   * - Enable auto advertising if disconnected
   * - Interval:  fast mode = 20 ms, slow mode = 152.5 ms
   * - Timeout for fast mode is 30 seconds
   * - Start(timeout) with timeout = 0 will advertise forever (until connected)
   * 
   * For recommended advertising interval
   * https://developer.apple.com/library/content/qa/qa1931/_index.html   
   */
  Bluefruit.Advertising.restartOnDisconnect(true);
  Bluefruit.Advertising.setInterval(32, 244);    // in unit of 0.625 ms
  Bluefruit.Advertising.setFastTimeout(30);      // number of seconds in fast mode
  Bluefruit.Advertising.start(0);                // 0 = Don't stop advertising after n seconds  
}

int parse2(char ** part0, char ** part1, char * str, char * delim){
  char * p0 = strtok(str, delim);
  char * p1 = strtok(NULL, delim);
  if(p0== NULL || p1 == NULL){
    Serial.print("Error parsing received message.");
    return 0;
  }
  *part0 = (char *)malloc(strlen(p0)*sizeof(char));
  *part1 = (char *)malloc(strlen(p1)*sizeof(char));
  strcpy(*part0, p0);
  strcpy(*part1, p1);
  return 1;
}


// TODO verify if we need to overwrite
void parseSlot(char * slots, uint8_t * entrySlots){
  for (uint8_t i = 0; i < strlen(slots); ++i){
    uint8_t slot = slots[i]-SLOT1;
    *entrySlots |= (SLOT_MASK << slot);
  }
}

void populateTime(Time_t * t, char * hh, char * mm, char D){
  t->hh = atoi(hh);
  t->mm = atoi(mm);
  t->D = D;
}

int compareTime (const void *arg1, const void *arg2)                                
{                                                 
  Time_t * t1 = (Time_t *)arg1;
  Time_t * t2 = (Time_t *)arg2;

  if (t1->hh < t2->hh){
    return -1;
  } else if (t1->hh > t2->hh){
    return 1;
  }

  if (t1->mm < t2->mm){
    return -1;
  } else if (t1->mm > t2->mm){
    return 1;
  }
  return 0;                            
} 

int compareTimeEntry (const void *arg1, const void *arg2)                                
{                                                 
  TimeEntry_t * t1 = (TimeEntry_t *)arg1;
  TimeEntry_t * t2 = (TimeEntry_t *)arg2;
  return compareTime(t1->t, t2->t);                       
} 
void loop()
{
  
  delay (1000);
  
  uint16_t bufSize = START_SIZE;
  uint8_t * buf = (uint8_t *) calloc(1,START_SIZE*sizeof(uint8_t));
  uint16_t idx = 0;
  
  while(Bluefruit.connected() && bleuart.available()){
    bleuart.read(buf+idx, READ_SIZE);
    idx += 1;
    // Check if we need to expand buffer
    if( idx >= bufSize ){
      uint8_t * temp = (uint8_t *)realloc(buf, sizeof(uint8_t)*bufSize);
      if (temp == NULL){
        Serial.print("Failed to allocate memory");
        free(buf);
      }
      buf = temp;
    }
  }

  // Time format:
  // 0:Sunday 
  // "hh-mm-D"
  // Message format from phone
  // "#hh-mm-D-A#hh-mm-D-B#"
  // Message format from device
  // "Time:hh-mm-D,Slot:#"
  // Construct entries for reminders
  // Pointer for parsing the whole string
  // Check if time or reminder
  if(strlen((char *)buf) != 0){
    if(buf[0] != 'T'){
       char * hh = strtok((char *)buf, "-");
       char * mm = strtok(NULL, "-");
       char * D = strtok(NULL, "-");
  
       if(hh==NULL||mm==NULL||D == NULL){
        Serial.print("error parsing current time\n");
       }
  
       Serial.printf("%s %s %s\n", hh, mm, D);
       populateTime(&currTime, hh, mm, D[0]-DAY1);
       // Populate current time
       //currTime.hh = atoi(hh);
       //currTime.mm = atoi(mm);
       //currTime.D = atoi(D);
    }
 
    else{
      char * savePtr_a = NULL;
      char * token = strtok_r((char *)buf+1, "#", &savePtr_a);
      if(token == NULL){
        Serial.print("Error parsing received message.");
      }

      while(token != NULL){
        
        char * hh = strtok(token, "-");
        char * mm = strtok(NULL, "-");
        char * D = strtok(NULL, "-");
        char * Slot = strtok(NULL, "-");
  
         if(hh==NULL||mm==NULL||D == NULL|| Slot==NULL){
           Serial.print("error parsing current time\n");
         }

        for (uint8_t i = 0; i < strlen(D); ++i){
          uint8_t day = D[i]-DAY1;
          DayEntry_t dayEntry = de[day];
          TimeEntry_t * timeEntry = NULL;
          if(dayEntry.count == 0){
            dayEntry.te = (TimeEntry_t *)calloc(1, sizeof(TimeEntry_t));
            if(dayEntry.te == NULL){
              Serial.print("Memory allocation error.");
              continue;
            }
            timeEntry = dayEntry.te;
          } else {
            TimeEntry_t * tmp = (TimeEntry_t *)realloc(dayEntry.te, sizeof(TimeEntry_t)*(dayEntry.count+1));
            if(tmp == NULL){
              Serial.print("Memory allocation error.");
              continue;
            }
            dayEntry.te = tmp;
            timeEntry = &(dayEntry.te[dayEntry.count]);
          }
          dayEntry.count++;
          parseSlot(Slot, &(timeEntry->slots));
          populateTime(timeEntry->t, hh, mm, day);
          qsort(dayEntry.te, dayEntry.count, sizeof(TimeEntry_t), compareTimeEntry);
        }
        
        Serial.printf("%s %s %s %s\n", hh, mm, D, Slot);
        token = strtok_r(savePtr_a, "#", &savePtr_a);
      }
    }
  }
  free(buf);

  // If connected, use current time
  if(Bluefruit.connected()){
    DayEntry dayEntry = de[currTime.D];
    
  } else {
    unsigned long timeEllapsed = millis() - lastTime;
    updateTime(&currTime, timeEllapsed);
  }
  
  /*
  
  while (Serial.available())
  {
    // Delay to wait for enough input, since we have a limited transmission buffer
    delay(2);

    uint8_t buf[64];
    int count = Serial.readBytes(buf, sizeof(buf));
    int c = bleuart.write( buf, count );
    Serial.print(c+'\n');
    Serial.print(count+'\n');
  }

  // Request CPU to enter low-power mode until an event/interrupt occurs
  waitForEvent();
  */
}

void updateTime(Time_t * t, unsigned long timeEllapsed){
  uint32_t minutes = timeEllapsed / 60000;
  uint8_t hour = minutes/60;
  minutes %= 60;
  uint16_t mmAdded = t->mm + minutes;
  t->mm = mmAdded % 60;
  uint16_t hhAdded = mmAdded/60 + tt->h + hour;
  t->hh = hhAdded % 24;
  t->D = (t->D + hhAdded / 24 ) % 7;
}
// callback invoked when central connects
void connect_callback(uint16_t conn_handle)
{
  // Get the reference to current connection
  BLEConnection* connection = Bluefruit.Connection(conn_handle);

  char central_name[32] = { 0 };
  connection->getPeerName(central_name, sizeof(central_name));

  Serial.print("Connected to ");
  Serial.println(central_name);
}

/**
 * Callback invoked when a connection is dropped
 * @param conn_handle connection where this event happens
 * @param reason is a BLE_HCI_STATUS_CODE which can be found in ble_hci.h
 * https://github.com/adafruit/Adafruit_nRF52_Arduino/blob/master/cores/nRF5/nordic/softdevice/s140_nrf52_6.1.1_API/include/ble_hci.h
 */
void disconnect_callback(uint16_t conn_handle, uint8_t reason)
{
  (void) conn_handle;
  (void) reason;

  Serial.println();
  Serial.println("Disconnected");
  lastTime = millis();

}
