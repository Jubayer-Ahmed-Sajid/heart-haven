const ResourceRepository = require('../repositories/resource.repository');
const { seedResources } = require('../utils/seedData');

async function listResources(_req, res, next) {
  try {
    const existing = await ResourceRepository.listAll();
    if (!existing.length) {
      await ResourceRepository.model.insertMany(seedResources);
      const seeded = await ResourceRepository.listAll();
      return res.json({ items: seeded });
    }
    res.json({ items: existing });
  } catch (error) {
    next(error);
  }
}

module.exports = { listResources };
