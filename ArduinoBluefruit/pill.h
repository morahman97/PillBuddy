#ifndef PILL_H_
#define PILL_H_
struct Time {
  int dd;
  int hh;
  int mm;
  int ss;
};
typedef struct Time Time_t;

struct TimeEntry{
  Time_t * t; 
  uint8_t slot;
  uint8_t active;
};
typedef struct TimeEntry TimeEntry_t;

/*
int compareTime (const void *arg1, const void *arg2)                                
{                                                 
  Time_t * t1 = (Time_t *)arg1;
  Time_t * t2 = (Time_t *)arg2;

  if (t1->dd < t2->dd){
    return -1;
  } else if (t1->dd > t2->dd){
    return 1;
  }

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
  
  if (t1->ss < t2->ss){
    return -1;
  } else if (t1->dd > t2->dd){
    return 1;
  }
  return 0;                            
} 

int compareTimeEntry (const void *arg1, const void *arg2)                                
{                                                 
  TimeEntry_t * t1 = (TimeEntry_t *)arg1;
  TimeEntry_t * t2 = (TimeEntry_t *)arg2;

  
  return 0;                            
} */
#endif 
