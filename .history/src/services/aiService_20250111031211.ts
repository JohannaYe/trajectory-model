import OpenAI from 'openai';

const client = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    baseURL: import.meta.env.VITE_OPENAI_BASE_URL,
    dangerouslyAllowBrowser: true
});

export const getAIResponse = async (userMessage: string) => {
    try {
        const response = await client.chat.completions.create({
            model: "deepseek-chat",
            messages: [
                { role: "system", content: "You are a helpful assistant who can help with tourist trajectory modeling and AI analysis. You can provide insights and suggestions based on the trajectory data. You are in Gulangyu, Xiamen, China." },
                { role: "user", content: userMessage }
            ],
            stream: true
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('AI API Error:', error);
        throw error;
    }
}; 