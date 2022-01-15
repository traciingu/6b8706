const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      const message = await Message.create({ senderId, text, conversationId, readReceipt: false, });
      return res.json({ message, sender });
    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }

    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
      readReceipt: false
    });

    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

// expects { recipientId } in body
router.patch("/:conversationId", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    const { recipientId } = req.body;
    const userId = req.user.id;
    const conversationId = req.params.conversationId;
    const conversation = await Conversation.findConversation(userId, recipientId);

    if (!conversation) {
      return res.sendStatus(401);
    }

    await Message.update(
      { readReceipt: true }, {
      where: {
        senderId: recipientId,
        conversationId: conversationId,
        readReceipt: false
      }
    });

    const messages = await Message.findAll({
      where: {
        conversationId: conversationId
      },
      order: [
        ['createdAt', 'ASC']
      ]
    });

    const updatedMessages = {
      messages,
      otherUserId: recipientId,
      userId: userId
    };

    res.json(updatedMessages);

  } catch (error) {
    next(error);
  }
});

module.exports = router;
