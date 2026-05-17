const BaseRepository = require('./base.repository');
const Resource = require('../models/Resource');

class ResourceRepository extends BaseRepository {
  constructor() {
    super(Resource);
  }

  listAll() {
    return this.model.find({}).sort({ createdAt: 1 });
  }
}

module.exports = new ResourceRepository();
