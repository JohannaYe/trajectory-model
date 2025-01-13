import OpenAI from 'openai';

const client = new OpenAI({
    apiKey: "sk-4d7e91ea6f834ac2bcd849311f9d30bf",
    baseURL: "https://api.deepseek.com",
    dangerouslyAllowBrowser: true // 注意：在生产环境中应该通过后端代理来调用API
});

export const getAIResponse = async (userMessage: string) => {
    try {
        const response = await client.chat.completions.create({
            model: "deepseek-chat",
            messages: [
                { role: "system", content: "You are a helpful assistant" },
                { role: "user", content: userMessage }
            ],
            stream: false
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('AI API Error:', error);
        throw error;
    }
}; 