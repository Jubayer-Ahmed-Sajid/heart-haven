const SupportRepository = require('../repositories/support.repository');

async function createConversation(req, res, next) {
  try {
    const conversation = await SupportRepository.createConversation({
      roomKey: req.body.roomKey,
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
    const message = await SupportRepository.createMessage(req.body);
    res.status(201).json({ item: message });
  } catch (error) {
    next(error);
  }
}

module.exports = { createConversation, getMessages, createMessage };
