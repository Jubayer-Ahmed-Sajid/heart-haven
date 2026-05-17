const jwt = require('jsonwebtoken');
const SupportRepository = require('../repositories/support.repository');

function registerSocketHandlers(io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      socket.data.user = { alias: 'Anonymous' };
      return next();
    }

    try {
      socket.data.user = jwt.verify(token, process.env.JWT_SECRET || 'change-me');
      return next();
    } catch (_error) {
      return next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    socket.on('support:join', async ({ roomKey, conversationId, topic }, ack) => {
      try {
        let conversation = null;
        if (conversationId) {
          conversation = { _id: conversationId };
        } else if (roomKey) {
          conversation = await SupportRepository.findOrCreateConversation({
            roomKey,
            participantIds: [],
            topic,
          });
        }

        if (conversation?._id) {
          socket.join(conversation._id.toString());
          if (typeof ack === 'function') {
            ack({ ok: true, conversationId: conversation._id.toString() });
          }
        } else if (typeof ack === 'function') {
          ack({ ok: false, error: 'conversationId or roomKey is required' });
        }
      } catch (error) {
        if (typeof ack === 'function') {
          ack({ ok: false, error: error.message });
        }
      }
    });

    socket.on('support:message', async (payload, ack) => {
      try {
        const conversationId = payload.conversationId || socket.data.user?.conversationId;
        const senderAlias = payload.senderAlias || socket.data.user?.alias || 'Anonymous';
        if (!conversationId) {
          throw new Error('conversationId is required');
        }

        const saved = await SupportRepository.createMessage({
          conversationId,
          senderAlias,
          body: payload.body,
        });
        io.to(conversationId.toString()).emit('support:message:new', saved);
        if (typeof ack === 'function') ack({ ok: true, message: saved });
      } catch (error) {
        if (typeof ack === 'function') ack({ ok: false, error: error.message });
      }
    });
  });
}

module.exports = { registerSocketHandlers };
