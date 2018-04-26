#define RX_TIMEOUT 5
#define REPLY_TIMEOUT 1000
#define RST_DELAY 500
#define DEFAULT_BAUD 115200
#define BAUD_TABLE 9600, 14400, 19200, 28800, 38400, 57600, 115200, 128000, \
	230400, 250000, 256000, 460800, 500000, 512000, 921600, 1000000, 1024000
#define BAUD_TABLE_LEN 17
#define MAX_PKT_SIZE 2048
#define TX_BUF_SIZE 256
#define PKT_DELAY 20



class ESP8266 {

private:

	unsigned long _baud = DEFAULT_BAUD;

	String read(unsigned int timeout = RX_TIMEOUT) {
		String buffer = "";
		unsigned long start = millis();
		while (millis() - start < timeout)
			if (Serial.available() > 0) {
				buffer += (char)Serial.read();
				start = millis();
			}
		return buffer;
	}

  bool wait(String pattern = "", unsigned int timeout = REPLY_TIMEOUT) {
    if (pattern != "") {
      String buffer = "";
      unsigned long start = millis();
      while (millis() - start < timeout)
        if (Serial.available() > 0) {
          buffer += (char)Serial.read();
          if (buffer.indexOf(pattern) != -1) {
            read();
            return true;
          }
          start = millis();
        }
    }
    return false;
  }

public:

	bool baud(unsigned long baud_rate = 0) {
		const static unsigned long baud[BAUD_TABLE_LEN] PROGMEM = {BAUD_TABLE};
		for (int i = 0; i < BAUD_TABLE_LEN; i++) {
			unsigned long baud_cur = pgm_read_dword(baud + i);
			if (baud_rate == baud_cur) {
				Serial.print(F("AT+UART_CUR="));
				Serial.print((String)baud_cur);
				Serial.println(F(",8,1,0,0"));
				read();
			}
			else if (baud_rate != 0)
				continue;
			Serial.begin(baud_cur);
			Serial.println(F("AT"));
			if (wait("OK")) {
				_baud = baud_cur;
				return true;
			}
		}
		_baud = DEFAULT_BAUD;
		Serial.begin(_baud);
		return false;
	}

  bool reset() {
    Serial.println(F("AT+RST"));
    if (!wait("OK"))
      return false;
    delay(RST_DELAY);
    Serial.println(F("ATE0"));
    return wait("OK");
  }

  bool init(String ssid, String ip, unsigned int port = 80) {
    Serial.println(F("AT+CWMODE_CUR=2"));
    if (!wait("OK"))
      return false;
    Serial.print(F("AT+CWSAP_CUR=\""));
    Serial.print(ssid);
    Serial.println(F("\",,5,0"));
    if (!wait("OK"))
      return false;
    Serial.print(F("AT+CIPAP_CUR=\""));
    Serial.print(ip);
    Serial.println(F("\""));
    if (!wait("OK"))
      return false;
    Serial.println(F("AT+CWDHCP_CUR=0,1"));
    if (!wait("OK"))
      return false;
    Serial.println(F("AT+CIPMODE=0"));
    if (!wait("OK"))
      return false;
    Serial.println(F("AT+CIPMUX=1"));
    if (!wait("OK"))
      return false;
    Serial.print(F("AT+CIPSERVER=1,"));
    Serial.println((String)port);
    return wait("OK");
  }

  bool init(String hostname, String ssid, String pwd) {
    Serial.println(F("AT+CWMODE_CUR=1"));
    if (!wait("OK"))
      return false;
    Serial.print(F("AT+CWHOSTNAME=\""));
    Serial.print(hostname);
    Serial.println(F("\""));
    if (!wait("OK"))
      return false;
    Serial.print(F("AT+CWJAP_CUR=\""));
    Serial.print(ssid);
    Serial.print(F("\",\""));
    Serial.print(pwd);
    Serial.println(F("\""));
    if (!wait("OK"))
      return false;
    Serial.println(F("AT+CIPMODE=0"));
    if (!wait("OK"))
      return false;
    Serial.println(F("AT+CIPMUX=1"));
    if (!wait("OK"))
      return false;
  }

  bool connect(String url, unsigned int port = 80, unsigned int keepalive = 3600) {
    Serial.print(F("AT+CIPSTART=\"TCP\",\""));
    Serial.print(url);
    Serial.print("\",");
    Serial.print((String)port);
    Serial.print(",");
    Serial.println((String)keepalive);
    return wait("OK");
  }

  bool stop(byte link = 5) {
    Serial.print(F("AT+CIPCLOSE="));
    Serial.println((String)link);
    return wait("OK");
  }

  String receive(int &link) {
    link = -1;
    String buffer = read();
    int token_pos = buffer.indexOf(F("+IPD,"));
    if (token_pos != -1) {
      link = buffer.substring(token_pos + 5, token_pos + 6).toInt();
      int sep_pos = buffer.indexOf(':', token_pos + 6);
      if (sep_pos != -1)
        return buffer.substring(sep_pos + 1);
    }
    return "";
  }

  bool send(byte link, String buffer) {
    Serial.print(F("AT+CIPSEND="));
    Serial.println((String)link + "," + (String)(buffer.length()%MAX_PKT_SIZE));
    if (!wait(">"))
      return false;
    Serial.println(buffer.substring(0, MAX_PKT_SIZE));
    return wait(F("SEND OK"));
  }

  bool send_P(byte link, const char *str) {
    while (pgm_read_byte(str)) {
      String buffer = "";
      while (pgm_read_byte(str) && buffer.length() < TX_BUF_SIZE)
        buffer += (char)pgm_read_byte(str++);
      if (!send(link, buffer))
        return false;
//      delay(PKT_DELAY);
    }
    return true;
  }

};
