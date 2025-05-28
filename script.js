// Morse code dictionary
const morseDictionary = {
  // Letters
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",

  // Numbers
  0: "-----",
  1: ".----",
  2: "..---",
  3: "...--",
  4: "....-",
  5: ".....",
  6: "-....",
  7: "--...",
  8: "---..",
  9: "----.",

  // Punctuation
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "'": ".----.",
  "!": "-.-.--",
  "/": "-..-.",
  "(": "-.--.",
  ")": "-.--.-",
  "&": ".-...",
  ":": "---...",
  ";": "-.-.-.",
  "=": "-...-",
  "+": ".-.-.",
  "-": "-....-",
  _: "..--.-",
  '"': ".-..-.",
  $: "...-..-",
  "@": ".--.-.",
  " ": "/",
};

// Reverse dictionary for Morse to text
const reverseMorseDictionary = {};
for (const key in morseDictionary) {
  reverseMorseDictionary[morseDictionary[key]] = key;
}

// App state
let soundEnabled = true;
let visualFeedback = true;
let speed = 20; // Words per minute

// DOM elements
const soundStatus = document.getElementById("sound-status");
const speedStatus = document.getElementById("speed-status");
const visualStatus = document.getElementById("visual-status");
const textToMorseBtn = document.getElementById("text-to-morse");
const morseToTextBtn = document.getElementById("morse-to-text");
const toggleSoundBtn = document.getElementById("toggle-sound");
const toggleVisualBtn = document.getElementById("toggle-visual");
const adjustSpeedBtn = document.getElementById("adjust-speed");
const converterSection = document.getElementById("converter-section");
const textToMorseSection = document.getElementById("text-to-morse-section");
const morseToTextSection = document.getElementById("morse-to-text-section");
const speedAdjustment = document.getElementById("speed-adjustment");
const textInput = document.getElementById("text-input");
const morseOutput = document.getElementById("morse-output");
const visualFeedbackElement = document.getElementById("visual-feedback");
const morseInput = document.getElementById("morse-input");
const textOutput = document.getElementById("text-output");
const convertTextBtn = document.getElementById("convert-text");
const convertMorseBtn = document.getElementById("convert-morse");
const speedInput = document.getElementById("speed-input");
const setSpeedBtn = document.getElementById("set-speed");
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Event listeners
textToMorseBtn.addEventListener("click", () => {
  converterSection.classList.remove("hidden");
  textToMorseSection.classList.remove("hidden");
  morseToTextSection.classList.add("hidden");
  speedAdjustment.classList.add("hidden");
});

morseToTextBtn.addEventListener("click", () => {
  converterSection.classList.remove("hidden");
  morseToTextSection.classList.remove("hidden");
  textToMorseSection.classList.add("hidden");
  speedAdjustment.classList.add("hidden");
});

toggleSoundBtn.addEventListener("click", toggleSound);
toggleVisualBtn.addEventListener("click", toggleVisual);

adjustSpeedBtn.addEventListener("click", () => {
  converterSection.classList.add("hidden");
  speedAdjustment.classList.remove("hidden");
});

convertTextBtn.addEventListener("click", convertTextToMorse);
convertMorseBtn.addEventListener("click", convertMorseToText);
setSpeedBtn.addEventListener("click", setSpeed);

// Functions
function toggleSound() {
  soundEnabled = !soundEnabled;
  soundStatus.textContent = `Sound: ${soundEnabled ? "ON" : "OFF"}`;
}

function toggleVisual() {
  visualFeedback = !visualFeedback;
  visualStatus.textContent = `Visual: ${visualFeedback ? "ON" : "OFF"}`;
}

function setSpeed() {
  const newSpeed = parseInt(speedInput.value);
  if (newSpeed >= 5 && newSpeed <= 30) {
    speed = newSpeed;
    speedStatus.textContent = `Speed: ${speed} WPM`;
  } else {
    alert("Please enter a value between 5 and 30");
  }
}

function convertTextToMorse() {
  const text = textInput.value.toUpperCase();
  let morse = "";
  let firstCharacter = true;

  for (const char of text) {
    const code = morseDictionary[char];

    if (!firstCharacter && code !== undefined) {
      morse += " "; // Space between characters
    }

    if (code !== undefined) {
      morse += code;
      firstCharacter = false;
    } else if (char !== " ") {
      morse += "? ";
      firstCharacter = true;
    }

    // Handle word spacing
    if (char === " ") {
      if (!firstCharacter) {
        morse += " / ";
        firstCharacter = true;
      }
    }
  }

  morseOutput.textContent = morse.trim();

  if (visualFeedback) {
    playVisualFeedback(morse.trim());
  }

  if (soundEnabled) {
    playMorseSound(morse.trim());
  }
}

function convertMorseToText() {
  const morseCode = morseInput.value.trim();
  let text = "";
  const words = morseCode.split(" / ");

  for (let i = 0; i < words.length; i++) {
    const letters = words[i].split(" ");
    for (const letter of letters) {
      if (letter) {
        const char = reverseMorseDictionary[letter];
        text += char !== undefined ? char : "?";
      }
    }
    if (i < words.length - 1) {
      text += " ";
    }
  }

  textOutput.textContent = text;
}

async function playVisualFeedback(morseCode) {
  visualFeedbackElement.textContent = "Playing: ";

  for (const char of morseCode) {
    visualFeedbackElement.textContent += char;

    switch (char) {
      case ".":
        await sleep(1200 / speed);
        break;
      case "-":
        await sleep(3600 / speed);
        break;
      case " ":
        await sleep(3600 / speed);
        break;
      case "/":
        await sleep(8400 / speed);
        break;
      default:
        await sleep(100);
    }
  }
}

async function playMorseSound(morseCode) {
  for (const char of morseCode) {
    switch (char) {
      case ".":
        await playBeep(700, 200, 0.8);
        await sleep(200); // inter-element gap
        break;
      case "-":
        await playBeep(700, 600, 0.8);
        await sleep(200); // inter-element gap
        break;
      case " ":
        await sleep(600); // inter-letter gap
        break;
      case "/":
        await sleep(1400); // inter-word gap
        break;
    }
  }
}

function playBeep(frequency, duration, volume) {
  return new Promise((resolve) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    oscillator.connect(gainNode);

    gainNode.connect(audioContext.destination);
    gainNode.gain.value = volume;

    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
      resolve();
    }, duration);
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Initialize UI
soundStatus.textContent = `Sound: ${soundEnabled ? "ON" : "OFF"}`;
speedStatus.textContent = `Speed: ${speed} WPM`;
visualStatus.textContent = `Visual: ${visualFeedback ? "ON" : "OFF"}`;
