import { saveToFirebase } from '@/utils/firebaseHelper';

export async function generateResponse(message, type = 'chat') {
    console.log(`Sending message to API (${type}):`, message);
    const startTime = Date.now();
    
    try {
        let messages;
        let assistantType = type;
        
        if (type === 'chat') {
            messages = [
                {
                    role: 'system',
                    content: "I'm your Ask Anything assistant. How can I help you today?"
                },
                {
                    role: 'user',
                    content: message
                }
            ];
        } else {
            // For assistants, expect an array of messages
            messages = Array.isArray(message) ? message : [
                {
                    role: 'user',
                    content: message
                }
            ];
        }

        // Save request to Firebase
        const requestRef = await saveToFirebase({
            type: 'request',
            assistantType,
            messages,
            status: 'pending',
            metadata: {
                featureType: type,
                messageCount: messages.length,
                hasSystemPrompt: messages.some(m => m.role === 'system')
            }
        });

        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('API Error:', errorData);
            
            // Save error to Firebase
            if (requestRef) {
                await saveToFirebase({
                    type: 'response',
                    assistantType,
                    status: 'error',
                    error: errorData.error || `HTTP error! status: ${response.status}`,
                    requestId: requestRef.id,
                    processingTime: Date.now() - startTime,
                    metadata: {
                        errorCode: response.status,
                        errorMessage: errorData.error
                    }
                });
            }
            
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);
        
        if (!data.content) {
            throw new Error('No content in response');
        }

        // Save successful response to Firebase
        if (requestRef) {
            await saveToFirebase({
                type: 'response',
                assistantType,
                status: 'completed',
                content: data.content,
                requestId: requestRef.id,
                processingTime: Date.now() - startTime,
                metadata: {
                    promptTokens: data.usage?.prompt_tokens,
                    completionTokens: data.usage?.completion_tokens,
                    totalTokens: data.usage?.total_tokens,
                    responseLength: data.content.length,
                    featureType: type
                }
            });
        }

        return data.content;
    } catch (error) {
        console.error('Error fetching from chat API:', error);
        throw new Error(error.message || 'Failed to get assistant response');
    }
}
