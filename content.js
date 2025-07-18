// Create and inject the sidebar
function createSidebar() {
    const sidebar = document.createElement('div');
    sidebar.id = 'lexamind-sidebar';
    sidebar.innerHTML = `
        <div class="lexamind-sidebar-content">
            <div class="lexamind-header">
                <h2>LexiMind AI</h2>
                <button id="lexamind-close">×</button>
            </div>
            <div class="lexamind-tools">
                <button id="lexamind-summarize">Summarize Selection</button>
                <button id="lexamind-highlight">Highlight</button>
                <button id="lexamind-flashcards">Generate Flashcards</button>
            </div>
            <div id="lexamind-output" class="lexamind-output"></div>
            <div class="lexamind-actions">
                <button id="lexamind-copy">Copy to Clipboard</button>
                <button id="lexamind-export">Export as .txt</button>
            </div>
        </div>
    `;
    document.body.appendChild(sidebar);
    
    // Add event listeners
    document.getElementById('lexamind-close').addEventListener('click', hideSidebar);
    document.getElementById('lexamind-summarize').addEventListener('click', () => processSelection('summarize'));
    document.getElementById('lexamind-highlight').addEventListener('click', () => processSelection('highlight'));
    document.getElementById('lexamind-flashcards').addEventListener('click', () => processSelection('flashcards'));
    document.getElementById('lexamind-copy').addEventListener('click', copyOutput);
    document.getElementById('lexamind-export').addEventListener('click', exportOutput);
}

function showSidebar() {
    const sidebar = document.getElementById('lexamind-sidebar');
    if (sidebar) {
        sidebar.classList.add('visible');
    } else {
        createSidebar();
    }
}

function hideSidebar() {
    const sidebar = document.getElementById('lexamind-sidebar');
    if (sidebar) {
        sidebar.classList.remove('visible');
    }
}

function getSelectedText() {
    return window.getSelection().toString().trim();
}

async function processSelection(action) {
    const selectedText = getSelectedText();
    if (!selectedText) {
        alert('Please select some text first');
        return;
    }

    const output = document.getElementById('lexamind-output');
    output.innerHTML = '<div class="lexamind-loading"></div>';

    try {
        // This would be replaced with actual API processing
        const result = await chrome.runtime.sendMessage({
            action: action,
            text: selectedText
        });
        
        displayResult(result, action);
    } catch (error) {
        output.innerHTML = `<div class="lexamind-error">${error.message}</div>`;
    }
}

function displayResult(content, action) {
    const output = document.getElementById('lexamind-output');
    
    if (action === 'highlight') {
        output.innerHTML = content.split('\n').map(point => 
            `<div class="lexamind-highlight">${point}</div>`
        ).join('');
    } else if (action === 'flashcards') {
        const cards = content.split('\n\n');
        output.innerHTML = cards.map(card => {
            const [question, answer] = card.split('\nA: ');
            return `
                <div class="lexamind-flashcard">
                    <div class="question">Q: ${question.replace('Q: ', '')}</div>
                    <div class="answer">${answer}</div>
                </div>
            `;
        }).join('');
    } else {
        output.innerHTML = content;
    }
}

function copyOutput() {
    const output = document.getElementById('lexamind-output');
    navigator.clipboard.writeText(output.textContent)
        .then(() => alert('Copied to clipboard!'))
        .catch(err => console.error('Failed to copy:', err));
}

function exportOutput() {
    const output = document.getElementById('lexamind-output');
    const blob = new Blob([output.textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lexamind-export.txt';
    a.click();
    URL.revokeObjectURL(url);
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggleSidebar') {
        if (request.show) {
            showSidebar();
        } else {
            hideSidebar();
        }
    }
});

// Initialize if needed
chrome.storage.sync.get(['settings'], function(result) {
    if (result.settings && result.settings.enableSidebar) {
        showSidebar();
    }
});
