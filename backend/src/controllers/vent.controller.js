const VentRepository = require('../repositories/vent.repository');

async function listVents(_req, res, next) {
  try {
    const vents = await VentRepository.listLatest();
    res.json({ items: vents });
  } catch (error) {
    next(error);
  }
}

async function createVent(req, res, next) {
  try {
    const vent = await VentRepository.create({
      alias: req.body.alias || 'Anonymous',
      body: req.body.body,
      mood: req.body.mood || 'heavy',
      isAnonymous: true,
    });

    res.status(201).json({ item: vent });
  } catch (error) {
    next(error);
  }
}

module.exports = { listVents, createVent };
