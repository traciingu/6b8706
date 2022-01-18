const Sequelize = require("sequelize");
const db = require("../db");

const ReadMessage = db.define("readMessage", {
  readReceipt: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = ReadMessage;