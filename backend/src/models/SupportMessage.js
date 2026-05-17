const mongoose = require('mongoose');

const SupportMessageSchema = new mongoose.Schema(
  {
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'SupportConversation', required: true },
    senderAlias: { type: String, required: true },
    body: { type: String, required: true, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SupportMessage', SupportMessageSchema);
