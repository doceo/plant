
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

//   String url = "GET /dato/acquisisci/" + postStr;
//     Serial.println(postStr);

     client.print("GET ");
//     client.print(server);
//     client.print(":3000");
     client.print("/dato/acquisisci/");
     Serial.print("GET /dato/acquisisci/");
     
     client.print(postStr);
     Serial.print(postStr);
     
//     client.println();
//     Serial.println();
     
     client.print(" HTTP/1.1 \n");
//     client.println();
  
     Serial.println(" HTTP/1.1 \n\n");
     
   delay(2000);
   client.stop();   
   
   }//end if

}//end send
