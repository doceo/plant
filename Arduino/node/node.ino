#include <SPI.h>
#include <RH_NRF24.h>
#include <dht11.h>

#define CS 7
#define CLK 8
#define DHT11_PWR 2
#define HYGRO_PWR 3
#define DHT11_PIN 4
#define HYGRO A0
#define CYCLETIME 10000

#define NODE_ID random(1, 4)
//"1"

RH_NRF24 nrf24(CS, CLK);
dht11 DHT;



void setup() {
  randomSeed(analogRead(A5));
  
  pinMode(DHT11_PWR, OUTPUT);
  pinMode(HYGRO_PWR, OUTPUT);
  digitalWrite(DHT11_PWR, HIGH);
  digitalWrite(HYGRO_PWR, HIGH);

  Serial.begin(9600);

  if (!nrf24.init())
    die();
  if (!nrf24.setChannel(108))
    die();
  if (!nrf24.setRF(RH_NRF24::DataRate250kbps, RH_NRF24::TransmitPower0dBm))
    die();
}

void loop() {
  if (DHT.read(DHT11_PIN) == DHTLIB_OK) {
    Serial.println("DHT11 read");
    byte hygro = map(analogRead(HYGRO), 0, 1023, 100, 0);
    String data = (String)NODE_ID + "," + (String)DHT.temperature + "," + (String)hygro + "," + (String)DHT.humidity;
    Serial.println(data);
    uint8_t buffer[RH_NRF24_MAX_MESSAGE_LEN];
    data.toCharArray(buffer, data.length() + 1);
    nrf24.send(buffer, data.length());
    nrf24.waitPacketSent();
    Serial.println("Packet sent");
  }
/*
  uint8_t buf[RH_NRF24_MAX_MESSAGE_LEN];
  uint8_t len = sizeof(buf);

  if (nrf24.waitAvailableTimeout(500))
  { 
    // Should be a reply message for us now   
    if (nrf24.recv(buf, &len))
    {
      Serial.print("got reply: ");
      Serial.println((char*)buf);
    }
    else
    {
      Serial.println("recv failed");
    }
  }
  else
  {
    Serial.println("No reply, is nrf24_server running?");
  }*/
  delay(CYCLETIME);
}

void die() {
  while (true);
}
