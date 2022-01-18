const db = require("../db");
const Participant = require("./participant");
const Conversation = db.define("conversation", {});

// find conversation given two user Ids

Conversation.findConversation = async function (userIds) {
  const uniqueUserIds = [...new Set(userIds)];

  const conversations = await Participant.findAll({
    attributes: [
      'conversationId',
      [Sequelize.fn('array_agg', Sequelize.col('userId')), 'userIds']
    ],
    group: 'conversationId',
    raw: true
  });

  const matchedConvo = conversations?.filter(conversation => conversation.userIds.includes(uniqueUserIds));

  // return conversation or undefined if it doesn't exist
  return matchedConvo;
};

module.exports = Conversation;
