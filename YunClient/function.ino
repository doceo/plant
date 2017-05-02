
void runCurl() {
  // Launch "curl" command and get Arduino ascii art logo from the network
 
  terra = analogRead(sensorPin);
  url = server + "/acquisisci/1/" + String(terra);
  
  // curl is command line program for transferring data using different internet protocols
  Process p;    // Create a process and call it "p"
  p.begin("curl");  // Process that launch the "curl" command
  p.addParameter("GET"); // Add the URL parameter to "curl"
  p.addParameter(url); // Add the URL parameter to "curl"
  p.run();    // Run the process and wait for its termination
  Serial.print("dato inviato");
  // Print arduino logo over the Serial
  // A process output can be read with the stream methods
  // Ensure the last bit of data is sent.
  Serial.flush();
}
