#include <SPI.h>
#include <RH_NRF24.h>
#include "TimeLib.h"
#include "WiFiEsp.h"
#include "WiFiEspUdp.h"
#include "PubSubClient.h"

#define CS 7
#define CLK 8

#define SSID "TP-LINK_9EB455"
#define KEY ""
#define MQTT_SERVER "192.168.1.100"
#define MQTT_PORT 1883
#define CLIENT_ID "espClient"
#define TOPIC "acqDati"
#define UDP_PORT 8888

//#define NTP_SERVER "us.pool.ntp.org"
//#define NTP_SERVER "time.nist.gov"
#define NTP_SERVER "ntp1.inrim.it"

#define NTP_PORT 123
#define NTP_PACKET_SIZE 48



RH_NRF24 nrf24(CS, CLK);

WiFiEspClient espClient;
PubSubClient client(espClient);
WiFiEspUDP udp;



void setup() {
  Serial.begin(115200);

  if (nrf24.init())
    if (nrf24.setChannel(1))
      if (!nrf24.setRF(RH_NRF24::DataRate2Mbps, RH_NRF24::TransmitPower0dBm))
        die();

  WiFi.init(&Serial);
  WiFi.config(IPAddress(192, 168, 1, 222));

  delay(100);

  WiFi.begin(SSID, KEY);

  while (WiFi.status() != WL_CONNECTED);

  udp.begin(UDP_PORT);
  client.setServer(MQTT_SERVER, MQTT_PORT);
}

void loop() {
  if (nrf24.available()) {
    uint8_t buffer[RH_NRF24_MAX_MESSAGE_LEN];
    uint8_t length = sizeof(buffer);
    if (nrf24.recv(buffer, &length)) {
//      Serial.println((char*)buffer);
/*      
      // Send a reply
      uint8_t data[] = "And hello back to you";
      nrf24.send(data, sizeof(data));
      nrf24.waitPacketSent();
      Serial.println("Sent a reply");
    }
    else
    {
      Serial.println("recv failed");*/
  while (!client.connect(CLIENT_ID)) {
    delay(1000);
  }

  unsigned long epoch = 0;//getNtpTime(NTP_SERVER);
  String msg;
//  if (epoch != 0)
    msg = (String)(char*)buffer + "," + String(year(epoch)) + "-" + pad(String(month(epoch))) + "-" + pad(String(day(epoch))) + " " + \
      pad(String(hour(epoch))) + ":" + pad(String(minute(epoch))) + ":" + pad(String(second(epoch)));
//  else
//    msg = "No NTP";
  client.publish(TOPIC, msg.c_str());
    }
  }
}

void die() {
  while (true);
}

unsigned long getNtpTime(char* addr) {return millis()/1000;
  byte buf[NTP_PACKET_SIZE];
  memset(buf, 0, NTP_PACKET_SIZE);

  buf[0] = 0b11100011;
  buf[1] = 0;
  buf[2] = 6;
  buf[3] = 0xEC;

  buf[12] = 49;
  buf[13] = 0x4E;
  buf[14] = 49;
  buf[15] = 52;

  if (udp.beginPacket(addr, NTP_PORT) == 0) return 0;
  udp.write(buf, NTP_PACKET_SIZE);
  if (udp.endPacket() == 0) return 0;
  unsigned long start = millis();
  while (udp.parsePacket() == 0)
    if (millis() - start > 2000)
      return 0;
  if (udp.read(buf, NTP_PACKET_SIZE) > 0) {

  unsigned long epoch = ((buf[40] << 24) + (buf[41] << 16) + (buf[42] << 8) + buf[43]) - 0*2208988800UL + 7200;
  return epoch;
  } else return 0;
}

String pad(String str) {
  str = '0'+ str;
  return str.substring(str.length() - 2, str.length());
}
