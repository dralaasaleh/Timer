let workTime = document.getElementById("work-time").value * 60;
let breakTime = document.getElementById("break-time").value * 60;
let loops = document.getElementById("loops").value;
let timeLeft = workTime;
let progressBar = document.getElementById("progress-bar");
let timerDisplay = document.getElementById("timer-display");
let currentLoop = 0;
let isWorkSession = true;
let interval;

document.getElementById("start-btn").addEventListener("click", startTimer);
document.getElementById("pause-btn").addEventListener("click", pauseTimer);
document.getElementById("reset-btn").addEventListener("click", resetTimer);
document.getElementById("theme").addEventListener("change", changeTheme);

function startTimer() {
    if (!interval) {
        interval = setInterval(updateTimer, 1000);
    }
}

function pauseTimer() {
    clearInterval(interval);
    interval = null;
}

function resetTimer() {
    clearInterval(interval);
    interval = null;
    timeLeft = workTime;
    currentLoop = 0;
    progressBar.style.width = "0%";
    timerDisplay.textContent = formatTime(timeLeft);
}

function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        updateProgress();
        timerDisplay.textContent = formatTime(timeLeft);
    } else {
        playSound();
        showNotification();
        switchSession();
    }
}

function switchSession() {
    if (isWorkSession) {
        timeLeft = breakTime;
        isWorkSession = false;
    } else {
        currentLoop++;
        if (currentLoop >= loops) {
            clearInterval(interval);
            alert("Pomodoro completed!");
        } else {
            timeLeft = workTime;
            isWorkSession = true;
        }
    }
}

function updateProgress() {
    let total = isWorkSession ? workTime : breakTime;
    let percentage = ((total - timeLeft) / total) * 100;
    progressBar.style.width = percentage + "%";
}

function formatTime(seconds) {
    let mins = Math.floor(seconds / 60);
    let secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

function playSound() {
    let audio = new Audio("s.mp3");
    audio.play();
}

function showNotification() {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Time's up!", { body: "Your Pomodoro session has ended." });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                showNotification();
            }
        });
    }
}

function changeTheme() {
    let selectedTheme = document.getElementById("theme").value;
    document.body.className = "theme-" + selectedTheme;
}