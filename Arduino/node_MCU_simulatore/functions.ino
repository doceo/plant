
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
 
void sendData(int data, int sensore)
{  
   WiFiClient client;
   const char* server = "192.168.1.75";
  
   //cerca di stabilire una connessione al server sulla porta 3000, 
   //nel caso ci dovesse riuscire invia al monitor seriale un feedback
   if (client.connect(server, 3000)) { 
   Serial.println("WiFi Client connected ");
   
   //converte in oggetto Stringa il parametro ricevuto
   String postStr= String(data);
   String sens = String(sensore);

   //costruisce la stringa da inviare, si noti il parametro GET che denota il metodo scelto
   //attribuiamo il valore 2 al sensore collegato
   String url = "GET /acquisisci/" + sens +"/" + postStr + " HTTP/1.1";
   Serial.println(postStr);

   //tutte le istruzioni sono duplicate per poter inviare la stessa sequenza di dati 
   //al server Node e al monitor seriale
   client.println(url);
   Serial.println(url);
   
   //per poter inviare correttamente una richiesta di tipo GET bisogna indicare l'HOST di destniazione
   client.println("Host: 192.168.1.75:3000");
   Serial.println("Host: 192.168.1.75:3000");
   
   client.println("Connection: close");
   Serial.println("Connection: close");
     
   client.println();
   client.stop();   
   
   }//end if

}//end send
