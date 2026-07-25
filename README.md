# Arduino Joystick Motion Matrix

A browser-based **Arduino joystick debugger**. It reads an analog joystick in real time and displays its X/Y position, switch state, and movement direction on a live matrix grid.

The dashboard is useful for checking whether a joystick module is wired correctly, seeing its center point, testing its push button, and spotting reversed or unstable axes before using it in a larger project.

> UI created by **RDbit**.

## Features

- Live X and Y analog values from `0` to `1023`
- Matrix display with a moving position ball
- Joystick orientation/debugging from the ball location
- Push-button status: **Pressed** or **Released**
- Smooth browser rendering for responsive movement
- No desktop software needed after uploading the Arduino sketch
- Uses the browser's **Web Serial API**

## Project files

```text
Joysticktrycode/
├── hehe.ino              # Arduino sketch — upload this to the Arduino
├── README.md             # This guide
└── ThewebHEHE/
    ├── index.html        # Dashboard page
    ├── style.css         # Motion Matrix UI
    └── script.js         # Web Serial connection and joystick reader
```

## What you need

- An Arduino board with USB serial support (Uno, Nano, Mega, etc.)
- A two-axis analog joystick module (usually pins `VRx`, `VRy`, `SW`, `VCC`, and `GND`)
- USB data cable
- Google Chrome or Microsoft Edge on a desktop/laptop

Web Serial is not supported by Firefox or Safari. Use Chrome or Edge for the dashboard.

## Wiring

The included Arduino code uses the following pins:

| Joystick pin | Arduino pin | Purpose |
|---|---:|---|
| `VCC` | `5V` | Power |
| `GND` | `GND` | Ground |
| `VRx` | `A0` | X-axis analog input |
| `VRy` | `A1` | Y-axis analog input |
| `SW` | `D2` | Joystick push button |

Some joystick modules label their axes differently. That is normal—use the matrix display to see which physical direction changes each value.

## Quick start

### 1. Wire the joystick

Connect the joystick module following the table above. Double-check `VCC` and `GND` before connecting USB power.

### 2. Upload the Arduino sketch

1. Open [hehe.ino](./hehe.ino) in the Arduino IDE.
2. Select the correct **Board** and **Port** under the Arduino IDE's **Tools** menu.
3. Click **Upload**.
4. Close the Arduino IDE Serial Monitor if it is open. Only one application can use the serial port at a time.

The sketch sends this data every 20 milliseconds at `9600` baud:

```text
X,Y,Button
512,508,1
```

`X` and `Y` are values from `0` to `1023`. The switch uses `INPUT_PULLUP`, so `1` means released and `0` means pressed.

### 3. Open the dashboard through a local web server

Web Serial requires a secure context. `localhost` works, but opening `index.html` directly from the file explorer may not.

Open a terminal in the `ThewebHEHE` folder and run one of these options:

**Python (if installed):**

```bash
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in Chrome or Edge.

**VS Code:**

Install the **Live Server** extension, then right-click `ThewebHEHE/index.html` and select **Open with Live Server**.

### 4. Connect your Arduino

1. In the browser dashboard, click **Connect Arduino**.
2. Select your Arduino's serial/COM port in the browser prompt.
3. Click **Connect**.
4. The status indicator turns green and the matrix begins updating.

## How to read the Motion Matrix

The ball represents the joystick position:

| Ball position | Typical meaning |
|---|---|
| Center | Joystick is at rest |
| Left / right | X-axis movement |
| Top / bottom | Y-axis movement |
| Corners | Both axes are moving |
| Ball jitters while untouched | Normal analog noise, loose wiring, or a worn joystick |

The first direction you move may appear reversed depending on your module's physical orientation. This does not mean the joystick is broken; it simply reveals how that module is mounted and wired.

## Using it as a joystick debugger

Use the dashboard to test these common cases:

1. **Center value:** Leave the stick untouched. Both values should normally be near `512`; small differences are expected.
2. **Full range:** Move the stick fully in every direction. Values should approach `0` and `1023`.
3. **Axis check:** Move only left/right and confirm mainly the X value changes. Move only up/down and confirm mainly the Y value changes.
4. **Orientation check:** Watch which way the ball moves. This tells you whether an axis is inverted for your intended project.
5. **Button check:** Press the joystick cap. The Switch card should change to **Pressed**.
6. **Noise check:** Keep the joystick still. Large or constant jumps can indicate a wiring, power, or hardware problem.

## Troubleshooting

### The Connect button says Web Serial is unsupported

Open the dashboard in current Google Chrome or Microsoft Edge on a computer. Firefox and Safari do not currently provide this API.

### No port appears in the browser picker

- Reconnect the Arduino USB cable.
- Make sure the cable supports data, not only charging.
- Install the USB driver required by your board, especially for some Arduino Nano-compatible boards.
- Check that your board appears in the Arduino IDE's **Tools → Port** menu.

### Connection fails or values do not update

- Close Arduino Serial Monitor, Serial Plotter, and any other program using the port.
- Confirm the uploaded sketch is [hehe.ino](./hehe.ino).
- Confirm the dashboard is opened at `http://localhost`, not as a direct `file:///` page.
- Check the baud rate: the sketch and dashboard both use `9600`.

### The ball moves in the wrong direction

That is an orientation result, not necessarily an error. Rotate the joystick module, swap the axis interpretation in your future project, or invert the relevant value there. The included Arduino/C++ sketch is intentionally left unchanged.

### Values stay at 0 or 1023

Check the `VRx`/`VRy` wiring, shared ground connection, and joystick power pin. A disconnected analog pin can produce unreliable values.

## Privacy and safety

The browser asks you to choose the serial port manually. The dashboard only reads the serial data provided by the selected Arduino while the page is connected.

## License

Use, modify, and learn from this project freely. Keep the RDbit UI credit when sharing the dashboard.
