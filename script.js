// QuizCraft AI - Modern SaaS Quiz Application
class QuizCraftApp {
    constructor() {
        this.currentUser = null;
        this.apiKey = localStorage.getItem('openai_api_key') || null;
        this.currentQuiz = null;
        this.currentQuestion = 0;
        this.score = 0;
        this.questions = [];
        this.userAnswers = [];
        this.quizHistory = JSON.parse(localStorage.getItem('quiz_history')) || [];
        this.userStats = JSON.parse(localStorage.getItem('user_stats')) || {
            totalQuizzes: 0,
            averageScore: 0,
            streakDays: 0,
            studyTime: 0
        };
        
        this.init();
    }

    init() {
        this.initTheme();
        this.bindEvents();
        this.checkAuthState();
        this.updateStats();
    }

    // Event Binding
    bindEvents() {
        // Theme toggle
        document.getElementById('theme-toggle')?.addEventListener('click', () => this.toggleTheme());
        
    }


    // Theme Management
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update toggle icon
        const toggleIcon = document.querySelector('#theme-toggle i');
        if (toggleIcon) {
            toggleIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        // Update toggle icon
        const toggleIcon = document.querySelector('#theme-toggle i');
        if (toggleIcon) {
            toggleIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    checkAuthState() {
        // Always show landing page since quiz app is external
        this.showLandingPage();
    }

    // Navigation Methods
    showLandingPage() {
        document.getElementById('landing-page').classList.add('active');
    }

}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.quizApp = new QuizCraftApp();
});

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);