
#include <Process.h>

String server = "http://192.168.1.92:3000";

int sensorPin = A0;    // select the input pin for the potentiometer
int terra;

String url;


void setup() {
  // Initialize Bridge
  Bridge.begin();

  // Initialize Serial
  Serial.begin(9600);

}

void loop() {
  // Do nothing here.
  runCurl();
  Serial.print("leggo...");
  terra = analogRead(A0);
  Serial.print(terra);
  delay(3000000);
}

