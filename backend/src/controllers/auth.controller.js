const jwt = require('jsonwebtoken');
const SupportRepository = require('../repositories/support.repository');

async function createSupportSession(req, res, next) {
  try {
    const roomKey = String(req.body.roomKey || 'heart-haven-support').trim();
    const alias = String(req.body.alias || 'Anonymous').trim().slice(0, 40) || 'Anonymous';
    const participantIds = Array.isArray(req.body.participantIds) ? req.body.participantIds : [];
    const topic = String(req.body.topic || 'breakup-support').trim();

    const conversation = await SupportRepository.findOrCreateConversation({
      roomKey,
      participantIds,
      topic,
    });

    const token = jwt.sign(
      {
        roomKey,
        alias,
        conversationId: conversation._id.toString(),
      },
      process.env.JWT_SECRET || 'change-me',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      item: conversation,
      token,
      alias,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { createSupportSession };
