
#include <ESP8266WiFi.h>

//definisco le costanti che determinano la connessione. Bisogna sostituire l'indirizzo IP della macchina a cui collegarsi.
const char* server = "192.168.1.92";
const char* MY_SSID = "*****";
const char* MY_PWD = "*****";

#define KY037_AN A0 

int temp = 3000000;


void setup() {
  Serial.begin(115200);
   pinMode(KY037_AN, INPUT); 
  //richiamo la funzione che gestisce la connessione
  connectWifi();
}
 
void loop() {
  int umd;

  umd = analogRead(KY037_AN);

  Serial.println(umd);
  
  sendUmid(umd);

  delay(temp);
}
 
