class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  find(query = {}, options = {}) {
    return this.model.find(query, null, options);
  }

  findById(id) {
    return this.model.findById(id);
  }

  create(data) {
    return this.model.create(data);
  }
}

module.exports = BaseRepository;
