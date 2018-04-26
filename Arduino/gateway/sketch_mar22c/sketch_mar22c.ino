#include <SPI.h>
#include <PubSubClient.h>
#include <Ethernet.h>

// Pins
// Analog 0 is the input pin

// Variables
const int Tempin = 0;
int value;
float temp,tempC;
String pubstring;
unsigned long time;
char message_buffer[100];

// Network Settings
// MAC address of ethernet shield
// Look for it on a sticket at the bottom of the shield. 
// Old Arduino Ethernet Shields or clones may not have a dedicated MAC address. Set any hex values here.
byte MAC_ADDRESS[] = {  0x78, 0x45, 0xC4, 0xAA, 0xE5, 0x6F };

// IP address of MQTT server
byte MQTT_SERVER[] = {192,168,40,44};
byte ip[] = {192,168,1,1};
EthernetClient ethClient;
PubSubClient client;


void setup()
{  
  // Initilize serial link for debugging
  Serial.begin(9600);
  
  Ethernet.begin(MAC_ADDRESS,ip);
  Serial.print("Local IP=");
  Serial.println(Ethernet.localIP());
  client  = PubSubClient(MQTT_SERVER, 1883, callback, ethClient);
  }

void loop()
{
  if (!client.connected())
  {
    //client.connect("clientID", "mqtt_username", "mqtt_password");
    client.connect("sfo-arduino");
    client.publish("sfo/arduino/alive", "I'm alive!");
  }
  else{
    client.connect("arduino");
    Serial.println("here i am connected");}
 
  //tempC = dtostrf(tempF,5,2,message_buffer); 
  
  // Publish sensor reading every X milliseconds
  
  
  if (millis() > (time + 5000)) {
    time = millis();
    value = analogRead(Tempin);
    temp = (value/1024.0)*5000;
    tempC = temp/10;
    pubstring = String(tempC);
     pubstring.toCharArray(message_buffer, pubstring.length() + 1);
    client.publish("arduino/temperature",message_buffer);
    //Serial.println("published!");
    //Serial.println(message_buffer);
}
    
  // MQTT client loop processing
  client.loop();
}

// Handles messages arrived on subscribed topic(s)
void callback(char* topic, byte* payload, unsigned int length) {
}
