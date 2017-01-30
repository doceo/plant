
#include <ESP8266WiFi.h>


const char* server = "192.168.1.18";

const char* MY_SSID = "_____";
const char* MY_PWD = "_____";
int temp = 1000;
int sent = 0;
void setup() {
  Serial.begin(115200);
  connectWifi();
}
 
void loop() {
  int rnd;

  rnd = random(1,100);

//  Serial.print(String(sent)+" Temperature: ");
//  Serial.println(temp);
  
  sendRnd(rnd);

  delay(temp);
}
 
void connectWifi()
{
  Serial.print("Connecting to "+*MY_SSID);
  WiFi.begin(MY_SSID, MY_PWD);
  while (WiFi.status() != WL_CONNECTED) {
  delay(1000);
  Serial.print(".");
  }
 
  Serial.println("");
  Serial.println("Connected");
  Serial.println("");  
}//end connect
 
void sendRnd(int rnd)
{  
   WiFiClient client;
 
   if (client.connect(server, 4156)) { // use ip 184.106.153.149 or api.thingspeak.com
   Serial.println("WiFi Client connected ");
   
   String postStr= String(rnd);

//   postStr += "\r\n\r\n";
   
//   client.print("POST /update HTTP/1.1\n");
//   client.print("Connection: close\n");
//   client.print("Content-Type: application/x-www-form-urlencoded\n");
//   client.print("Content-Length: ");
   client.print('dato/acquisisci/');
//   client.print("\n\n");
   client.print(postStr);
   delay(1000);
   
   }//end if
   sent++;
 client.stop();
}//end send
