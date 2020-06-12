#include "AdafruitIO_WiFi.h"


#define IO_USERNAME "Olikat"
#define FEED_NAME "Inside"
#define IO_KEY "cant put on github"
#define WIFI_SSID "FBI Watch Van #6"
#define WIFI_PASS "aaaaaaaa"



AdafruitIO_WiFi  io(IO_USERNAME, IO_KEY, WIFI_SSID, WIFI_PASS);
AdafruitIO_Feed *output = io.feed(FEED_NAME);

int ledPin = 5;
int sensPin = A0;
int sensVal = 0;

int recordLength = 200;
int dataLog[200];
long total = 0;
int average = 0;
bool covered = false;
int entered = 0;

unsigned long time1 = millis();
int outputCounter = 0;
int outputWaitTime = 50; // how long to wait between sending to adafruit in cyces

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
 
  sensVal = analogRead(sensPin);
  
  total = 0;
  for(int i = recordLength-2; i>=0; i--){
    dataLog[i+1] = dataLog[i];
    total += dataLog[i];
  }
  average = total/recordLength;
  dataLog[0] = sensVal;

  if((average - sensVal) > 100 && covered == false){
    Serial.println("entered");
    entered += 1;
  }
  
//  outputCounter += 1;
//  if(outputCounter >= outputWaitTime){
//    outputCounter = 0;
//    Serial.println(entered);
//    output -> save(entered); 
//  }
  unsigned long time2 = millis();
  if(abs(time1 - time2) > 1000){
    unsigned long time1 = millis();
    Serial.println(entered);
      output -> save(entered); 
  }
  
  covered = (average - sensVal) > 100;
  if(covered == true){
    digitalWrite(ledPin, HIGH);
  }else{
    digitalWrite(ledPin, LOW);
  }
  delay(10);
}
