
/*
 Basic MQTT example

 This sketch demonstrates the basic capabilities of the library.
 It connects to an MQTT server then:
  - publishes "hello world" to the topic "outTopic"
  - subscribes to the topic "inTopic", printing out any messages
    it receives. NB - it assumes the received payloads are strings not binary

 It will reconnect to the server if the connection is lost using a blocking
 reconnect function. See the 'mqtt_reconnect_nonblocking' example for how to
 achieve the same result without blocking the main loop.
 
*/

#include <SPI.h>
#include <Ethernet.h>
#include <PubSubClient.h>

String puntoAcq;
String temp;
String terUm;
String AriaUm;
String timeAcq;

long lastMsg = 0;
char msg[50];
int value = 0;
  

// Update these with values suitable for your network.
byte mac[]    = {  0xDE, 0xED, 0xBA, 0xFE, 0xFE, 0xED };
IPAddress ip(192, 168, 1, 230);
IPAddress server(192, 168, 1, 248);

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i=0;i<length;i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
}

EthernetClient ethClient;
PubSubClient client(ethClient);

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect("arduinoClient")) {
      Serial.println("connected");

      // ... and resubscribe
//      client.subscribe("acqDati");
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

  client.setServer(server, 1883);
//  client.setCallback(callback);

  Ethernet.begin(mac, ip);
  // Allow the hardware to sort itself out
  delay(1500);
}

void loop()
{
  if (!client.connected()) {
    reconnect();
  }
//  client.loop();

  
  
  puntoAcq = String(2);
  temp = String(random(15,30));
  terUm = String(random(0, 60));
  AriaUm = String(random(30, 90));
  //YYYY-MM-dd hh:mm:ss
  String MM = '0' + String(4 ); // String(random(1,13));
  MM = MM.substring(MM.length() - 2, MM.length());
  String dd = '0' + String(random(1,32));
  dd = dd.substring(dd.length() - 2, dd.length());
  String hh = '0' + String(random(0,24));
  hh = hh.substring(hh.length() - 2, hh.length());
  String mm = '0' + String(random(0,60));
  mm = mm.substring(mm.length() - 2, mm.length());
  String ss = '0' + String(random(0,60));
  ss = ss.substring(ss.length() - 2, ss.length());

  timeAcq =  (String)2018 + '-' + MM + "-" + dd + "-" + hh + "-" + mm + "-" + ss;
  

  String msg= puntoAcq + ',' + temp + ',' + terUm + ',' + AriaUm + ',' + timeAcq + ',';
Serial.println(msg);
  
  long now = millis();
  if (now - lastMsg > 2000) {
    lastMsg = now;
    ++value;
    Serial.print("messaggio pubblicato: ");
    Serial.println(msg);
    char buf[64];
    msg.toCharArray(buf, 64);
    client.publish("acqDati", buf);

    delay(10000);
  
}
}

