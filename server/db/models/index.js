const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const Participant = require("./participant");
const ReadMessage = require("./readMessage");

// associations

User.hasMany(Conversation);
Conversation.belongsToMany(User, {through: Participant});
User.belongsToMany(Conversation, {through: Participant});
Message.belongsTo(Conversation);
Conversation.hasMany(Message);
Message.belongsToMany(User, {through: ReadMessage});
User.belongsToMany(Message, {through: ReadMessage});


module.exports = {
  User,
  Conversation,
  Message,
  Participant
};
