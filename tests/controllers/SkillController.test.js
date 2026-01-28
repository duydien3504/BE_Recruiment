const SkillController = require('../../src/controllers/SkillController');
const SkillService = require('../../src/services/SkillService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/SkillService');

const req = {
    params: { id: 1 },
    body: { name: 'Java' }
};
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};
const next = jest.fn();

describe('SkillController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('getAllSkills should return 200', async () => {
        SkillService.getAllSkills.mockResolvedValue([]);
        await SkillController.getAllSkills(req, res, next);
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    });

    it('createSkill should return 201', async () => {
        SkillService.createSkill.mockResolvedValue({});
        await SkillController.createSkill(req, res, next);
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
    });

    it('updateSkill should return 200', async () => {
        SkillService.updateSkill.mockResolvedValue({});
        await SkillController.updateSkill(req, res, next);
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    });

    it('deleteSkill should return 200', async () => {
        SkillService.deleteSkill.mockResolvedValue(true);
        await SkillController.deleteSkill(req, res, next);
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    });
});
