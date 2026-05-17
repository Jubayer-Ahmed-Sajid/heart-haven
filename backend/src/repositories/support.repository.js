const SupportConversation = require('../models/SupportConversation');
const SupportMessage = require('../models/SupportMessage');

class SupportRepository {
  async createConversation(payload) {
    return SupportConversation.create(payload);
  }

  async listMessages(conversationId) {
    return SupportMessage.find({ conversationId }).sort({ createdAt: 1 });
  }

  async createMessage(payload) {
    return SupportMessage.create(payload);
  }
}

module.exports = new SupportRepository();
