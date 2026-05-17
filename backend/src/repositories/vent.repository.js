const BaseRepository = require('./base.repository');
const VentPost = require('../models/VentPost');

class VentRepository extends BaseRepository {
  constructor() {
    super(VentPost);
  }

  listLatest(limit = 20) {
    return this.model.find({}).sort({ createdAt: -1 }).limit(limit);
  }
}

module.exports = new VentRepository();
