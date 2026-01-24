const BaseRepository = require('./BaseRepository');
const { Role } = require('../models');

class RoleRepository extends BaseRepository {
    constructor() {
        super(Role);
    }

    async findByName(roleName) {
        return await this.findOne({ roleName });
    }
}

module.exports = new RoleRepository();
