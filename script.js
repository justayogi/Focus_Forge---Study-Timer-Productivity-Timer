// script.js

class StudyTimer {
    constructor() {
        this.studyTime = 25 * 60; // default 25 minutes in seconds
        this.breakTime = 5 * 60; // default 5 minutes in seconds
        this.currentSession = 'Study';
        this.timerInterval = null;
        this.remainingTime = this.studyTime;
        this.sessionsCompleted = 0;

        // Load sessions from localStorage
        this.loadSessions();
    }

    startTimer() {
        if (this.timerInterval) return; // Prevent multiple intervals

        this.timerInterval = setInterval(() => {
            this.remainingTime--;
            this.updateDisplay();

            if (this.remainingTime <= 0) {
                this.completeSession();
            }
        }, 1000);
    }

    updateDisplay() {
        const minutes = Math.floor(this.remainingTime / 60);
        const seconds = this.remainingTime % 60;
        console.log(`${this.currentSession} Time Remaining: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
    }

    completeSession() {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.sessionsCompleted++; 

        // Toggle between study and break
        this.currentSession = this.currentSession === 'Study' ? 'Break' : 'Study';
        this.remainingTime = this.currentSession === 'Study' ? this.studyTime : this.breakTime;
        
        console.log(`${this.currentSession} session completed!`);
        this.saveSession();
        this.startTimer(); // Start next session
    }

    loadSessions() {
        const sessions = JSON.parse(localStorage.getItem('studySessions')) || [];
        this.sessionsCompleted = sessions.length;
    }

    saveSession() {
        const sessions = JSON.parse(localStorage.getItem('studySessions')) || [];
        sessions.push({ session: this.currentSession, completedAt: new Date() });
        localStorage.setItem('studySessions', JSON.stringify(sessions));
    }
}

// Initiate Study Timer
const studyTimer = new StudyTimer();
studyTimer.startTimer();