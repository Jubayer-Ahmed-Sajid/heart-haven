const SupportRepository = require('../repositories/support.repository');

async function createConversation(req, res, next) {
  try {
    const roomKey = String(req.body.roomKey || '').trim();
    if (!roomKey) {
      return res.status(400).json({ message: 'roomKey is required' });
    }

    const conversation = await SupportRepository.findOrCreateConversation({
      roomKey,
      participantIds: req.body.participantIds || [],
      topic: req.body.topic || 'breakup-support',
    });

    res.status(201).json({ item: conversation });
  } catch (error) {
    next(error);
  }
}

async function getMessages(req, res, next) {
  try {
    const messages = await SupportRepository.listMessages(req.params.conversationId);
    res.json({ items: messages });
  } catch (error) {
    next(error);
  }
}

async function createMessage(req, res, next) {
  try {
    const senderAlias = req.user?.alias || req.body.senderAlias || 'Anonymous';
    const conversationId = req.user?.conversationId || req.body.conversationId;
    const body = String(req.body.body || '').trim();

    if (!conversationId) {
      return res.status(400).json({ message: 'conversationId is required' });
    }

    if (!body) {
      return res.status(400).json({ message: 'body is required' });
    }

    const message = await SupportRepository.createMessage({
      conversationId,
      senderAlias,
      body,
    });

    res.status(201).json({ item: message });
  } catch (error) {
    next(error);
  }
}

module.exports = { createConversation, getMessages, createMessage };
