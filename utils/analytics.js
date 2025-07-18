// Analytics and error tracking
export const Analytics = {
    async trackEvent(eventName, data) {
        try {
            const event = {
                name: eventName,
                data,
                timestamp: new Date().toISOString(),
                sessionId: await this.getSessionId()
            };

            // Store event locally
            const events = await this.getStoredEvents();
            events.push(event);
            await chrome.storage.local.set({ 'analytics_events': events });

            // If there are too many events, remove old ones
            if (events.length > 1000) {
                events.splice(0, events.length - 1000);
                await chrome.storage.local.set({ 'analytics_events': events });
            }
        } catch (error) {
            console.error('Error tracking event:', error);
        }
    },

    async trackError(error, context) {
        await this.trackEvent('error', {
            message: error.message,
            stack: error.stack,
            context
        });
    },

    async getStoredEvents() {
        const result = await chrome.storage.local.get('analytics_events');
        return result.analytics_events || [];
    },

    async getSessionId() {
        const result = await chrome.storage.local.get('session_id');
        if (result.session_id) return result.session_id;

        const newSessionId = Math.random().toString(36).substring(2);
        await chrome.storage.local.set({ 'session_id': newSessionId });
        return newSessionId;
    }
};
