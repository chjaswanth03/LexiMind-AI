import { StorageManager } from './storage.js';
import { Analytics } from './analytics.js';

// Utility functions for AI processing
export async function processWithOpenAI(text, action, apiKey, tone = 'simple') {
    const prompts = {
        summarize: `Please provide a ${tone} summary of the following text.`,
        highlight: 'Extract and highlight the key points and important phrases from the following text.',
        flashcards: 'Generate 3-5 question-answer pairs as flashcards from the following text.'
    };

    // Try to get from cache first
    const cacheKey = StorageManager.generateCacheKey(text, action, tone);
    const cachedResult = await StorageManager.getFromCache(cacheKey);
    if (cachedResult) {
        await Analytics.trackEvent('cache_hit', { action, tone });
        return cachedResult;
    }

    try {
        await Analytics.trackEvent('api_request', { action, tone });
        
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
                        content: prompts[action] || prompts.summarize
                    },
                    {
                        role: 'user',
                        content: text
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        const result = data.choices[0].message.content;
        
        // Save to cache
        await StorageManager.saveToCache(cacheKey, result);
        await Analytics.trackEvent('api_success', { action, tone });
        
        return result;
    } catch (error) {
        await Analytics.trackError(error, { action, tone });
        console.error('AI processing error:', error);
        throw new Error('Failed to process text with AI. Please check your API key and try again.');
    }
}

// Sample test input
export const sampleText = `
The Industrial Revolution began in the 18th century and marked a major turning point in history. 
This period saw a shift from manual production methods to machine manufacturing, leading to increased productivity and urbanization. 
Key innovations included the steam engine, which revolutionized transportation and manufacturing processes. 
The revolution also brought significant social changes, including the rise of the middle class and new labor movements.
`;

// Test function to validate AI processing
export async function testAIProcessing(apiKey) {
    try {
        console.log('Testing summarization...');
        const summary = await processWithOpenAI(sampleText, 'summarize', apiKey);
        console.log('Summary:', summary);

        console.log('Testing highlight extraction...');
        const highlights = await processWithOpenAI(sampleText, 'highlight', apiKey);
        console.log('Highlights:', highlights);

        console.log('Testing flashcard generation...');
        const flashcards = await processWithOpenAI(sampleText, 'flashcards', apiKey);
        console.log('Flashcards:', flashcards);

        return true;
    } catch (error) {
        console.error('AI processing test failed:', error);
        return false;
    }
}
