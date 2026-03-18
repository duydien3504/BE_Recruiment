const https = require('https');
const { URL } = require('url');

class AIService {
    constructor() {
        this.apiKey = process.env.API_KEY;
        this.apiUrl = process.env.API_URL || 'https://openrouter.ai/api/v1/chat/completions';
        this.model = process.env.MODEL || 'meta-llama/llama-3.2-11b-vision-instruct:free';
    }

    async getSuggestionsWithResume(resumeText, jobs) {
        // Construct prompt
        const jobList = jobs.map(job => ({
            id: job.jobPostId,
            title: job.title,
            skills: job.skills ? job.skills.map(s => s.name).join(', ') : '',
            requirements: job.requirements,
            salary: job.salaryDisplay || (job.salaryMin && job.salaryMax ? `${job.salaryMin}-${job.salaryMax}` : 'Negotiable')
        }));

        const prompt = `
            You are a recruitment expert AI.
            Candidate Resume Content:
            """
            ${resumeText}
            """

            Available Jobs (STRICT LIST):
            ${JSON.stringify(jobList, null, 2)}

            Task:
            1. Analyze the candidate's resume content.
            2. Match against the Available Jobs ONLY. Do NOT invent new jobs.
            3. Select the top 5 most suitable jobs from the provided list.
            4. Return ONLY a valid JSON object with this structure:
            {
                "data": [
                    { "jobId": <Must be one of the IDs from Available Jobs>, "match_score": <0-100>, "reason": "<explanation>" }
                ]
            }
        `;

        const payload = JSON.stringify({
            model: this.model,
            messages: [
                { role: 'system', content: 'You are a helpful AI assistant that outputs only valid JSON.' },
                { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' }
        });

        const result = await this._callAI(payload);

        // Filter hallucinations
        if (result && result.data && Array.isArray(result.data)) {
            const validIds = new Set(jobList.map(j => j.id));
            const originalCount = result.data.length;
            result.data = result.data.filter(item => validIds.has(item.jobId));
            if (result.data.length < originalCount) {
                console.warn(`[AIService] Filtered ${originalCount - result.data.length} invalid/hallucinated job IDs.`);
            }
        }
        return result;
    }

    async getSuggestions(candidateProfile, jobs) {
        // Deprecated or keep for compatibility if needed.
        // Reusing _callAI logic to avoid duplication if I refactor.

        // ... existing logic ...
        // But to keep it clean, let's just make _callAI helper.

        // For now, I will just copy the logic or refactor.
        // Refactoring to use helper _callAI
        const jobList = jobs.map(job => ({
            id: job.jobPostId,
            title: job.title,
            skills: job.skills ? job.skills.map(s => s.name).join(', ') : '',
            requirements: job.requirements
        }));

        const prompt = `
            You are a recruitment expert AI.
            Candidate Profile:
            - Skills: ${candidateProfile.skills.join(', ')}
            - Title/Role: ${candidateProfile.title || 'N/A'}

            Available Jobs (STRICT LIST):
            ${JSON.stringify(jobList, null, 2)}

            Task:
            Analyze the candidate's profile against the available jobs.
            Select the top 5 most suitable jobs.
            Match against the Available Jobs ONLY. Do NOT invent new jobs.
            Return ONLY a valid JSON object with the following structure:
            {
                "data": [
                    { "jobId": <Must be one of the IDs from Available Jobs>, "match_score": <0-100>, "reason": "<short explanation>" }
                ]
            }
        `;

        const payload = JSON.stringify({
            model: this.model,
            messages: [
                { role: 'system', content: 'You are a helpful AI assistant that outputs only valid JSON.' },
                { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' }
        });

        const result = await this._callAI(payload);

        // Filter hallucinations
        if (result && result.data && Array.isArray(result.data)) {
            const validIds = new Set(jobList.map(j => j.id));
            const originalCount = result.data.length;
            result.data = result.data.filter(item => validIds.has(item.jobId));
            if (result.data.length < originalCount) {
                console.warn(`[AIService] Filtered ${originalCount - result.data.length} invalid/hallucinated job IDs.`);
            }
        }
        return result;
    }

    async generateInterviewQuestions(cvText, jdText) {
        const prompt = `Bạn là chuyên gia tuyển dụng Kỹ sư Phần mềm. Dựa trên CV của ứng viên và Mô tả công việc (Job Description) bên dưới, hãy tạo ra 10 câu hỏi phỏng vấn chuyên sâu và cá nhân hóa.

Yêu cầu cụ thể:
1. Số lượng: Tối thiểu 10 câu hỏi.
2. Nội dung: Tối thiểu 5 câu hỏi phải lấy thông tin trực tiếp (tên dự án, công nghệ, công ty cũ, hoặc kinh nghiệm) từ CV ứng viên để xoáy sâu. Không hỏi lý thuyết chung chung.
3. Độ khó: Trung bình - Khó. Hỏi về lý do chọn giải pháp (Why) hoặc cách xử lý (How).
4. Ngôn ngữ: TẤT CẢ câu hỏi (content) và câu trả lời gợi ý (expected_answer) BẮT BUỘC phải viết bằng Tiếng Việt (Vietnamese).

Định dạng trả về BẮT BUỘC (chỉ trả về JSON, không kèm thêm text/markdown khác):
{
  "data": [
    {
      "type": "Technical",
      "content": "Nội dung câu hỏi phỏng vấn",
      "expected_answer": "Ý chính cần thiết để đánh giá"
    }
  ]
}

--- Dữ liệu đầu vào ---
Job Description:
${jdText}

CV Candidate:
${cvText}`;

        const payload = JSON.stringify({
            model: this.model,
            messages: [
                { role: 'system', content: 'You are a helpful AI assistant that outputs only valid JSON.' },
                { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' }
        });

        const result = await this._callAI(payload);

        if (result && result.data && Array.isArray(result.data)) {
            return result.data;
        }

        throw new Error('Invalid JSON format from AI response: Missing data array');
    }

    async _callAI(payload) {
        return new Promise((resolve, reject) => {
            const url = new URL(this.apiUrl);
            // Use byteLength for Content-Length to handle multi-byte characters correctly
            const byteLength = Buffer.byteLength(payload);

            const options = {
                hostname: url.hostname,
                path: url.pathname,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Length': byteLength
                }
            };

            console.log(`[AIService] Sending request to OpenRouter (Payload size: ${byteLength} bytes)...`);

            const req = https.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        try {
                            const response = JSON.parse(data);
                            if (!response.choices || response.choices.length === 0) {
                                throw new Error('AI returned empty choices');
                            }
                            const content = response.choices[0].message.content;
                            console.log('[AIService] AI Response received successfully.');

                            // Try to parse the content as JSON if it's expected
                            try {
                                const jsonContent = JSON.parse(content);
                                resolve(jsonContent);
                            } catch (jsonErr) {
                                console.warn('[AIService] Response content is not valid JSON, returning raw string.');
                                resolve({ data: content });
                            }
                        } catch (err) {
                            console.error('[AIService] Failed to parse AI response:', err.message);
                            reject(new Error('Failed to parse AI response: ' + err.message));
                        }
                    } else {
                        console.error(`[AIService] AI Request Failed: ${res.statusCode} ${res.statusMessage}`);
                        console.error(`[AIService] Error Detail: ${data.substring(0, 500)}`);
                        reject(new Error(`AI Service Request Failed: ${res.statusCode} ${res.statusMessage} - ${data}`));
                    }
                });
            });

            req.on('error', (error) => {
                console.error('[AIService] HTTPS Request Error:', error.message);
                reject(error);
            });

            req.write(payload);
            req.end();
        });
    }
}

module.exports = new AIService();
