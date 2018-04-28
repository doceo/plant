#include <SPI.h>
#include <RH_NRF24.h>
#include <dht11.h>

#define CS 7
#define CLK 8
#define DHT11_POWER 2
#define DHT11_PIN 4
#define HYGRO A0

#define NODE_ID "N0001"

RH_NRF24 nrf24(CS, CLK);
dht11 DHT;



void setup() {
  pinMode(DHT11_POWER, OUTPUT);
  digitalWrite(DHT11_POWER, HIGH);

  Serial.begin(9600);
  if (nrf24.init())
    if (nrf24.setChannel(1))
      if (nrf24.setRF(RH_NRF24::DataRate2Mbps, RH_NRF24::TransmitPower0dBm))
        Serial.println("nRF24 initialised");
      else {
        Serial.println("nRF24 not initialised");
        die();
      }
}

void loop() {
  if (DHT.read(DHT11_PIN) == DHTLIB_OK) {
    Serial.println("DHT11 read");
    byte hygro = map(analogRead(HYGRO), 0, 1023, 100, 0);
    String data = (String)NODE_ID + "," + (String)DHT.temperature + "," + (String)DHT.humidity + "," + (String)hygro;
    Serial.println(data);
    uint8_t buffer[RH_NRF24_MAX_MESSAGE_LEN];
    data.toCharArray(buffer, data.length());
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
  delay(10000);
}

void die() {
  while (true);
}
