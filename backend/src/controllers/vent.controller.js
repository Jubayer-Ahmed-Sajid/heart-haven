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
    const body = String(req.body.body || '').trim();
    if (!body) {
      return res.status(400).json({ message: 'body is required' });
    }

    const vent = await VentRepository.create({
      alias: req.body.alias || 'Anonymous',
      body,
      mood: req.body.mood || 'heavy',
      isAnonymous: true,
    });

    res.status(201).json({ item: vent });
  } catch (error) {
    next(error);
  }
}

module.exports = { listVents, createVent };
