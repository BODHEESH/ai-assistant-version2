// No imports needed for client-side service

export async function generateResponse(messages) {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.content;
    } catch (error) {
        console.error('Error fetching from chat API:', error);
        throw new Error('Failed to get assistant response');
    }
}
