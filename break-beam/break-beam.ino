#include "AdafruitIO_WiFi.h"


#define IO_USERNAME "Olikat"
#define FEED_NAME "Inside"
#define IO_KEY "cant put on github"
#define WIFI_SSID "DrB"
#define WIFI_PASS ""



AdafruitIO_WiFi  io(IO_USERNAME, IO_KEY, WIFI_SSID, WIFI_PASS);
AdafruitIO_Feed *output = io.feed(FEED_NAME);

int ledPin = 5;
int sensPins[2] = {4, 0};
int sensVals[2] = {0, 0};

int recordLength = 200;
int dataLog[2][200];
long total = 0;
int average[2] = {0, 0};
bool covered[2] = {false, false};
int entered = 0;

unsigned long time1 = millis();
int outputCounter = 0;
int outputWaitTime = 50; // how long to wait between sending to adafruit in cyces

int coveredTimes[2] = {100, 100}; // loops since the sensor was covered

void setup() {
  pinMode(ledPin, OUTPUT);
  pinMode(sensPin, INPUT);
  Serial.begin(9600);

  io.connect();
  while(io.status() < AIO_CONNECTED){
    Serial.println("Connecting");
    delay(500);
  }
  Serial.println(io.statusText());
}

void loop() {
  io.run();

  // Read the light values from the sensors
  sensVals[0] = analogRead(sensPins[0]);
  sensVals[1] = analogRead(sensPins[1]);

  // Get average of last recordLength readings and update log of data
  total = 0;
  for(int i = recordLength-2; i>=0; i--){
    dataLog[0][i+1] = dataLog[0][i];
    total += dataLog[0][i];
  }
  average[0] = total/recordLength;
  dataLog[0][0] = sensVal;

  // Get average of last recordLength readings and update log of data, again
  total = 0;
  for(int i = recordLength-2; i>=0; i--){
    dataLog[1][i+1] = dataLog[1][i];
    total += dataLog[1][i];
  }
  average[1] = total/recordLength;
  dataLog[1][0] = sensVal;

  if((average - sensVal) > 100 && covered == false){
    Serial.println("crossed one");
    entered += 1;
    coveredTimes[0] = 0;
  }
  if((average - sensVal) > 100 && covered == false){
    Serial.println("crossed one");
    entered += 1;
    coveredTimes[1] = 0;
  }

  coveredTimes[0] ++;
  coveredTimes[1] ++;
  

  unsigned long time2 = millis();
  if(abs(time1 - time2) > 1000){
    unsigned long time1 = millis();
    Serial.println(entered);
      output -> save(entered); 
  }
  
  covered = {(average[0] - sensVal[0]) > 100, (average[1] - sensVal[1]) > 100};
  if(covered == true){
    digitalWrite(ledPin, HIGH);
  }else{
    digitalWrite(ledPin, LOW);
  }
  delay(10);
}
