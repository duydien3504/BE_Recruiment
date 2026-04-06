const AtsScorer = require('../../src/utils/AtsScorer');

describe('AtsScorer', () => {
    test('should return 0 for null or non-object input', () => {
        expect(AtsScorer.calculateScore(null)).toBe(0);
        expect(AtsScorer.calculateScore(undefined)).toBe(0);
        expect(AtsScorer.calculateScore('string')).toBe(0);
        expect(AtsScorer.calculateScore([])).toBe(0);
    });

    test('should score experience correctly', () => {
        const cvData = {
            experience: [
                { description: 'Short' }
            ]
        };
        // array length > 0: +20. desc length = 5 (<= 50): +0 => 20
        expect(AtsScorer.calculateScore(cvData)).toBe(20);

        cvData.experience[0].description = '1234567890'.repeat(6); // length 60
        // length > 50: +10 => 30
        expect(AtsScorer.calculateScore(cvData)).toBe(30);

        cvData.experience[0].description = '1234567890'.repeat(21); // length 210
        // length > 200: +20 => 40
        expect(AtsScorer.calculateScore(cvData)).toBe(40);
    });

    test('should score education correctly', () => {
        const cvData = {
            education: [{ degree: 'BSc' }]
        };
        expect(AtsScorer.calculateScore(cvData)).toBe(15);
    });

    test('should score skills correctly', () => {
        const cvData = {
            skills: { items: [{ name: 'A' }] }
        };
        expect(AtsScorer.calculateScore(cvData)).toBe(15);

        const cvData2 = {
            skills: [{ name: 'A' }]
        };
        expect(AtsScorer.calculateScore(cvData2)).toBe(15);
    });

    test('should score contact info correctly', () => {
        const cvData = {
            personalInfo: { email: 'test@a.com', phone: '0123', name: 'John' }
        };
        // email, phone, name => 30
        expect(AtsScorer.calculateScore(cvData)).toBe(30);
    });

    test('should score contact info directly in cvData', () => {
        const cvData = {
            email: 'test@a.com', phoneNumber: '0123'
        };
        // email, phone => 20
        expect(AtsScorer.calculateScore(cvData)).toBe(20);
    });

    test('should cap score at 100', () => {
        const cvData = {
            experience: [{ description: '1234567890'.repeat(21) }], // 40
            education: [{ degree: 'BSc' }], // 15
            skills: { items: [{ name: 'Node' }] }, // 15
            personalInfo: { email: 'a@a', phone: '1', name: 'A' } // 30
        };
        // Total theoretically: 40 + 15 + 15 + 30 = 100
        expect(AtsScorer.calculateScore(cvData)).toBe(100);
    });
});
