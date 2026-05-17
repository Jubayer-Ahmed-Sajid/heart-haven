const SupportConversation = require('../models/SupportConversation');
const SupportMessage = require('../models/SupportMessage');

class SupportRepository {
  async findOrCreateConversation(payload) {
    const roomKey = payload.roomKey;
    return SupportConversation.findOneAndUpdate(
      { roomKey },
      {
        $setOnInsert: {
          roomKey,
          participantIds: payload.participantIds || [],
          topic: payload.topic || 'breakup-support',
        },
      },
      { new: true, upsert: true }
    );
  }

  async createConversation(payload) {
    return this.findOrCreateConversation(payload);
  }

  async findConversationByRoomKey(roomKey) {
    return SupportConversation.findOne({ roomKey });
  }

  async listMessages(conversationId) {
    return SupportMessage.find({ conversationId }).sort({ createdAt: 1 });
  }

  async createMessage(payload) {
    return SupportMessage.create(payload);
  }
}

module.exports = new SupportRepository();
