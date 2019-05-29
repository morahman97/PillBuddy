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
//#include "pill.h"
#define START_SIZE 4
#define READ_SIZE 8

// BLE Service
BLEDis  bledis;  // device information
BLEUart bleuart; // uart over ble
BLEBas  blebas;  // battery
//TimeEntry * te;
int activeCount = 0;
unsigned long disconnectTime;
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
  
        Serial.printf("%s %s %s %s\n", hh, mm, D, Slot);
        token = strtok_r(savePtr_a, "#", &savePtr_a);
      }
    }
  }
  free(buf);
  /*
  
  char * savePtr_a = NULL;
      char * token = strtok_r(buf+1, "#", &savePtr_a);
      if(token == null){
        Serial.print("Error parsing received message.");
      }

      while(token != null){
        char * token_time;
        char * token_slot;
        if(!parse2(&token_time, &token_slot, token, ",")){
          token = strtok_r(savePtr_a, "#", &savePtr_a);
          continue;
        }
    
        // Parsing the time and slots
        char * time0;
        char * time1;
        char * slot0;
        char * slot11;
        if(!parse2(&time0, &time1, token_time, ":") || !parse2(&slot0, &slot1, token_time, ":")){
          token = strtok_r(savePtr_a, "#", &savePtr_a);
          continue;
        }
  
    // If key is different from what is expected
    if(strcmp(time0, "Time")!=0 || strcmp(slot0, "Slot")){
      Serial.print("error parsing command");
    }

    
    // Allocate space for one more
    TimeEntry * t0 = realloc(te, sizeof(TimeEntry) * (activeCount + 1));
    if (t0 == null){
      Serial.print("realloc failed");
    }
    
    // Parse the slot number
    t0[activeCount].slot = (uint8_t)atol(slot1);
    t0[activeCount].t = parseTime(time1);
    t0[activeCount].active = 1;

    activeCount++;
    
    token = strtok_r(savePtr_a, "#", &savePtr_a);
    
    
  }
  
  TimeEntry * te;
  // Forward data from HW Serial to BLEUART
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
/*
Time_t * parseTime(char * str){
  char * dd = strtok(str, "-");
  char * hh = strtok(NULL, "-");
  char * mm = strtok(NULL, "-");
  char * ss = strtok(NULL, "-");
  if(dd == NULL || hh == NULL | mm == NULL | ss == NULL){
    Serial.print("Error parsing time.");
    return 0;
  }
  
  Time_t * t = calloc(sizeof(Time));
  t->dd = atol(dd);
  t->hh = atol(hh);
  t->mm = atol(mm);
  t->ss = atol(ss);
  return t;
  
}*/
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

}
