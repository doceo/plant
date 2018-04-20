
/*
 Basic MQTT example
*/

#include <SPI.h>
#include <Ethernet.h>
#include <PubSubClient.h>

// Our first sensor, a cheap DHT11 temperature and humidty sensor
//#include <DHT.h>
#define DHTPIN 7
#define DHTTYPE DHT11 //21 or 22 also an option
//DHT dht(DHTPIN, DHTTYPE);
unsigned long readTime;

// Update these with values suitable for your network.
byte mac[]    = {  0xDE, 0xED, 0xBA, 0xFE, 0xFE, 0xED };
IPAddress ip(192, 168, 40, 151);
IPAddress server(192, 168, 40, 44);
char message_buff[100]; // this buffers our incoming messages so we can do something on certain commands

EthernetClient ethClient;
PubSubClient client(ethClient);


void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  int i=0;
  for (i=0;i<length;i++) {
    Serial.print((char)payload[i]);
    message_buff[i] = payload[i];
  }
  message_buff[i] = '\0';
  String msgString = String(message_buff);
  if (msgString.equals("OFF")) {
    client.publish("openhab/himitsu/command","acknowedging OFF");
  }
  else if(msgString.equals("ON")){
    client.publish("openhab/himitsu/command","acknowedging ON");
  }
  Serial.println();
}


void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect("arduinoClient")) {
      Serial.println("connected");
      // Once connected, publish an announcement...
      client.publish("openhab","himitsu sensor, reporting in");
      // ... and resubscribe
      client.subscribe("openhab/himitsu/command");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void setup()
{
  Serial.begin(57600);

  client.setServer("192.168.1.99", 1883);
  client.setCallback(callback);

  Ethernet.begin(mac);
  
//  dht.begin();
  // Allow the hardware to sort itself out
  delay(1500);
  Serial.println(Ethernet.localIP());
  readTime = 0;
}

void loop()
{
  
  if (!client.connected()) {
    reconnect();
  }
  
  client.loop();
  
  //check if 5 seconds has elapsed since the last time we read the sensors. 
  if(millis() > readTime+60000){
    sensorRead();
  }
  
}

void sensorRead(){
  readTime = millis();
 // Reading temperature or humidity takes about 250 milliseconds!
  // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
  float h = 1;//dht.readHumidity();
  // Read temperature as Celsius (the default)
  float t = 2;//dht.readTemperature();
  // Read temperature as Fahrenheit (isFahrenheit = true)
  float f = 3;//dht.readTemperature(true);

  // Check if any reads failed and exit early (to try again).
  if (isnan(h) || isnan(t) || isnan(f)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  // Compute heat index in Fahrenheit (the default)
  float hif = 4;//dht.computeHeatIndex(f, h);
  // Compute heat index in Celsius (isFahreheit = false)
  float hic = 5;//dht.computeHeatIndex(t, h, false);

  char buffer[10];
  dtostrf(t,0, 0, buffer);
  client.publish("openhab/himitsu/temperature",buffer);
  //Serial.println(buffer);
  dtostrf(h,0, 0, buffer);
  client.publish("openhab/himitsu/humidity",buffer);
  
  //client.publish("inTopic/humidity",sprintf(buf, "%f", h));
  /*Serial.print("Humidity: ");
  Serial.print(h);
  Serial.print(" %\t");
  Serial.print("Temperature: ");
  Serial.print(t);
  Serial.print(" *C ");
  Serial.print(f);
  Serial.print(" *F\t");
  Serial.print("Heat index: ");
  Serial.print(hic);
  Serial.print(" *C ");
  Serial.print(hif);
  Serial.println(" *F"); */
}
