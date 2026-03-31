const FOCUS_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

const timeDisplay = document.getElementById("timeDisplay");
const modeLabel = document.getElementById("modeLabel");
const progressBar = document.getElementById("progressBar");
const sessionCountEl = document.getElementById("sessionCount");
const themeToggle = document.getElementById("themeToggle");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

let timerId = null;
let isFocus = true;
let remainingSeconds = FOCUS_SECONDS;

const todayKey = new Date().toISOString().split("T")[0];
const sessionsByDay = JSON.parse(localStorage.getItem("focusforgeSessions") || "{}");
const savedTheme = localStorage.getItem("focusforgeTheme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
}

if (!sessionsByDay[todayKey]) {
  sessionsByDay[todayKey] = 0;
}

sessionCountEl.textContent = String(sessionsByDay[todayKey]);
render();

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
themeToggle.addEventListener("click", toggleTheme);

function startTimer() {
  if (timerId !== null) {
    return;
  }

  timerId = setInterval(() => {
    remainingSeconds -= 1;
    render();

    if (remainingSeconds <= 0) {
      handleCycleEnd();
    }
  }, 1000);
}

function pauseTimer() {
  if (timerId === null) {
    return;
  }

  clearInterval(timerId);
  timerId = null;
}

function resetTimer() {
  pauseTimer();
  isFocus = true;
  remainingSeconds = FOCUS_SECONDS;
  render();
}

function handleCycleEnd() {
  pauseTimer();

  if (isFocus) {
    sessionsByDay[todayKey] += 1;
    sessionCountEl.textContent = String(sessionsByDay[todayKey]);
    localStorage.setItem("focusforgeSessions", JSON.stringify(sessionsByDay));
    window.alert("Focus session complete. Great work! Time for a short break.");
    isFocus = false;
    remainingSeconds = BREAK_SECONDS;
  } else {
    window.alert("Break complete. Ready for your next focus session?");
    isFocus = true;
    remainingSeconds = FOCUS_SECONDS;
  }

  render();
}

function render() {
  modeLabel.textContent = isFocus ? "Focus Session" : "Break Session";
  timeDisplay.textContent = toClock(remainingSeconds);
  const maxSeconds = isFocus ? FOCUS_SECONDS : BREAK_SECONDS;
  const elapsed = maxSeconds - remainingSeconds;
  const percent = Math.max(0, Math.min(100, (elapsed / maxSeconds) * 100));
  progressBar.style.width = `${percent}%`;
}

function toClock(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  const nextTheme = document.body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("focusforgeTheme", nextTheme);
}
