const int VRX = A0;
const int VRY = A1;
const int SW  = 2;

void setup() {

  pinMode(SW, INPUT_PULLUP);

  Serial.begin(9600);

}

void loop() {

  int x = analogRead(VRX);
  int y = analogRead(VRY);
  int button = digitalRead(SW);

  // Send:
  // X,Y,Button

  Serial.print(x);
  Serial.print(",");
  Serial.print(y);
  Serial.print(",");
  Serial.println(button);

  delay(20);
}