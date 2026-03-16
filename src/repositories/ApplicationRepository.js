const BaseRepository = require('./BaseRepository');
const { Application } = require('../models');
const { Op } = require('sequelize');

class ApplicationRepository extends BaseRepository {
    constructor() {
        super(Application);
    }

    async findByJobPost(jobPostId, options = {}) {
        const { User, Resume } = require('../models');
        return await this.findAll({ jobPostId }, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['userId', 'fullName', 'email', 'phoneNumber', 'avatarUrl']
                },
                {
                    model: Resume,
                    as: 'resume',
                    attributes: ['resumesId', 'fileName', 'fileUrl']
                }
            ],
            order: [['created_at', 'DESC']],
            ...options
        });
    }

    async findByUser(userId, options = {}) {
        const { JobPost, Company, Location, Resume } = require('../models');

        return await this.findAll({ userId }, {
            include: [
                {
                    model: JobPost,
                    as: 'jobPost',
                    attributes: ['jobPostId', 'title', 'salaryMin', 'salaryMax', 'status', 'expiredAt', 'companyId', 'locationId'],
                    include: [
                        {
                            model: Company,
                            as: 'company',
                            attributes: ['companyId', 'name', 'logoUrl']
                        },
                        {
                            model: Location,
                            as: 'location',
                            attributes: ['locationId', 'name']
                        }
                    ]
                },
                {
                    model: Resume,
                    as: 'resume',
                    attributes: ['resumesId', 'fileName', 'fileUrl']
                }
            ],
            order: [['created_at', 'DESC']],
            ...options
        });
    }

    async findByStatus(status, options = {}) {
        return await this.findAll({ status }, options);
    }

    async countByCompanyId(companyId) {
        const { JobPost } = require('../models');
        return await this.model.count({
            include: [
                {
                    model: JobPost,
                    as: 'jobPost',
                    required: true,
                    attributes: [],
                    where: { companyId }
                }
            ]
        });
    }

    async countByCompanyIdAndStatus(companyId, status) {
        const { JobPost } = require('../models');
        return await this.model.count({
            where: { status },
            include: [
                {
                    model: JobPost,
                    as: 'jobPost',
                    required: true,
                    attributes: [],
                    where: { companyId }
                }
            ]
        });
    }

    async updateStatus(applicationId, status, employerNote = null) {
        const updateData = { status };
        if (employerNote) {
            updateData.employerNote = employerNote;
        }
        return await this.update(applicationId, updateData);
    }

    async checkExistingApplication(userId, jobPostId) {
        return await this.findOne({ userId, jobPostId });
    }

    /**
     * Lấy danh sách application của Candidate có pagination + optional status filter.
     *
     * Design:
     *   - Dùng findAndCountAll với WHERE (user_id [, status]) — filter tại DB, không lọc in-memory.
     *   - Select đúng các column cần thiết (no SELECT *) theo RULE.md.
     *   - JOIN job_posts → companies để lấy jobTitle + companyName trong 1 query (tránh N+1).
     *   - ORDER BY applications.created_at DESC: luôn trả mới nhất trước.
     *   - limit/offset cho phân trang — O(log n) qua index trên (user_id, created_at).
     *
     * @param {string}   userId
     * @param {object}   options
     * @param {string}   [options.status]   - Filter theo status enum (optional)
     * @param {number}   options.limit      - Số record mỗi trang
     * @param {number}   options.offset     - Vị trí bắt đầu
     * @returns {Promise<{count: number, rows: Application[]}>}
     */
    async findAndCountByUserId(userId, { status, limit, offset }) {
        const { JobPost, Company } = require('../models');

        const whereClause = { userId };
        if (status) {
            whereClause.status = status;
        }

        return await this.findAndCountAll(whereClause, {
            attributes: [
                'applicationId',
                'jobPostId',
                'coverLetter',
                'status',
                // Fix: dùng tuple [db_column, js_alias] để Sequelize sinh đúng SQL
                // khi explicit attributes + underscored model. 'createdAt' đơn thuần
                // không được map tự động và gây lỗi "column does not exist".
                ['created_at', 'createdAt']
            ],
            include: [
                {
                    model: JobPost,
                    as: 'jobPost',
                    attributes: ['jobPostId', 'title'],
                    include: [
                        {
                            model: Company,
                            as: 'company',
                            attributes: ['companyId', 'name']
                        }
                    ]
                }
            ],
            order: [['created_at', 'DESC']],
            limit,
            offset
        });
    }

    async findAndCountForEmployerApplications(companyId, { jobPostId, skillIds, minExperience, limit, offset }) {
        const { JobPost, User, Skill } = require('../models');

        const jobPostWhere = { companyId };
        if (jobPostId) {
            jobPostWhere.jobPostId = jobPostId;
        }

        const userWhere = {};
        if (typeof minExperience === 'number') {
            userWhere.experienceYears = { [Op.gte]: minExperience };
        }

        const skillInclude = {
            model: Skill,
            as: 'skills',
            through: { attributes: [] },
            attributes: ['skillId', 'name'],
            required: false
        };

        if (Array.isArray(skillIds) && skillIds.length > 0) {
            skillInclude.where = { skillId: { [Op.in]: skillIds } };
            skillInclude.required = true;
        }

        return await this.findAndCountAll({}, {
            attributes: [
                'applicationId',
                'jobPostId',
                'status',
                ['created_at', 'createdAt']
            ],
            include: [
                {
                    model: JobPost,
                    as: 'jobPost',
                    attributes: ['jobPostId', 'title', 'companyId'],
                    required: true,
                    where: jobPostWhere
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['userId', 'fullName', 'experienceYears'],
                    required: true,
                    where: userWhere,
                    include: [skillInclude]
                }
            ],
            order: [['created_at', 'DESC']],
            limit,
            offset,
            distinct: true
        });
    }

    async findEmployerDownloadCvByApplicationId(applicationId) {
        const { JobPost, Resume } = require('../models');

        return await this.findById(applicationId, {
            attributes: ['applicationId', 'status', 'resumesId'],
            include: [
                {
                    model: JobPost,
                    as: 'jobPost',
                    attributes: ['jobPostId', 'companyId']
                },
                {
                    model: Resume,
                    as: 'resume',
                    attributes: ['resumesId', 'fileName', 'fileUrl']
                }
            ]
        });
    }

    /**
     * Tìm application thuộc về userId đang ở trạng thái Pending.
     * Dùng compound WHERE trên (application_id, user_id, status) để:
     *   - Đảm bảo ownership (không xóa nhầm của người khác)
     *   - Đảm bảo chỉ xóa khi status = 'Pending' ngay tại tầng DB
     * Complexity: O(1) vì truy vấn theo PK (application_id) được đánh index.
     *
     * @param {number} applicationId
     * @param {string} userId
     * @returns {Promise<Application|null>}
     */
    async findPendingByIdAndUserId(applicationId, userId) {
        return await this.findOne({
            applicationId,
            userId,
            status: 'Pending'
        }, {
            attributes: ['applicationId', 'userId', 'jobPostId', 'status']
        });
    }

    /**
     * Xóa cứng một application khỏi database.
     * Chỉ nên được gọi sau khi đã verify ownership + status = Pending ở Service.
     *
     * @param {number} applicationId
     * @returns {Promise<boolean>} true nếu xóa thành công
     */
    async deleteById(applicationId) {
        return await this.delete(applicationId);
    }

    async findDetailById(applicationId) {
        const { JobPost, Company, Location, Resume } = require('../models');
        return await this.findById(applicationId, {
            include: [
                {
                    model: JobPost,
                    as: 'jobPost',
                    attributes: ['jobPostId', 'title', 'salaryMin', 'salaryMax', 'status', 'expiredAt', 'companyId', 'locationId', 'description', 'requirements'],
                    include: [
                        { model: Company, as: 'company', attributes: ['companyId', 'name', 'logoUrl', 'scale', 'websiteUrl', 'addressDetail'] },
                        { model: Location, as: 'location', attributes: ['locationId', 'name'] }
                    ]
                },
                {
                    model: Resume,
                    as: 'resume',
                    attributes: ['resumesId', 'fileName', 'fileUrl']
                },
                {
                    model: require('../models').User,
                    as: 'user',
                    attributes: ['userId', 'fullName', 'email', 'phoneNumber', 'avatarUrl']
                }
            ]
        });
    }
}

module.exports = new ApplicationRepository();
