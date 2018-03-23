#include <dht11.h>
#include <ESP8266WiFi.h>
dht11 DHT;

#define DHT11_PIN 13

int temp = 900000;


void setup() {
  Serial.begin(115200);
   pinMode(DHT11_PIN, INPUT); 
  //richiamo la funzione che gestisce la connessione
  connectWifi();
}
 
void loop() {
   int chk;
  Serial.print("DHT11, \t");
  chk = DHT.read(DHT11_PIN);    // READ DATA
  switch (chk){
    case DHTLIB_OK:  
                Serial.print("OK,\t"); 
                break;
    case DHTLIB_ERROR_CHECKSUM: 
                Serial.print("Checksum error,\t"); 
                break;
    case DHTLIB_ERROR_TIMEOUT: 
                Serial.print("Time out error,\t"); 
                break;
    default: 
                Serial.print("Unknown error,\t"); 
                break;
  }
 // DISPLAT DATA
  Serial.print(DHT.humidity,1);
  Serial.print(",\t");
  Serial.println(DHT.temperature,1);
  
  
//  int DHT.temperature;

  delay(1000);
  
  sendData(DHT.temperature, 0);

  sendData(DHT.humidity, 1);

  delay(temp);
}
 
