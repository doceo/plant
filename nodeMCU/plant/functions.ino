
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
 
   if (client.connect(server, 3000)) { // use ip 184.106.153.149 or api.thingspeak.com
   Serial.println("WiFi Client connected ");
   
   String postStr= String(rnd);

   String url = "GET /dato/acquisisci/" + postStr;
     Serial.println(url);

     client.print(url);
     client.print("HTTP/1.0 \n\n");
     Serial.println("HTTP/1.0 \n\n");
     
     client.println();
     client.stop();
 
   
   delay(1000);
   
   }//end if
   sent++;
 client.stop();
}//end send
