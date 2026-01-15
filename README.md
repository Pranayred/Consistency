# 🔥 Consistency Tracker App

A simple but powerful web application to track your daily learning consistency and maintain accountability.

## 🎯 Purpose

**One job only: Make sure you show up every single day and prove it.**

This app tracks **presence + proof of work**, not hours or comparisons with others. It's designed to use loss aversion psychology to keep you consistent when motivation drops.

## ✨ Features

### 📅 Daily Check-in
- **Date tracking** (automatic)
- **Hours studied** (number input)
- **What I learned** (short text)
- **Proof of work** (GitHub link, screenshot, etc.)
- **Low Energy Day mode** (1-2 hours minimum)

### 🔥 Streak Counter
- **Current streak** display
- **Longest streak** tracking
- No leaderboards or comparisons
- You vs Yesterday You

### 📊 History & Statistics
- Total days tracked
- Total hours accumulated  
- Average hours per day
- Detailed history with proof links

### 📝 Weekly Review
- Unlocks after 7 days of consistency
- Reflect on improvements
- Identify challenges
- Plan next week's focus

## 🚀 Quick Start

1. **Open `index.html`** in your web browser
2. **Complete your first daily check-in**
3. **Upload proof of work** (GitHub repo, screenshot, etc.)
4. **Build your streak** day by day

## 📱 Usage Rules (Non-Negotiable)

Before sleep every day:
1. Open the app
2. Log today's learning
3. Upload proof of work  
4. Close the app

If this happens → **you are consistent**

## 🛠️ Technology Stack

### Phase 1 (Current)
- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript
- **Storage**: LocalStorage (browser-based)
- **Design**: Responsive, mobile-friendly

### Phase 2 (Future - After Python Basics)
- **Backend**: Python (Flask)
- **Database**: SQLite/PostgreSQL
- **Authentication**: Simple login system

### Phase 3 (Advanced - Portfolio Ready)
- **Frontend**: React.js
- **Dashboard**: Charts and analytics
- **AI Features**: Weekly summary generator
- **Power BI**: Advanced analytics integration

## 🧠 Data Model

```javascript
{
  dailyLogs: [
    {
      date: "2024-01-15",
      hours: 2.5,
      topic: "Python functions and decorators",
      proof: "https://github.com/username/repo",
      isLowEnergy: false,
      timestamp: "2024-01-15T22:30:00.000Z"
    }
  ],
  weeklyReviews: [
    {
      date: "2024-01-15T22:30:00.000Z",
      weekEnding: "2024-01-21",
      improved: "Better understanding of OOP concepts",
      challenges: "Recursion was difficult",
      nextWeek: "Master data structures"
    }
  ],
  currentStreak: 5,
  longestStreak: 12,
  startDate: "2024-01-01T00:00:00.000Z"
}
```

## ⌨️ Keyboard Shortcuts

- **Ctrl/Cmd + S**: Save daily check-in (when on Daily tab)
- **Ctrl/Cmd + E**: Export data backup

## 🔔 Automatic Reminders

The app includes an automatic reminder system:
- **8 PM daily reminder** if check-in not completed
- **Visual notifications** for achievements
- **Weekly review prompts** after 7 days

## 💾 Data Backup & Export

Your data is stored locally in your browser. To backup:
1. Press **Ctrl/Cmd + E** or use the export function
2. Save the JSON file to your computer
3. Import data when needed using the import function

## 📱 Mobile Compatibility

- Fully responsive design
- Works on all modern browsers
- Touch-friendly interface
- Optimized for mobile screens

## 🎨 Design Features

- **Clean, modern UI** with gradient backgrounds
- **Smooth animations** and transitions
- **Color-coded status** indicators
- **Accessibility** focused design
- **Dark mode ready** structure

## 🔧 Customization

### Low Energy Mode
- Minimum 1-2 hours requirement
- Smaller proof accepted
- Streak protection on tough days
- Prevents quitting completely

### Proof Requirements
- GitHub repository links
- Code snippets
- Notes screenshots
- Problem solutions
- Any verifiable work evidence

## 📈 Psychology Hacks

This app uses proven psychological principles:

1. **Loss Aversion**: Breaking streaks feels bad
2. **Commitment Consistency**: Daily check-ins build habits
3. **Social Proof**: Your progress becomes visible
4. **Immediate Feedback**: Instant streak updates
5. **Gamification**: Progress tracking and achievements

## 🚀 Future Development Roadmap

### Version 2.0 (Python Backend)
- User authentication
- Cloud data sync
- Export to calendar
- Mobile app version

### Version 3.0 (AI Integration)
- AI-powered weekly summaries
- Personalized learning suggestions
- Progress predictions
- Habit formation insights

## 🤝 Contributing

This is a personal productivity tool designed for simplicity. Focus remains on:
- **Reliability**: Works every time
- **Simplicity**: Easy to use daily
- **Effectiveness**: Actually builds habits

## 📄 License

Personal use only. Modify and adapt for your own consistency journey.

---

## 🎯 Your Mission

**Start Date**: January 19th (Python Journey)
**Daily Goal**: Show up + Prove it
**Success Metric**: Unbroken streak

> "The secret of getting ahead is getting started." - Mark Twain

**Remember**: Motivation fades. **Systems last.**

This app is your system. **Use it every day.** 🔥
