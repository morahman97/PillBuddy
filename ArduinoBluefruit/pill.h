#ifndef PILL_H_
#define PILL_H_
struct Time {
  uint8_t hh;
  uint8_t mm;
  uint8_t D;
};
typedef struct Time Time_t;

struct TimeEntry{
  Time_t * t; 
  uint8_t slots;
  uint8_t active;
};
typedef struct TimeEntry TimeEntry_t;

struct DayEntry{
  TimeEntry_t * te;
  uint8_t count;
};
typedef struct DayEntry DayEntry_t;

#endif 
