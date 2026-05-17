const SupportMessageRepository = require('../repositories/support.repository');

function registerSocketHandlers(io) {
  io.on('connection', (socket) => {
    socket.on('support:join', ({ conversationId }) => {
      if (conversationId) {
        socket.join(conversationId);
      }
    });

    socket.on('support:message', async (payload, ack) => {
      try {
        const saved = await SupportMessageRepository.createMessage(payload);
        io.to(saved.conversationId.toString()).emit('support:message:new', saved);
        if (typeof ack === 'function') ack({ ok: true, message: saved });
      } catch (error) {
        if (typeof ack === 'function') ack({ ok: false, error: error.message });
      }
    });
  });
}

module.exports = { registerSocketHandlers };
