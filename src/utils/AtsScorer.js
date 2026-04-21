/**
 * Class utility hỗ trợ chấm điểm ATS sơ bộ cho CV trước khi quét bằng AI.
 * Ưu tiên độ phức tạp O(n) (1 vòng lặp qua keys/arrays).
 */
class AtsScorer {
    /**
     * Dựa vào dữ liệu cvData (JSON/Object), đánh giá mức độ hoàn thiện của CV.
     * Quy tắc giả định (O(n)): 
     * - Có mảng experience và length > 0: +20
     * - Có mảng education và length > 0: +15
     * - Có mảng skills và length > 0:     +15
     * - Độ dài tổng văn bản mô tả (ví dụ about, experience description) lớn hơn 200: +20
     * - Thông tin liên hệ (đếm qua personalInfo / contact_info keys): +30 maximum
     * (Đây là logic cơ bản - thay thế thật khi có quy chuẩn chi tiết của KH)
     * @param {Object} cvData 
     * @returns {number} Score (0-100)
     */
    static calculateScore(cvData) {
        if (!cvData || typeof cvData !== 'object') return 0;

        let score = 0;

        // 1. Kiểm tra Experience
        const experience = cvData.experience || (cvData.cvData && cvData.cvData.experience); // Hỗ trợ nested
        if (Array.isArray(experience) && experience.length > 0) {
            score += 20;
            // Độ dài mô tả
            let totalDescLength = 0;
            for (let i = 0; i < experience.length; i++) {
                if (experience[i].description) {
                    totalDescLength += String(experience[i].description).length;
                }
            }
            if (totalDescLength > 200) score += 20;
            else if (totalDescLength > 50) score += 10;
        }

        // 2. Kiểm tra Education
        const education = cvData.education || (cvData.cvData && cvData.cvData.education);
        if (Array.isArray(education) && education.length > 0) {
            score += 15;
        }

        // 3. Kiểm tra Skills
        const skillsObj = cvData.skills || (cvData.cvData && cvData.cvData.skills);
        if (skillsObj) {
            // Có array items
            if (Array.isArray(skillsObj.items) && skillsObj.items.length > 0) {
                score += 15;
            } else if (Array.isArray(skillsObj) && skillsObj.length > 0) {
                // fallback if skills is an array
                score += 15;
            }
        }

        // 4. Contact/Personal Info
        const personalInfo = cvData.personal || cvData.personalInfo || (cvData.cvData && cvData.cvData.personal);
        if (personalInfo && typeof personalInfo === 'object') {
            if (personalInfo.email) score += 10;
            if (personalInfo.phone || personalInfo.phoneNumber) score += 10;
            if (personalInfo.fullName || personalInfo.name) score += 10;
        } else {
            // Nếu không có block personal, kiểm tra trực tiếp
            if (cvData.email) score += 10;
            if (cvData.phone || cvData.phoneNumber) score += 10;
            if (cvData.fullName || cvData.name) score += 10;
        }

        // Cap score at 100
        return Math.min(score, 100);
    }
}

module.exports = AtsScorer;
