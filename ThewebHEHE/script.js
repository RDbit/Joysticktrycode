const connectButton = document.getElementById("connect");
const xText = document.getElementById("x");
const yText = document.getElementById("y");
const buttonState = document.getElementById("buttonState");
const statusDot = document.getElementById("statusDot");
const coordinates = document.getElementById("coordinates");
const dot = document.getElementById("dot");

let serialBuffer = "";
let latestReading = { x: 512, y: 512, sw: 1 };
let framePending = false;

function renderReading() {
  framePending = false;
  const { x, y, sw } = latestReading;
  xText.textContent = String(x).padStart(4, "0");
  yText.textContent = String(y).padStart(4, "0");
  coordinates.textContent = `X ${x} · Y ${y}`;
  const pressed = sw === 0;
  buttonState.textContent = pressed ? "Pressed" : "Released";
  buttonState.classList.toggle("pressed", pressed);
  dot.style.left = `${(x / 1023) * 100}%`;
  dot.style.top = `${(y / 1023) * 100}%`;
}

function queueRender() {
  if (!framePending) {
    framePending = true;
    requestAnimationFrame(renderReading);
  }
}

function processLine(line) {
  const values = line.trim().split(",").map(Number);
  if (values.length !== 3 || values.some(Number.isNaN)) return;
  const [x, y, sw] = values;
  if (x < 0 || x > 1023 || y < 0 || y > 1023) return;
  latestReading = { x, y, sw };
  queueRender();
}

connectButton.addEventListener("click", async () => {
  if (!("serial" in navigator)) {
    alert("Web Serial is supported in Chrome and Edge on desktop.");
    return;
  }
  try {
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });
    connectButton.disabled = true;
    connectButton.textContent = "Arduino Connected";
    statusDot.classList.add("connected");

    const decoder = new TextDecoderStream();
    const pipePromise = port.readable.pipeTo(decoder.writable);
    const reader = decoder.readable.getReader();
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      serialBuffer += value;
      const lines = serialBuffer.split(/\r?\n/);
      serialBuffer = lines.pop();
      lines.forEach(processLine);
    }
    await pipePromise.catch(() => {});
  } catch (error) {
    console.error("Serial connection failed:", error);
    connectButton.disabled = false;
    connectButton.textContent = "Connect Arduino";
    statusDot.classList.remove("connected");
    alert("Connection failed. Check the cable, port, and that no other app is using it.");
  }
});
