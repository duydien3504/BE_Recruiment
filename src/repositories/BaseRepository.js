class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    async create(data, options = {}) {
        if (Object.keys(options).length === 0) {
            return await this.model.create(data);
        }
        return await this.model.create(data, options);
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

    async update(id, data, options = {}) {
        const record = await this.findById(id, options);
        if (!record) {
            return null;
        }
        if (Object.keys(options).length === 0) {
            return await record.update(data);
        }
        return await record.update(data, options);
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
