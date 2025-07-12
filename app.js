// QuizCraft AI - App Functionality
class QuizCraftApp {
    constructor() {
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
        this.updateStats();
        this.updateApiStatus();
    }

    // Theme Management
    initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        // Update toggle icon
        const toggleIcon = document.querySelector('#theme-toggle i');
        if (toggleIcon) {
            toggleIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

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

    // Event Binding
    bindEvents() {
        // Theme toggle
        document.getElementById('theme-toggle')?.addEventListener('click', () => this.toggleTheme());
        
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToPage(e.currentTarget.dataset.page);
            });
        });

        // Quick actions
        document.getElementById('quick-create-btn')?.addEventListener('click', () => this.navigateToPage('create-quiz'));
        document.getElementById('configure-api-btn')?.addEventListener('click', () => this.navigateToPage('settings'));

        // Content input events
        document.getElementById('content-text')?.addEventListener('input', (e) => this.updateContentStats(e.target.value));
        
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchContentTab(e.target.dataset.tab));
        });

        // Settings events
        this.bindSettingsEvents();

        // Quiz generation
        document.getElementById('generate-quiz-btn')?.addEventListener('click', () => this.generateQuizWithAI());

        // File upload (simplified for demo)
        document.getElementById('upload-zone')?.addEventListener('click', () => {
            alert('File upload feature coming soon! For now, please paste your content in the text area.');
        });

        // Question count slider
        document.getElementById('question-count')?.addEventListener('input', (e) => {
            document.getElementById('question-count-display').textContent = e.target.value;
        });

        // Difficulty buttons
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }

    bindSettingsEvents() {
        // Settings tabs
        document.querySelectorAll('.settings-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchSettingsTab(e.target.dataset.tab));
        });

        // API key management
        document.getElementById('toggle-api-key')?.addEventListener('click', () => this.toggleApiKeyVisibility());
        document.getElementById('test-api-btn')?.addEventListener('click', () => this.testApiConnection());
        
        // Save API key
        document.getElementById('openai-api-key')?.addEventListener('input', (e) => {
            this.apiKey = e.target.value;
            localStorage.setItem('openai_api_key', this.apiKey);
            this.updateApiStatus();
        });

        // Load saved API key
        if (this.apiKey) {
            const apiKeyInput = document.getElementById('openai-api-key');
            if (apiKeyInput) {
                apiKeyInput.value = this.apiKey;
            }
        }
    }

    // Navigation
    navigateToPage(page) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // Update page content
        document.querySelectorAll('.page-content').forEach(content => content.classList.remove('active'));
        document.getElementById(`${page}-page`).classList.add('active');

        // Update header
        this.updatePageHeader(page);
    }

    updatePageHeader(page) {
        const headers = {
            'overview': {
                title: 'Dashboard Overview',
                description: 'Welcome back! Ready to learn something new?'
            },
            'create-quiz': {
                title: 'Create New Quiz',
                description: 'Upload your study material and let AI generate intelligent questions'
            },
            'quiz-history': {
                title: 'Quiz History',
                description: 'Review your past quizzes and track your progress'
            },
            'settings': {
                title: 'Settings',
                description: 'Configure your API keys and preferences'
            }
        };

        const header = headers[page];
        if (header) {
            document.getElementById('page-title').textContent = header.title;
            document.getElementById('page-description').textContent = header.description;
        }
    }

    updateStats() {
        document.getElementById('total-quizzes').textContent = this.userStats.totalQuizzes;
        document.getElementById('avg-score').textContent = `${this.userStats.averageScore}%`;
        document.getElementById('streak-days').textContent = this.userStats.streakDays;
        document.getElementById('study-time').textContent = `${this.userStats.studyTime}h`;
    }

    updateApiStatus() {
        const statusElement = document.getElementById('api-status');
        const configureBtn = document.getElementById('configure-api-btn');
        const generateBtn = document.getElementById('generate-quiz-btn');

        if (this.apiKey) {
            statusElement.innerHTML = '<i class="fas fa-check-circle"></i><span>API Connected</span>';
            statusElement.className = 'api-status connected';
            statusElement.parentElement.style.background = 'var(--success-500)';
            if (configureBtn) configureBtn.textContent = 'Update API';
            if (generateBtn) generateBtn.disabled = false;
        } else {
            statusElement.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>API Key Required</span>';
            statusElement.className = 'api-status';
            statusElement.parentElement.style.background = 'var(--warning-500)';
            if (configureBtn) configureBtn.textContent = 'Configure API';
            if (generateBtn) generateBtn.disabled = true;
        }
    }

    // Content Management
    switchContentTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));

        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        document.getElementById(`${tab}-tab-content`).classList.add('active');
    }

    updateContentStats(content) {
        const charCount = content.length;
        const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
        
        document.getElementById('char-count').textContent = `${charCount} characters`;
        document.getElementById('word-count').textContent = `${wordCount} words`;
    }

    // Settings Management
    switchSettingsTab(tab) {
        document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.settings-panel').forEach(p => p.classList.remove('active'));

        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        document.getElementById(`${tab}-tab`).classList.add('active');
    }

    toggleApiKeyVisibility() {
        const input = document.getElementById('openai-api-key');
        const btn = document.getElementById('toggle-api-key');
        
        if (input.type === 'password') {
            input.type = 'text';
            btn.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
            input.type = 'password';
            btn.innerHTML = '<i class="fas fa-eye"></i>';
        }
    }

    async testApiConnection() {
        const testBtn = document.getElementById('test-api-btn');
        
        if (!this.apiKey) {
            this.showTestResult('error', 'Please enter an API key first.');
            return;
        }

        testBtn.classList.add('loading');
        testBtn.disabled = true;

        try {
            const response = await fetch('https://api.openai.com/v1/models', {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                this.showTestResult('success', 'API connection successful!');
            } else {
                this.showTestResult('error', 'Invalid API key. Please check your credentials.');
            }
        } catch (error) {
            this.showTestResult('error', 'Connection failed. Please check your internet connection.');
        } finally {
            testBtn.classList.remove('loading');
            testBtn.disabled = false;
        }
    }

    showTestResult(type, message) {
        const resultDiv = document.getElementById('api-test-result');
        resultDiv.className = `test-result ${type}`;
        resultDiv.textContent = message;
        resultDiv.style.display = 'block';
    }

    // Quiz Generation (Demo version)
    async generateQuizWithAI() {
        const content = document.getElementById('content-text').value.trim();
        
        if (!content) {
            this.showNotification('Please enter some study material before generating a quiz.', 'error');
            return;
        }

        if (!this.apiKey) {
            this.showNotification('Please configure your OpenAI API key in settings first.', 'error');
            this.navigateToPage('settings');
            return;
        }

        const generateBtn = document.getElementById('generate-quiz-btn');
        generateBtn.classList.add('loading');
        generateBtn.disabled = true;

        try {
            // For demo purposes, we'll simulate quiz generation
            // In a real implementation, you would call the OpenAI API here
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
            
            this.showNotification('Quiz generation is a demo feature. In the full version, this would create a real quiz!', 'success');
            
            // Update stats for demo
            this.userStats.totalQuizzes++;
            this.userStats.averageScore = 85;
            this.userStats.streakDays = 3;
            this.userStats.studyTime = 5;
            localStorage.setItem('user_stats', JSON.stringify(this.userStats));
            this.updateStats();
            
        } catch (error) {
            console.error('Error generating quiz:', error);
            this.showNotification('Failed to generate quiz. Please check your API key and try again.', 'error');
        } finally {
            generateBtn.classList.remove('loading');
            generateBtn.disabled = false;
        }
    }

    // Utility Methods
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'error' ? 'var(--error-500)' : type === 'success' ? 'var(--success-500)' : 'var(--accent-color)'};
            color: white;
            border-radius: var(--border-radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 3000;
            animation: slideIn 0.3s ease;
            max-width: 400px;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
}

// Global navigation function for onclick handlers
window.navigateToPage = function(page) {
    if (window.quizApp) {
        window.quizApp.navigateToPage(page);
    }
};

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