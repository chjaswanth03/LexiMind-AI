// Background service worker for LexiMind AI
import { StorageManager } from './utils/storage.js';
import { Analytics } from './utils/analytics.js';

// Clean up expired cache entries periodically
chrome.alarms.create('cleanCache', { periodInMinutes: 60 });
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'cleanCache') {
        StorageManager.clearExpiredCache();
    }
});

// Listen for installation and update events
chrome.runtime.onInstalled.addListener(async (details) => {
    await Analytics.trackEvent('extension_installed', {
        reason: details.reason,
        previousVersion: details.previousVersion
    });

    // Initialize settings with defaults if not set
    const settings = await chrome.storage.sync.get('settings');
    if (!settings.settings) {
        await chrome.storage.sync.set({
            settings: {
                tone: 'simple',
                autoHighlight: false,
                enableFlashcards: true,
                enableVoice: false,
                enableSidebar: true
            }
        });
    }
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'getAnalytics') {
        Analytics.getStoredEvents()
            .then(events => sendResponse({ events }));
        return true; // Will respond asynchronously
    }
});
