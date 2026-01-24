const BaseRepository = require('./BaseRepository');
const { Location } = require('../models');

class LocationRepository extends BaseRepository {
    constructor() {
        super(Location);
    }

    async findByName(name) {
        return await this.findOne({ name });
    }

    async findAllActive(options = {}) {
        return await this.findAll({}, options);
    }
}

module.exports = new LocationRepository();
