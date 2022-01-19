const Sequelize = require("sequelize");
const db = require("../db");

const ReadMessage = db.define("readMessage", {
  isRead: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = ReadMessage;