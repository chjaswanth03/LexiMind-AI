# 🌐 LexiMind AI – Smart Reading Companion Browser Extension

LexiMind AI is an intelligent browser extension that enhances your online reading experience using the power of Artificial Intelligence. Designed for students, researchers, professionals, and lifelong learners, it helps users **summarize**, **highlight**, and **generate flashcards** from any webpage content—instantly and effortlessly.

---

## 📌 Features

✅ **AI Summarization**  
Summarize long-form articles, blogs, essays, or custom input with a single click.

✅ **Key Point Highlighting**  
Automatically detects and highlights the most important lines in the content.

✅ **Flashcard Generator**  
Turns complex paragraphs into smart Q&A flashcards for learning and revision.

✅ **Focus Mode**  
Cleans up distractions on the page for focused reading (coming soon).

✅ **Copy / Export Tools**  
Easily copy the output or export it as a `.txt` file for offline reference.

✅ **Settings Panel**  
Paste your own API key, select summary tone, and enable/disable smart features.

✅ **Floating Sidebar Mode** *(Planned)*  
Lets you highlight and summarize content on-the-fly without leaving the page.

---

## 🚀 Getting Started

Follow these steps to install and run LexiMind AI locally in your browser (Chrome/Edge):

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/leximind-ai-extension.git
cd leximind-ai-extension
2. Install Dependencies (Optional for build tools)
If you're using a build setup with Tailwind or bundlers like Webpack:

npm install
npm run build
3. Load into Chrome
Open Chrome and go to: chrome://extensions

Enable Developer mode (top right)

Click Load unpacked and select the project folder

Pin the extension icon from the toolbar for easy access

🧠 Usage Guide
Click the LexiMind AI icon in your browser.

Paste or type the text you want to summarize.

Select the mode: Summarize, Highlight, or Flashcards.

Click the Generate button.

Use the output tools to Copy, Export, or save the content.

📁 Folder Structure
leximind-ai/
│
├── manifest.json           # Chrome extension metadata
├── popup.html              # Main UI HTML
├── popup.js                # Extension logic
├── styles.css              # Tailwind CSS or inline styles
├── utils/
│   └── ai.js               # API call logic to OpenAI or other models
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md               # Project documentation
🔧 Technologies Used
JavaScript / TypeScript

HTML / Tailwind CSS

Chrome Extension APIs (Manifest V3)

OpenAI GPT / Claude AI (via API calls)

Web Speech API (optional) for text-to-speech

Notion API (future integration)

🛣️ Future Roadmap
 Summarization feature

 Highlight & Flashcards

 Sidebar Reader Mode

 Voice Summary Playback

 Export to Notion / Google Docs

 Auto Reading Style Detection (news, academic, blogs)

🤝 Contributing
Feel free to fork this repository, submit issues, or contribute enhancements via pull requests. Let’s build the future of reading together.

