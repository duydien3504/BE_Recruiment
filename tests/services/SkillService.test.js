const SkillService = require('../../src/services/SkillService');
const SkillRepository = require('../../src/repositories/SkillRepository');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/repositories/SkillRepository');

describe('SkillService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllSkills', () => {
        it('should return list of skills', async () => {
            const mockSkills = [{ id: 1, name: 'Java' }];
            SkillRepository.findAllActive.mockResolvedValue(mockSkills);
            const result = await SkillService.getAllSkills();
            expect(result).toEqual(mockSkills);
        });
    });

    describe('createSkill', () => {
        it('should create skill successfully', async () => {
            const data = { name: 'Java' };
            SkillRepository.findByName.mockResolvedValue(null);
            SkillRepository.create.mockResolvedValue(data);
            const result = await SkillService.createSkill(data);
            expect(result).toEqual(data);
        });

        it('should throw error if exists', async () => {
            SkillRepository.findByName.mockResolvedValue({ id: 1 });
            await expect(SkillService.createSkill({ name: 'Java' }))
                .rejects.toThrow('Kỹ năng này đã tồn tại.');
        });
    });

    describe('updateSkill', () => {
        it('should update skill successfully', async () => {
            SkillRepository.findById.mockResolvedValue({ id: 1, name: 'Old' });
            SkillRepository.findByName.mockResolvedValue(null);
            SkillRepository.update.mockResolvedValue([1]);
            await SkillService.updateSkill(1, { name: 'New' });
            expect(SkillRepository.update).toHaveBeenCalledWith(1, { name: 'New' });
        });
    });

    describe('deleteSkill', () => {
        it('should delete skill successfully', async () => {
            SkillRepository.findById.mockResolvedValue({ id: 1 });
            SkillRepository.delete.mockResolvedValue(1);
            await SkillService.deleteSkill(1);
            expect(SkillRepository.delete).toHaveBeenCalledWith(1);
        });
    });
});
