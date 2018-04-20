#include "ESP8266.h"
#include "Webpage.h"

#define MOT_L_P 3
#define MOT_L_N 4
#define MOT_R_P 5
#define MOT_R_N 6
#define ESP_EN 2
#define LED 13
#define TRIG A3
#define ECHO A4
#define LED_A 10
#define LED_COM 11
#define LED_K 12

#define BOOT_DELAY 1000
#define WLAN_SSID "StarSuolo-Fi"
#define IP_ADDRESS "192.168.1.1"
#define SERVER_PORT 80
#define BAUD_RATE 115200
#define BLINK_TIME 200
#define MIN_DIST 10

ESP8266 ap;
unsigned int rho = 0,
             phi = 0;
unsigned long tmr = 0;

void setup() {
  init_motor();
  bootstrap();

  if (!ap.baud() || !ap.reset() || !ap.init(F(WLAN_SSID), F(IP_ADDRESS), SERVER_PORT) || \
    !ap.baud(BAUD_RATE))
    terminate();
}

void loop() {
	int link;
	String http_req = ap.receive(link);
	if (link != -1) {
		if (http_req.indexOf(F("GET / ")) != -1) {
			ap.send(link, webpage);
		}
		else {
      if (unsigned int pos = http_req.indexOf(F("POLAR /")) != -1) {
        rho = http_req.substring(pos + 6).toInt();
        phi = http_req.substring(pos + ((String)rho).length() + 7).toInt();
        ap.send(link, "OK");
      }
		}
    ap.stop(link);
	}
	drive_motor(rho, phi, distance());
  blnk();
}

void blnk() {
  pinMode(LED_A, OUTPUT);
  pinMode(LED_K, OUTPUT);
  pinMode(LED_COM, INPUT);
  digitalWrite(LED_K, LOW);
  if (millis() >= tmr + 500) {
    tmr = millis();
    digitalWrite(LED_A, !digitalRead(LED_A));
  }
}

void bootstrap() {
  pinMode(LED, OUTPUT);
  pinMode(ESP_EN, OUTPUT);
  digitalWrite(ESP_EN, LOW);
  for (int n = 0; n < 4*BOOT_DELAY/BLINK_TIME; n++) {
    digitalWrite(LED, HIGH);
    delay(BLINK_TIME/4);
    digitalWrite(LED, LOW);
    delay(BLINK_TIME/4);
  }
  digitalWrite(ESP_EN, HIGH);
}

void init_motor() {
  pinMode(MOT_L_P, OUTPUT);
  pinMode(MOT_L_N, OUTPUT);
  pinMode(MOT_R_P, OUTPUT);
  pinMode(MOT_R_N, OUTPUT);
  
  digitalWrite(MOT_L_P, LOW);
  digitalWrite(MOT_L_N, LOW);
  digitalWrite(MOT_R_P, LOW);
  digitalWrite(MOT_R_N, LOW);
}

void drive_motor(unsigned int rho, unsigned int phi, unsigned int distance) {
  if (rho > 0 && phi <= 180 && distance > MIN_DIST) {
    if (phi <= 90) {
      analogWrite(MOT_L_P, (255*rho)/120);
      analogWrite(MOT_R_P, (((255*rho)/120)*phi)/90);
    }
    else {
      analogWrite(MOT_L_P, (((255*rho)/120)*(180 - phi))/90);
      analogWrite(MOT_R_P, (255*rho)/120);
    }
      digitalWrite(MOT_L_N, LOW);
      digitalWrite(MOT_R_N, LOW);
  }
  else if (rho > 0 && phi > 180) {
    phi = 360 - phi;
    if (phi <= 90) {
      analogWrite(MOT_L_P, 255 - (255*rho)/120);
      analogWrite(MOT_R_P, 255 - (((255*rho)/120)*phi)/90);
    }
    else {
      analogWrite(MOT_L_P, 255 - (((255*rho)/120)*(180 - phi))/90);
      analogWrite(MOT_R_P, 255 - (255*rho)/120);
    }
    digitalWrite(MOT_L_N, HIGH);
    digitalWrite(MOT_R_N, HIGH);
  }
  else {
    digitalWrite(MOT_L_P, LOW);
    digitalWrite(MOT_L_N, LOW);
    digitalWrite(MOT_R_P, LOW);
    digitalWrite(MOT_R_N, LOW);
  }
}

unsigned int distance() {
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
  digitalWrite(TRIG, HIGH);
  delayMicroseconds(5);
  digitalWrite(TRIG, LOW);
  unsigned long tof = pulseIn(ECHO, HIGH);
  return (tof%65536)/58.3;
}

void terminate() {
  pinMode(LED, OUTPUT);
  while (true) {
    digitalWrite(LED, !digitalRead(LED));
    delay(BLINK_TIME);
  }
}
