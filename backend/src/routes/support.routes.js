const router = require('express').Router();
const {
  createConversation,
  getMessages,
  createMessage,
} = require('../controllers/support.controller');

router.post('/conversations', createConversation);
router.get('/conversations/:conversationId/messages', getMessages);
router.post('/messages', createMessage);

module.exports = router;
