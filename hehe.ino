/*
 * Arduino Joystick Reader
 * -----------------------
 * Reads a 2-axis analog joystick (X, Y) and its push button.
 * Prints raw and mapped values to the Serial Monitor.
 *
 * Wiring:
 *   VRx  -> A0
 *   VRy  -> A1
 *   SW   -> D2  (uses INPUT_PULLUP; pressed = LOW)
 *   VCC  -> 5V
 *   GND  -> GND
 */

const int PIN_X     = A0;
const int PIN_Y     = A1;
const int PIN_BTN   = 2;

const int DEADZONE  = 50;     // ignore small noise around center
const int CENTER    = 512;    // raw center value (10-bit ADC)
const int THRESHOLD = 700;    // raw value considered "pressed" for axes

// 0 = centered, 1 = up/right, -1 = down/left
int axisDirection(int raw, int center) {
  if (raw > center + DEADZONE) return  1;
  if (raw < center - DEADZONE) return -1;
  return 0;
}

// Map raw 0..1023 to -100..100 with a deadzone
int axisPercent(int raw, int center) {
  int value = constrain(raw, 0, 1023);
  if (abs(value - center) <= DEADZONE) return 0;

  if (value > center) {
    return map(value, center + DEADZONE, 1023, 0, 100);
  } else {
    return map(value, 0, center - DEADZONE, -100, 0);
  }
}

void setup() {
  pinMode(PIN_BTN, INPUT_PULLUP);
  Serial.begin(9600);
  while (!Serial) { /* wait for native-USB boards */ }

  Serial.println(F("Joystick ready. Move the stick or press the button."));
}

void loop() {
  int xRaw = analogRead(PIN_X);
  int yRaw = analogRead(PIN_Y);
  bool btn = (digitalRead(PIN_BTN) == LOW);  // pressed == LOW with INPUT_PULLUP

  int xPct = axisPercent(xRaw, CENTER);
  int yPct = axisPercent(yRaw, CENTER);
  int xDir = axisDirection(xRaw, CENTER);
  int yDir = axisDirection(yRaw, CENTER);

  Serial.print("X: ");
  Serial.print(xRaw);
  Serial.print(" (");
  Serial.print(xPct);
  Serial.print("%)  Y: ");
  Serial.print(yRaw);
  Serial.print(" (");
  Serial.print(yPct);
  Serial.print("%)  Dir: ");
  Serial.print(xDir);
  Serial.print(",");
  Serial.print(yDir);
  Serial.print("  Btn: ");
  Serial.println(btn ? "PRESSED" : "released");

  delay(50);  // ~20 updates per second
}
