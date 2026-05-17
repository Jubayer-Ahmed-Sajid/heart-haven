const mongoose = require('mongoose');

const SupportConversationSchema = new mongoose.Schema(
  {
    roomKey: { type: String, required: true, unique: true, index: true },
    participantIds: [{ type: String }],
    topic: { type: String, default: 'breakup-support' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SupportConversation', SupportConversationSchema);
