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
        this.userStats = JSON.parse(localStorage.getItem('user_stats')) || {};
        this.usageStats = JSON.parse(localStorage.getItem('usage_stats')) || {
            totalTokens: 0,
            totalCost: 0,
            sessionTokens: 0,
            sessionCost: 0
        };
        
        this.init();
    }

    init() {
        this.initTheme();
        this.bindEvents();
        this.updateApiStatus();
        this.updateUsageMeter();
        this.navigateToPage('create-quiz'); // Start on create quiz page
        this.setDefaultModel(); // Ensure default model is set
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

        // Usage meter
        document.getElementById('reset-usage')?.addEventListener('click', () => this.resetUsageStats());

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
        document.getElementById('diagnose-api-btn')?.addEventListener('click', () => this.diagnoseApiIssues());
        
        // Save API key with validation
        document.getElementById('openai-api-key')?.addEventListener('input', (e) => {
            this.apiKey = e.target.value;
            localStorage.setItem('openai_api_key', this.apiKey);
            this.updateApiStatus();
            this.validateApiKeyFormat();
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
        // Stats removed - no longer needed
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

    validateApiKeyFormat() {
        const apiKeyInput = document.getElementById('openai-api-key');
        const testBtn = document.getElementById('test-api-btn');
        
        if (!this.apiKey) {
            this.showTestResult('', '');
            return;
        }

        // Basic format validation
        if (!this.apiKey.startsWith('sk-') || this.apiKey.length < 20) {
            this.showTestResult('warning', 'API key format appears invalid. OpenAI keys start with "sk-" and are longer.');
            if (testBtn) testBtn.disabled = true;
            return;
        }

        // If format looks good, enable test button
        if (testBtn) testBtn.disabled = false;
        this.showTestResult('info', 'API key format looks valid. Click "Test Connection" to verify.');
    }

    async testApiConnection() {
        const testBtn = document.getElementById('test-api-btn');
        
        if (!this.apiKey) {
            this.showTestResult('error', 'Please enter an API key first.');
            return;
        }

        if (!this.apiKey.startsWith('sk-')) {
            this.showTestResult('error', 'Invalid API key format. OpenAI keys start with "sk-".');
            return;
        }

        testBtn.classList.add('loading');
        testBtn.disabled = true;
        testBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';

        try {
            // Test with a simple models endpoint call
            const response = await fetch('https://api.openai.com/v1/models', {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                const selectedModel = document.getElementById('default-model').value;
                
                // Check if the selected model is available
                const modelExists = data.data.some(model => model.id === selectedModel);
                
                if (modelExists) {
                    this.showTestResult('success', `✅ API key valid! Model "${selectedModel}" is available and ready to use.`);
                } else {
                    this.showTestResult('warning', `⚠️ API key valid, but model "${selectedModel}" may not be available. Consider using a different model.`);
                }
            } else if (response.status === 401) {
                this.showTestResult('error', '❌ Invalid API key. Please check your credentials.');
            } else if (response.status === 429) {
                this.showTestResult('error', '❌ Rate limit exceeded. Please try again later.');
            } else if (response.status === 403) {
                this.showTestResult('error', '❌ Access forbidden. Check your API key permissions.');
            } else {
                this.showTestResult('error', `❌ API error: ${response.status}. Please try again.`);
            }
        } catch (error) {
            console.error('API test error:', error);
            this.showTestResult('error', '❌ Connection failed. Check your internet connection.');
        } finally {
            testBtn.classList.remove('loading');
            testBtn.disabled = false;
            testBtn.innerHTML = '<i class="fas fa-vial"></i> Test Connection';
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
        const userRequest = document.getElementById('content-text').value.trim();
        
        if (!userRequest) {
            this.showNotification('Please describe what kind of quiz you want to create.', 'error');
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
            const questionCount = document.getElementById('question-count').value;
            const difficulty = document.querySelector('.difficulty-btn.active')?.dataset.level || 'medium';
            const aiModel = document.getElementById('ai-model').value;
            const focusArea = document.getElementById('focus-area').value;
            
            // Get selected question types
            const questionTypes = [];
            document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
                questionTypes.push(checkbox.value);
            });
            
            const quiz = await this.callOpenAIAPI(userRequest, questionCount, difficulty, questionTypes, focusArea, aiModel);
            
            if (quiz && quiz.questions) {
                this.currentQuiz = quiz;
                this.questions = quiz.questions;
                this.showNotification(`Generated ${quiz.questions.length} questions successfully!`, 'success');
                this.startQuiz();
            } else {
                this.showNotification('Failed to generate quiz. Please try again.', 'error');
            }
            
        } catch (error) {
            console.error('Error generating quiz:', error);
            
            let errorMessage = 'Failed to generate quiz. ';
            
            if (error.message.includes('401')) {
                errorMessage += 'Invalid API key. Please check your credentials in Settings.';
            } else if (error.message.includes('429')) {
                errorMessage += 'Rate limit exceeded. Switching to GPT-4o Mini or wait a few minutes.';
                // Auto-switch to GPT-4o Mini when rate limited
                const aiModelSelect = document.getElementById('ai-model');
                if (aiModelSelect && aiModelSelect.value !== 'gpt-4o-mini') {
                    aiModelSelect.value = 'gpt-4o-mini';
                }
            } else if (error.message.includes('403')) {
                errorMessage += 'Access forbidden. Your API key may not have access to this model.';
            } else if (error.message.includes('400')) {
                errorMessage += 'Bad request. The model may not support the requested parameters.';
            } else if (error.message.includes('Invalid JSON')) {
                errorMessage += 'The AI response was not in the expected format. Try again or use a different model.';
            } else if (error.message.includes('network') || error.message.includes('fetch')) {
                errorMessage += 'Network error. Please check your internet connection.';
            } else {
                errorMessage += error.message;
            }
            
            this.showNotification(errorMessage, 'error');
        } finally {
            generateBtn.classList.remove('loading');
            generateBtn.disabled = false;
        }
    }

    async callOpenAIAPI(content, questionCount, difficulty, questionTypes, focusArea, model, retryCount = 0) {
        const prompt = this.buildPrompt(content, questionCount, difficulty, questionTypes, focusArea);
        
        console.log('Making API call with model:', model, 'attempt:', retryCount + 1);
        console.log('Prompt:', prompt);
        
        const requestBody = {
            model: model,
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert quiz generator. Generate educational quizzes in valid JSON format only. Do not include any text outside the JSON structure.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 2000
        };
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        console.log('API Response status:', response.status);

        if (!response.ok) {
            const errorData = await response.text();
            console.error('API Error Details:', {
                status: response.status,
                statusText: response.statusText,
                errorData: errorData,
                model: model,
                retryCount: retryCount
            });
            
            // Handle rate limiting with retry
            if (response.status === 429 && retryCount < 2) {
                const waitTime = Math.pow(2, retryCount) * 2000; // 2s, 4s exponential backoff
                console.log(`Rate limited. Retrying in ${waitTime}ms...`);
                this.showNotification(`Rate limited. Retrying in ${waitTime/1000} seconds...`, 'warning');
                
                await new Promise(resolve => setTimeout(resolve, waitTime));
                return this.callOpenAIAPI(content, questionCount, difficulty, questionTypes, focusArea, model, retryCount + 1);
            }
            
            throw new Error(`API request failed: ${response.status} - ${errorData}`);
        }

        const data = await response.json();
        console.log('API Response:', data);
        
        // Track token usage
        if (data.usage) {
            this.updateTokenUsage(data.usage.total_tokens, model);
        }
        
        const content_text = data.choices[0].message.content.trim();
        console.log('Response content:', content_text);
        
        try {
            // Clean up the response in case there's extra text
            let jsonText = content_text;
            
            // Extract JSON if it's wrapped in markdown code blocks
            const jsonMatch = content_text.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
            if (jsonMatch) {
                jsonText = jsonMatch[1];
            }
            
            // If no code blocks, try to find JSON object
            const startBrace = content_text.indexOf('{');
            const lastBrace = content_text.lastIndexOf('}');
            if (startBrace !== -1 && lastBrace !== -1 && lastBrace > startBrace) {
                jsonText = content_text.substring(startBrace, lastBrace + 1);
            }
            
            console.log('Parsing JSON:', jsonText);
            return JSON.parse(jsonText);
        } catch (parseError) {
            console.error('Failed to parse JSON:', content_text);
            console.error('Parse error:', parseError);
            throw new Error(`Invalid JSON response from API: ${parseError.message}`);
        }
    }

    buildPrompt(userRequest, questionCount, difficulty, questionTypes, focusArea) {
        const typeMap = {
            'multiple-choice': 'multiple choice',
            'true-false': 'true/false',
            'fill-blank': 'fill in the blank'
        };
        
        const types = questionTypes.map(type => typeMap[type] || type).join(', ');
        
        return `You are an expert quiz generator. Create ${questionCount} ${difficulty} level quiz questions based on the user's request.

User's Quiz Request: "${userRequest}"

Requirements:
- Question types: ${types}
- Difficulty: ${difficulty}
- Number of questions: ${questionCount}
- Focus area: ${focusArea}

Create educational questions that test understanding of the topic. Make questions clear, relevant, and at the specified difficulty level.

IMPORTANT: Respond with ONLY valid JSON in this exact format:

{
  "title": "Quiz Title",
  "questions": [
    {
      "id": 1,
      "type": "multiple-choice",
      "question": "What is the primary purpose of...?",
      "options": ["A) First option", "B) Second option", "C) Third option", "D) Fourth option"],
      "correct": 1,
      "explanation": "Brief explanation of why this answer is correct"
    }
  ]
}

Rules:
- For multiple-choice: use "multiple-choice" type, 4 options A-D, correct index 0-3
- For true/false: use "true-false" type, options ["True", "False"], correct index 0 or 1  
- For fill-in-blank: use "fill-blank" type, no options array, correct answer as string
- All questions must have explanations
- Respond with JSON only, no markdown, no extra text`;
    }

    startQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];
        this.showQuizInterface();
        this.displayQuestion();
    }

    showQuizInterface() {
        // Hide create quiz page and show quiz interface
        document.querySelectorAll('.page-content').forEach(page => page.classList.remove('active'));
        
        // Create quiz interface if it doesn't exist
        if (!document.getElementById('quiz-interface')) {
            this.createQuizInterface();
        }
        
        document.getElementById('quiz-interface').classList.add('active');
    }

    createQuizInterface() {
        const quizHTML = `
            <div id="quiz-interface" class="page-content">
                <div class="quiz-container">
                    <div class="quiz-header">
                        <h2 id="quiz-title">Quiz</h2>
                        <div class="quiz-progress">
                            <div class="progress-bar">
                                <div id="progress-fill" class="progress-fill"></div>
                            </div>
                            <span id="question-counter">1 of ${this.questions.length}</span>
                        </div>
                    </div>
                    
                    <div class="question-container">
                        <h3 id="current-question">Question will appear here</h3>
                        <div id="question-options" class="options-container"></div>
                        <div class="quiz-controls">
                            <button id="prev-btn" class="btn btn-outline" disabled>Previous</button>
                            <button id="next-btn" class="btn btn-primary">Next</button>
                            <button id="submit-quiz" class="btn btn-success" style="display: none;">Submit Quiz</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.querySelector('.main-content').insertAdjacentHTML('beforeend', quizHTML);
        
        // Bind quiz events
        document.getElementById('prev-btn').addEventListener('click', () => this.previousQuestion());
        document.getElementById('next-btn').addEventListener('click', () => this.nextQuestion());
        document.getElementById('submit-quiz').addEventListener('click', () => this.submitQuiz());
    }

    displayQuestion() {
        if (!this.questions || this.currentQuestion >= this.questions.length) return;
        
        const question = this.questions[this.currentQuestion];
        document.getElementById('current-question').textContent = question.question;
        document.getElementById('question-counter').textContent = `${this.currentQuestion + 1} of ${this.questions.length}`;
        
        // Update progress bar
        const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;
        
        // Display options
        const optionsContainer = document.getElementById('question-options');
        optionsContainer.innerHTML = '';
        
        if (question.type === 'fill-blank') {
            optionsContainer.innerHTML = `
                <input type="text" id="fill-answer" class="fill-input" placeholder="Enter your answer">
            `;
        } else {
            question.options.forEach((option, index) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'option';
                optionDiv.innerHTML = `
                    <input type="radio" name="answer" value="${index}" id="option-${index}">
                    <label for="option-${index}">${option}</label>
                `;
                optionsContainer.appendChild(optionDiv);
            });
        }
        
        // Update button states
        document.getElementById('prev-btn').disabled = this.currentQuestion === 0;
        document.getElementById('next-btn').style.display = this.currentQuestion === this.questions.length - 1 ? 'none' : 'block';
        document.getElementById('submit-quiz').style.display = this.currentQuestion === this.questions.length - 1 ? 'block' : 'none';
    }

    nextQuestion() {
        this.saveAnswer();
        if (this.currentQuestion < this.questions.length - 1) {
            this.currentQuestion++;
            this.displayQuestion();
        }
    }

    previousQuestion() {
        this.saveAnswer();
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.displayQuestion();
        }
    }

    saveAnswer() {
        const question = this.questions[this.currentQuestion];
        let answer = null;
        
        if (question.type === 'fill-blank') {
            answer = document.getElementById('fill-answer').value;
        } else {
            const selected = document.querySelector('input[name="answer"]:checked');
            answer = selected ? parseInt(selected.value) : null;
        }
        
        this.userAnswers[this.currentQuestion] = answer;
    }

    submitQuiz() {
        this.saveAnswer();
        this.calculateScore();
        this.showResults();
    }

    calculateScore() {
        this.score = 0;
        this.questions.forEach((question, index) => {
            const userAnswer = this.userAnswers[index];
            if (question.type === 'fill-blank') {
                if (userAnswer && userAnswer.toLowerCase().trim() === question.correct.toLowerCase().trim()) {
                    this.score++;
                }
            } else {
                if (userAnswer === question.correct) {
                    this.score++;
                }
            }
        });
    }

    showResults() {
        const percentage = Math.round((this.score / this.questions.length) * 100);
        const resultsHTML = `
            <div id="quiz-results" class="page-content active">
                <div class="results-container">
                    <h2>Quiz Complete!</h2>
                    <div class="score-display">
                        <div class="score-circle">
                            <span class="score-text">${percentage}%</span>
                        </div>
                        <p>You scored ${this.score} out of ${this.questions.length} questions correctly.</p>
                    </div>
                    <div class="results-actions">
                        <button class="btn btn-primary" onclick="location.reload()">Create New Quiz</button>
                        <button class="btn btn-outline" onclick="window.quizApp.navigateToPage('create-quiz')">Back to Dashboard</button>
                    </div>
                </div>
            </div>
        `;
        
        document.querySelector('.main-content').innerHTML += resultsHTML;
        document.getElementById('quiz-interface').classList.remove('active');
    }

    async diagnoseApiIssues() {
        const diagnoseBtn = document.getElementById('diagnose-api-btn');
        diagnoseBtn.classList.add('loading');
        diagnoseBtn.disabled = true;
        diagnoseBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Diagnosing...';

        let diagnostics = [];

        try {
            // Check 1: API Key Format
            if (!this.apiKey) {
                diagnostics.push('❌ No API key provided');
            } else if (!this.apiKey.startsWith('sk-')) {
                diagnostics.push('❌ API key format invalid (should start with "sk-")');
            } else if (this.apiKey.length < 20) {
                diagnostics.push('❌ API key appears too short');
            } else {
                diagnostics.push('✅ API key format looks valid');
            }

            // Check 2: Basic API Connectivity
            try {
                const response = await fetch('https://api.openai.com/v1/models', {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    diagnostics.push('✅ API connection successful');
                    
                    const data = await response.json();
                    const availableModels = data.data.map(m => m.id);
                    
                    // Check model availability
                    if (availableModels.includes('gpt-4o-mini')) {
                        diagnostics.push('✅ GPT-4o Mini model available');
                    } else {
                        diagnostics.push('❌ GPT-4o Mini model not available');
                    }
                    
                    if (availableModels.includes('gpt-4o')) {
                        diagnostics.push('✅ GPT-4o model available');
                    } else {
                        diagnostics.push('❌ GPT-4o model not available');
                    }

                } else if (response.status === 401) {
                    diagnostics.push('❌ Invalid API key (401 Unauthorized)');
                } else if (response.status === 429) {
                    diagnostics.push('❌ Rate limit exceeded (429 Too Many Requests)');
                } else {
                    diagnostics.push(`❌ API error: ${response.status} ${response.statusText}`);
                }
            } catch (error) {
                diagnostics.push(`❌ Network error: ${error.message}`);
            }

            // Check 3: Account Status
            try {
                const response = await fetch('https://api.openai.com/v1/usage', {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    diagnostics.push('✅ Account has usage access');
                } else if (response.status === 403) {
                    diagnostics.push('❌ Account may not have billing enabled');
                }
            } catch (error) {
                diagnostics.push('⚠️ Could not check account status');
            }

            // Display results
            const resultText = diagnostics.join('\n');
            this.showTestResult('info', resultText);

            // Provide recommendations
            const hasErrors = diagnostics.some(d => d.startsWith('❌'));
            if (hasErrors) {
                setTimeout(() => {
                    const recommendations = [
                        '🔧 Recommendations:',
                        '• Ensure your API key is valid and starts with "sk-"',
                        '• Check that billing is enabled in your OpenAI account',
                        '• Try waiting 5-10 minutes if rate limited',
                        '• Use GPT-4o Mini for lowest cost or GPT-4o for higher quality'
                    ];
                    this.showTestResult('warning', recommendations.join('\n'));
                }, 2000);
            }

        } catch (error) {
            this.showTestResult('error', `Diagnosis failed: ${error.message}`);
        } finally {
            diagnoseBtn.classList.remove('loading');
            diagnoseBtn.disabled = false;
            diagnoseBtn.innerHTML = '<i class="fas fa-stethoscope"></i> Diagnose Issues';
        }
    }

    setDefaultModel() {
        // Force set the default model to GPT-4o Mini for best cost-effectiveness
        const aiModelSelect = document.getElementById('ai-model');
        const defaultModelSelect = document.getElementById('default-model');
        
        if (aiModelSelect && !aiModelSelect.value) {
            aiModelSelect.value = 'gpt-4o-mini';
        }
        if (defaultModelSelect && !defaultModelSelect.value) {
            defaultModelSelect.value = 'gpt-4o-mini';
        }
    }

    // Token Usage Tracking
    updateTokenUsage(tokens, model) {
        const cost = this.calculateCost(tokens, model);
        
        this.usageStats.totalTokens += tokens;
        this.usageStats.totalCost += cost;
        this.usageStats.sessionTokens += tokens;
        this.usageStats.sessionCost += cost;
        
        localStorage.setItem('usage_stats', JSON.stringify(this.usageStats));
        this.updateUsageMeter();
        
        console.log(`Used ${tokens} tokens (~$${cost.toFixed(4)}) with ${model}`);
    }

    calculateCost(tokens, model) {
        // OpenAI pricing per 1000 tokens (as of 2024)
        const pricing = {
            'gpt-4o-mini': 0.000150, // $0.15 per 1M tokens
            'gpt-4o': 0.0025,        // $2.50 per 1M tokens
            'gpt-3.5-turbo': 0.0015  // $1.50 per 1M tokens (fallback)
        };
        
        const pricePerToken = (pricing[model] || pricing['gpt-3.5-turbo']) / 1000;
        return tokens * pricePerToken;
    }

    updateUsageMeter() {
        const tokensElement = document.getElementById('usage-tokens');
        const costElement = document.getElementById('usage-cost');
        const meterElement = document.getElementById('usage-meter');
        
        if (tokensElement && costElement) {
            const tokens = this.usageStats.sessionTokens;
            const cost = this.usageStats.sessionCost;
            
            tokensElement.textContent = `${tokens.toLocaleString()} tokens`;
            costElement.textContent = `~$${cost.toFixed(3)}`;
            
            // Update color based on cost
            meterElement.classList.remove('low-usage', 'medium-usage', 'high-usage');
            if (cost < 0.05) {
                meterElement.classList.add('low-usage');
            } else if (cost < 0.20) {
                meterElement.classList.add('medium-usage');
            } else {
                meterElement.classList.add('high-usage');
            }
        }
    }

    resetUsageStats() {
        this.usageStats.sessionTokens = 0;
        this.usageStats.sessionCost = 0;
        localStorage.setItem('usage_stats', JSON.stringify(this.usageStats));
        this.updateUsageMeter();
        this.showNotification('Usage counter reset for this session', 'success');
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