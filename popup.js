document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const inputText = document.getElementById('input-text');
    const btnSummarize = document.getElementById('btn-summarize');
    const btnHighlight = document.getElementById('btn-highlight');
    const btnFlashcards = document.getElementById('btn-flashcards');
    const results = document.getElementById('results');
    const loading = document.getElementById('loading');
    const output = document.getElementById('output');
    const btnCopy = document.getElementById('btn-copy');
    const btnExport = document.getElementById('btn-export');
    
    // Load saved settings
    loadSettings();
    
    // Button click handlers
    btnSummarize.addEventListener('click', async () => {
        if (!inputText.value.trim()) {
            alert('Please enter some text to summarize');
            return;
        }
        
        showLoading();
        try {
            const summary = await processWithAI(inputText.value, 'summarize');
            displayResult(summary);
        } catch (error) {
            handleError(error);
        }
    });

    btnHighlight.addEventListener('click', async () => {
        if (!inputText.value.trim()) {
            alert('Please enter some text to highlight');
            return;
        }
        
        showLoading();
        try {
            const highlights = await processWithAI(inputText.value, 'highlight');
            displayHighlights(highlights);
        } catch (error) {
            handleError(error);
        }
    });

    btnFlashcards.addEventListener('click', async () => {
        if (!inputText.value.trim()) {
            alert('Please enter some text to generate flashcards');
            return;
        }
        
        showLoading();
        try {
            const flashcards = await processWithAI(inputText.value, 'flashcards');
            displayFlashcards(flashcards);
        } catch (error) {
            handleError(error);
        }
    });

    // Copy and Export functionality
    btnCopy.addEventListener('click', () => {
        navigator.clipboard.writeText(output.textContent)
            .then(() => alert('Copied to clipboard!'))
            .catch(err => console.error('Failed to copy:', err));
    });

    btnExport.addEventListener('click', () => {
        const blob = new Blob([output.textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'lexamind-export.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Settings handlers
    document.getElementById('api-key').addEventListener('change', saveSettings);
    document.getElementById('summary-tone').addEventListener('change', saveSettings);
    document.getElementById('auto-highlight').addEventListener('change', saveSettings);
    document.getElementById('enable-flashcards').addEventListener('change', saveSettings);
    document.getElementById('enable-voice').addEventListener('change', saveSettings);
    document.getElementById('enable-sidebar').addEventListener('change', toggleSidebar);
});

async function processWithAI(text, action) {
    const apiKey = document.getElementById('api-key').value;
    if (!apiKey) {
        throw new Error('Please enter your API key in settings');
    }

    const tone = document.getElementById('summary-tone').value;
    
    // This would be replaced with actual API call
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: getPromptForAction(action, tone)
                },
                {
                    role: 'user',
                    content: text
                }
            ]
        })
    });

    if (!response.ok) {
        throw new Error('API request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

function getPromptForAction(action, tone) {
    const prompts = {
        summarize: `Please provide a ${tone} summary of the following text.`,
        highlight: 'Extract and highlight the key points and important phrases from the following text.',
        flashcards: 'Generate 3-5 question-answer pairs as flashcards from the following text.'
    };
    return prompts[action] || prompts.summarize;
}

function showLoading() {
    results.classList.remove('hidden');
    loading.classList.remove('hidden');
    output.innerHTML = '';
}

function displayResult(content) {
    loading.classList.add('hidden');
    output.innerHTML = content;
}

function displayHighlights(highlights) {
    loading.classList.add('hidden');
    output.innerHTML = highlights.split('\n').map(point => 
        `<div class="mb-2 p-2 bg-yellow-100 rounded">${point}</div>`
    ).join('');
}

function displayFlashcards(flashcards) {
    loading.classList.add('hidden');
    const cards = flashcards.split('\n\n');
    output.innerHTML = cards.map(card => {
        const [question, answer] = card.split('\nA: ');
        return `
            <div class="mb-4 p-4 bg-white shadow rounded-lg">
                <div class="font-medium">Q: ${question.replace('Q: ', '')}</div>
                <div class="mt-2 text-gray-600">${answer}</div>
            </div>
        `;
    }).join('');
}

function handleError(error) {
    loading.classList.add('hidden');
    output.innerHTML = `<div class="text-red-600">${error.message}</div>`;
}

function saveSettings() {
    const settings = {
        apiKey: document.getElementById('api-key').value,
        tone: document.getElementById('summary-tone').value,
        autoHighlight: document.getElementById('auto-highlight').checked,
        enableFlashcards: document.getElementById('enable-flashcards').checked,
        enableVoice: document.getElementById('enable-voice').checked,
        enableSidebar: document.getElementById('enable-sidebar').checked
    };
    chrome.storage.sync.set({ settings });
}

function loadSettings() {
    chrome.storage.sync.get(['settings'], function(result) {
        if (result.settings) {
            document.getElementById('api-key').value = result.settings.apiKey || '';
            document.getElementById('summary-tone').value = result.settings.tone || 'simple';
            document.getElementById('auto-highlight').checked = result.settings.autoHighlight || false;
            document.getElementById('enable-flashcards').checked = result.settings.enableFlashcards || false;
            document.getElementById('enable-voice').checked = result.settings.enableVoice || false;
            document.getElementById('enable-sidebar').checked = result.settings.enableSidebar || false;
        }
    });
}

function toggleSidebar(event) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: 'toggleSidebar',
            show: event.target.checked
        });
    });
}
