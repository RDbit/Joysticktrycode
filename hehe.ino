const int Jx = A0;
const int Jy = A1;
const int SW = 2;

void setup() {
  Serial.begin(9600);
  pinMode(SW, INPUT_PULLUP);
}

void loop() {
  int jx = analogRead(Jx);
  int jy = analogRead(Jy);
  int sw = digitalRead(SW);

  Serial.print("Jx: ");
  Serial.print(jx);
  Serial.print(" Jy: ");
  Serial.print(jy);
  Serial.print(" SW: ");
  Serial.println(sw);
}