#include <dht11.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
dht11 DHT;

#define DHT11_PIN 13
#define HYGRO A0
#define CYCLETIME 10000

#define IO_USERNAME    "diomede"
#define IO_KEY         "30e0f9943a9243768e5c6af82fbbc16a"

#define MQTT_SERVER "io.adafruit.com"
#define MQTT_PORT 1883



PubSubClient client();
client.setServer(MQTT_SERVER, MQTT_PORT);

void callback (char* topic, byte* payload, unsigned int length) {
  Serial.println(topic);
  Serial.write(payload, length);
  Serial.println("");
}

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
 // DISPLAY DATA
  Serial.print(DHT.humidity,1);
  Serial.print(",\t");
  Serial.println(DHT.temperature,1);
  
  
//  int DHT.temperature;

  delay(1000);
  
  sendData(DHT.temperature, 0);

  sendData(DHT.humidity, 1);

  delay(CYCLETIME);
}
 
