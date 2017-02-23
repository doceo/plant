
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
 
   if (client.connect(server, 3000)) { 
   Serial.println("WiFi Client connected ");
   
   String postStr= String(rnd);

   String url = "GET /dato/acquisisci/" + postStr + " HTTP/1.1";
   Serial.println(postStr);

   client.println(url);
   Serial.println(url);
   
   client.println("Host: 192.168.1.67:3000");
   Serial.println("Host: 192.168.1.67:3000");
   
   client.println("Connection: close");
   Serial.println("Connection: close");
     
   client.println();
     
   Serial.println();
   digitalWrite(14, HIGH);            
   delay(500);
   digitalWrite(14, LOW);
  
   delay(1500);
   client.stop();   
   
   }//end if

}//end send
