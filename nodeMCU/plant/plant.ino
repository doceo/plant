
#include <ESP8266WiFi.h>

//definisco le costanti che determinano la connessione. Bisogna sostituire l'indirizzo IP della macchina a cui collegarsi.
const char* server = "192.168.1.67";
const char* MY_SSID = "____";
const char* MY_PWD = "___";


int temp = 1000;


void setup() {
  Serial.begin(115200);

  //richiamo la funzione che gestisce la connessione
  connectWifi();
}
 
void loop() {
  int rnd;

  rnd = random(0,40);

  Serial.println(rnd);
  
  sendRnd(rnd);

  delay(temp);
}
 
