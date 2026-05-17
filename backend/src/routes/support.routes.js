const router = require('express').Router();
const { authRequired } = require('../middleware/auth');
const {
  createConversation,
  getMessages,
  createMessage,
} = require('../controllers/support.controller');

router.post('/conversations', createConversation);
router.get('/conversations/:conversationId/messages', getMessages);
router.post('/messages', authRequired, createMessage);

module.exports = router;
