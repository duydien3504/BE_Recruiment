const axios = require('axios');
require('dotenv').config();

class OpenRouterService {
    constructor() {
        this.apiKey = process.env.API_KEY;
        this.apiUrl = process.env.API_URL || 'https://openrouter.ai/api/v1/chat/completions';
        this.model = process.env.MODEL || 'openai/gpt-3.5-turbo';
    }

    /**
     * Call OpenRouter API with a prompt
     * @param {string} prompt
     * @param {number} timeoutMs
     * @returns {Promise<string>}
     */
    async generateText(prompt, timeoutMs = 15000, options = {}) {
        try {
            const payload = {
                model: this.model,
                messages: [
                    { role: 'user', content: prompt }
                ],
                ...options
            };

            const response = await axios.post(
                this.apiUrl,
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: timeoutMs
                }
            );

            if (response.data && response.data.choices && response.data.choices.length > 0) {
                return response.data.choices[0].message.content.trim();
            }

            throw new Error('Không có kết quả trả về từ mô hình AI.');
        } catch (error) {
            console.error('[OpenRouterService] Error:', error.message);
            if (error.code === 'ECONNABORTED') {
                throw new Error('Yêu cầu tới AI bị quá thời gian (Timeout). Hãy thử lại sau.');
            }
            throw new Error('Lỗi khi gọi OpenRouter API: ' + error.message);
        }
    }
}

module.exports = new OpenRouterService();
