// Consistency Tracker App - Main JavaScript
class ConsistencyTracker {
    constructor() {
        this.initializeApp();
        this.bindEvents();
        this.updateUI();
    }

    initializeApp() {
        // Initialize localStorage structure if not exists
        if (!localStorage.getItem('consistencyData')) {
            const initialData = {
                dailyLogs: [],
                weeklyReviews: [],
                currentStreak: 0,
                longestStreak: 0,
                startDate: new Date().toISOString()
            };
            localStorage.setItem('consistencyData', JSON.stringify(initialData));
        }
        
        this.data = JSON.parse(localStorage.getItem('consistencyData'));
        this.today = this.getTodayString();
    }

    getTodayString() {
        return new Date().toISOString().split('T')[0];
    }

    bindEvents() {
        // Tab navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Daily check-in form
        const checkInForm = document.getElementById('checkInForm');
        if (checkInForm) {
            checkInForm.addEventListener('submit', (e) => this.handleCheckIn(e));
        }

        // Weekly review form
        const reviewForm = document.getElementById('reviewForm');
        if (reviewForm) {
            reviewForm.addEventListener('submit', (e) => this.handleWeeklyReview(e));
        }

        // Low energy mode checkbox
        const lowEnergyCheckbox = document.getElementById('lowEnergyMode');
        if (lowEnergyCheckbox) {
            lowEnergyCheckbox.addEventListener('change', (e) => this.toggleLowEnergyMode(e));
        }
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        // Update content based on tab
        if (tabName === 'history') {
            this.updateHistory();
        } else if (tabName === 'review') {
            this.updateReview();
        }
    }

    handleCheckIn(e) {
        e.preventDefault();
        
        const hours = parseFloat(document.getElementById('hours').value);
        const topic = document.getElementById('topic').value.trim();
        const proof = document.getElementById('proof').value.trim();
        const isLowEnergy = document.getElementById('lowEnergyMode').checked;

        // Validation
        if (isLowEnergy && (hours < 1 || hours > 2)) {
            this.showNotification('Low Energy Day requires 1-2 hours of study', 'error');
            return;
        }

        if (!isLowEnergy && hours < 0.5) {
            this.showNotification('Minimum 0.5 hours required for normal days', 'error');
            return;
        }

        // Create daily log entry
        const logEntry = {
            date: this.today,
            hours: hours,
            topic: topic,
            proof: proof,
            isLowEnergy: isLowEnergy,
            timestamp: new Date().toISOString()
        };

        // Check if today already has an entry
        const existingIndex = this.data.dailyLogs.findIndex(log => log.date === this.today);
        if (existingIndex !== -1) {
            this.data.dailyLogs[existingIndex] = logEntry;
        } else {
            this.data.dailyLogs.push(logEntry);
        }

        // Sort logs by date
        this.data.dailyLogs.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Update streaks
        this.updateStreaks();
        
        // Save to localStorage
        this.saveData();
        
        // Update UI
        this.updateUI();
        
        // Show success message
        this.showNotification('Daily check-in completed successfully! 🔥', 'success');
        
        // Reset form
        document.getElementById('checkInForm').reset();
    }

    updateStreaks() {
        const sortedLogs = [...this.data.dailyLogs].sort((a, b) => new Date(a.date) - new Date(b.date));
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;

        // Calculate streaks
        for (let i = sortedLogs.length - 1; i >= 0; i--) {
            const logDate = new Date(sortedLogs[i].date);
            const today = new Date(this.today);
            const daysDiff = Math.floor((today - logDate) / (1000 * 60 * 60 * 24));

            if (daysDiff === 0) {
                // Today's entry
                currentStreak = tempStreak + 1;
                tempStreak++;
            } else if (daysDiff === tempStreak) {
                // Consecutive day
                tempStreak++;
            } else {
                // Break in streak
                break;
            }
        }

        // Calculate longest streak
        tempStreak = 0;
        for (let i = 0; i < sortedLogs.length; i++) {
            if (i === 0) {
                tempStreak = 1;
            } else {
                const prevDate = new Date(sortedLogs[i-1].date);
                const currDate = new Date(sortedLogs[i].date);
                const daysDiff = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));
                
                if (daysDiff === 1) {
                    tempStreak++;
                } else {
                    tempStreak = 1;
                }
            }
            longestStreak = Math.max(longestStreak, tempStreak);
        }

        this.data.currentStreak = currentStreak;
        this.data.longestStreak = Math.max(this.data.longestStreak, longestStreak);
    }

    toggleLowEnergyMode(e) {
        const hoursInput = document.getElementById('hours');
        const submitBtn = document.getElementById('submitBtn');
        
        if (e.target.checked) {
            hoursInput.min = '1';
            hoursInput.max = '2';
            hoursInput.placeholder = '1.5';
            submitBtn.textContent = 'Complete Low Energy Day';
        } else {
            hoursInput.min = '0.5';
            hoursInput.max = '24';
            hoursInput.placeholder = '2.5';
            submitBtn.textContent = "Complete Today's Check-in";
        }
    }

    handleWeeklyReview(e) {
        e.preventDefault();
        
        const improved = document.getElementById('improved').value.trim();
        const challenges = document.getElementById('challenges').value.trim();
        const nextWeek = document.getElementById('nextWeek').value.trim();

        const reviewEntry = {
            date: new Date().toISOString(),
            weekEnding: this.getWeekEnding(),
            improved: improved,
            challenges: challenges,
            nextWeek: nextWeek
        };

        this.data.weeklyReviews.push(reviewEntry);
        this.saveData();
        
        this.showNotification('Weekly review saved successfully!', 'success');
        document.getElementById('reviewForm').reset();
        this.updateReview();
    }

    getWeekEnding() {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const daysUntilSunday = (7 - dayOfWeek) % 7 || 7;
        const weekEnding = new Date(today.getTime() + daysUntilSunday * 24 * 60 * 60 * 1000);
        return weekEnding.toISOString().split('T')[0];
    }

    updateUI() {
        this.updateDateDisplay();
        this.updateStreakDisplay();
        this.updateDailyCheckIn();
        this.updateHistory();
        this.updateReview();
    }

    updateDateDisplay() {
        const currentDateElement = document.getElementById('currentDate');
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        currentDateElement.textContent = today.toLocaleDateString('en-US', options);
    }

    updateStreakDisplay() {
        document.getElementById('currentStreak').textContent = this.data.currentStreak;
        document.getElementById('longestStreak').textContent = this.data.longestStreak;
    }

    updateDailyCheckIn() {
        const todayLog = this.data.dailyLogs.find(log => log.date === this.today);
        const dayStatus = document.getElementById('dayStatus');
        const checkInForm = document.getElementById('checkInForm');
        
        if (todayLog) {
            dayStatus.textContent = 'Completed ✓';
            dayStatus.classList.add('completed');
            checkInForm.style.opacity = '0.7';
            checkInForm.querySelector('button[type="submit"]').disabled = true;
            checkInForm.querySelector('button[type="submit"]').textContent = 'Already completed today';
        } else {
            dayStatus.textContent = 'Not completed';
            dayStatus.classList.remove('completed');
            checkInForm.style.opacity = '1';
            checkInForm.querySelector('button[type="submit"]').disabled = false;
        }
    }

    updateHistory() {
        const historyList = document.getElementById('historyList');
        const totalDaysElement = document.getElementById('totalDays');
        const totalHoursElement = document.getElementById('totalHours');
        const avgHoursElement = document.getElementById('avgHours');

        // Calculate statistics
        const totalDays = this.data.dailyLogs.length;
        const totalHours = this.data.dailyLogs.reduce((sum, log) => sum + log.hours, 0);
        const avgHours = totalDays > 0 ? (totalHours / totalDays).toFixed(1) : 0;

        totalDaysElement.textContent = totalDays;
        totalHoursElement.textContent = totalHours.toFixed(1);
        avgHoursElement.textContent = avgHours;

        // Display history items
        historyList.innerHTML = '';
        
        if (this.data.dailyLogs.length === 0) {
            historyList.innerHTML = '<p style="text-align: center; color: #6c757d;">No check-ins yet. Start your journey today!</p>';
            return;
        }

        this.data.dailyLogs.slice(0, 30).forEach(log => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const date = new Date(log.date);
            const formattedDate = date.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
            });

            historyItem.innerHTML = `
                <div class="history-date">
                    ${formattedDate}
                    ${log.isLowEnergy ? '<span class="low-energy-badge">Low Energy</span>' : ''}
                </div>
                <div class="history-details">
                    <div class="history-detail">
                        <span class="history-detail-label">Hours:</span>
                        <span>${log.hours}h</span>
                    </div>
                    <div class="history-detail">
                        <span class="history-detail-label">Topic:</span>
                        <span>${log.topic}</span>
                    </div>
                    <div class="history-detail">
                        <span class="history-detail-label">Proof:</span>
                        <span><a href="${log.proof}" target="_blank" style="color: #667eea;">View Proof</a></span>
                    </div>
                </div>
            `;
            
            historyList.appendChild(historyItem);
        });
    }

    updateReview() {
        const reviewStatus = document.getElementById('reviewStatus');
        const reviewForm = document.getElementById('reviewForm');
        const pastReviews = document.getElementById('pastReviews');

        // Check if user has completed at least 7 days
        const recentDays = this.data.dailyLogs.filter(log => {
            const logDate = new Date(log.date);
            const daysDiff = Math.floor((new Date() - logDate) / (1000 * 60 * 60 * 24));
            return daysDiff <= 7;
        });

        if (recentDays.length >= 7) {
            reviewStatus.innerHTML = '<p style="color: #28a745;">✓ You can complete your weekly review!</p>';
            reviewForm.style.display = 'block';
        } else {
            reviewStatus.innerHTML = `<p>Complete ${7 - recentDays.length} more days to unlock your weekly review!</p>`;
            reviewForm.style.display = 'none';
        }

        // Display past reviews
        pastReviews.innerHTML = '';
        
        if (this.data.weeklyReviews.length === 0) {
            pastReviews.innerHTML = '<p style="text-align: center; color: #6c757d;">No reviews yet. Complete 7 days to write your first review!</p>';
            return;
        }

        this.data.weeklyReviews.slice().reverse().forEach(review => {
            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-item';
            
            const reviewDate = new Date(review.date);
            const formattedDate = reviewDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });

            reviewItem.innerHTML = `
                <div class="review-date">Week of ${formattedDate}</div>
                <div class="review-section">
                    <div class="review-section-title">What improved:</div>
                    <div class="review-section-content">${review.improved}</div>
                </div>
                <div class="review-section">
                    <div class="review-section-title">Challenges:</div>
                    <div class="review-section-content">${review.challenges}</div>
                </div>
                <div class="review-section">
                    <div class="review-section-title">Next week focus:</div>
                    <div class="review-section-content">${review.nextWeek}</div>
                </div>
            `;
            
            pastReviews.appendChild(reviewItem);
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            font-weight: 500;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;

        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    saveData() {
        localStorage.setItem('consistencyData', JSON.stringify(this.data));
    }

    // Export data for backup
    exportData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `consistency-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    // Import data from backup
    importData(jsonData) {
        try {
            const importedData = JSON.parse(jsonData);
            
            // Validate data structure
            if (!importedData.dailyLogs || !importedData.weeklyReviews) {
                throw new Error('Invalid data format');
            }
            
            this.data = importedData;
            this.saveData();
            this.updateUI();
            this.showNotification('Data imported successfully!', 'success');
        } catch (error) {
            this.showNotification('Error importing data: ' + error.message, 'error');
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.consistencyTracker = new ConsistencyTracker();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + S to save (prevent default browser save)
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            // Trigger form submission if on daily tab
            const activeTab = document.querySelector('.nav-tab.active').dataset.tab;
            if (activeTab === 'daily') {
                const form = document.getElementById('checkInForm');
                if (form && !form.querySelector('button[type="submit"]').disabled) {
                    form.dispatchEvent(new Event('submit'));
                }
            }
        }
        
        // Ctrl/Cmd + E to export data
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            window.consistencyTracker.exportData();
        }
    });
    
    // Add daily reminder check
    setInterval(() => {
        const hour = new Date().getHours();
        const todayLog = window.consistencyTracker.data.dailyLogs.find(log => log.date === window.consistencyTracker.today);
        
        // Remind at 8 PM if not completed
        if (hour === 20 && !todayLog) {
            window.consistencyTracker.showNotification('🔥 Don\'t forget to complete your daily check-in!', 'info');
        }
    }, 60000); // Check every minute
});
