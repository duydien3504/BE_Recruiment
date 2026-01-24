class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        return await this.model.create(data);
    }

    async findById(id, options = {}) {
        return await this.model.findByPk(id, options);
    }

    async findOne(conditions, options = {}) {
        return await this.model.findOne({
            where: conditions,
            ...options
        });
    }

    async findAll(conditions = {}, options = {}) {
        return await this.model.findAll({
            where: conditions,
            ...options
        });
    }

    async findAndCountAll(conditions = {}, options = {}) {
        return await this.model.findAndCountAll({
            where: conditions,
            ...options
        });
    }

    async update(id, data) {
        const record = await this.findById(id);
        if (!record) {
            return null;
        }
        return await record.update(data);
    }

    async delete(id) {
        const record = await this.findById(id);
        if (!record) {
            return false;
        }
        await record.destroy();
        return true;
    }

    async softDelete(id) {
        return await this.update(id, { isDeleted: true });
    }

    async count(conditions = {}) {
        return await this.model.count({ where: conditions });
    }

    async bulkCreate(dataArray) {
        return await this.model.bulkCreate(dataArray);
    }
}

module.exports = BaseRepository;
