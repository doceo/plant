
#include <ESP8266WiFi.h>

const char* server = "192.168.1.67";
const char* MY_SSID = "____";
const char* MY_PWD = "___";


int temp = 1000;
int sent = 0;
void setup() {
  Serial.begin(115200);
  connectWifi();
}
 
void loop() {
  int rnd;

  rnd = random(0,40);

//  Serial.print(String(sent)+" Temperature: ");
  Serial.println(rnd);
  
  sendRnd(rnd);

  delay(temp);
}
 
