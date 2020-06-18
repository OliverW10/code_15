#include "AdafruitIO_WiFi.h"


#define IO_USERNAME "Olikat"
#define FEED_NAME "Inside"
#define IO_KEY "cant put"
#define WIFI_SSID "FBI Watch Van #6"
#define WIFI_PASS "aaaaaaaa"



AdafruitIO_WiFi  io(IO_USERNAME, IO_KEY, WIFI_SSID, WIFI_PASS);
AdafruitIO_Feed *output = io.feed(FEED_NAME);

int sensPins[2] = {4, 0};
int sensVals[2] = {0, 0};

int recordLength = 200;
int dataLog[2][200];
long total = 0;
int average[2] = {0, 0};

int entered = 0;
int left = 0;
int inside = 0;

int maxTime = 1000; // the maximum time between the sensors being covered that will consider it an enternace

unsigned long time1 = millis();
int outputCounter = 0;
int outputWaitTime = 50; // how long to wait between sending to adafruit in cyces

int coveredTimes[2] = {maxTime, maxTime}; // loops since the sensor was covered

void setup() {
  pinMode(sensPins[0], INPUT);
  pinMode(sensPins[1], INPUT);
  Serial.begin(9600);

  io.connect();
  while(io.status() < AIO_CONNECTED){
    Serial.println("Connecting");
    delay(500);
  }
  Serial.println(io.statusText());
}

void loop() {
  // run the adafruit thing
  io.run();

  for(int sensor = 0; sensor < 2; sensor += 1){
    // Read the light value form the sensor
    sensVals[sensor] = analogRead(sensPins[sensor]);

    // Add up and average the last recordLength values
    // and moves the values backwards one
    total = 0;
    for(int i = recordLength-2; i>=0; i--){
      dataLog[sensor][i+1] = dataLog[sensor][i];
      total += dataLog[sensor][i];
    }
    average[sensor] = total/recordLength;
    // set the begining of the chain to the sensor value
    dataLog[sensor][0] = sensVals[sensor];

    // Check if the sensor is considered covered and set the times since covered to zero
    if((average[sensor] - sensVals[sensor]) > 100){
      coveredTimes[sensor] = 0;
    }
    coveredTimes[sensor] ++;
  }

  if(coveredTimes[0] < maxTime && coveredTimes[1] < maxTime){
    Serial.println("Passed");
     if(coveredTimes[0] < coveredTimes[1]){ // enterance
      entered += 1;
      inside += 1;
     }else{ //exit
      left += 1;
      inside -= 1;
     }
  }
  
  // send to adafruit every thousand milliseconds
  unsigned long time2 = millis();
  if(abs(time1 - time2) > 1000){
    unsigned long time1 = millis();
    Serial.println(inside);
      output -> save(inside); 
  }
  
  delay(10);
}
