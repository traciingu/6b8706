import React, { useState, useEffect } from "react";
import { Avatar, Box, makeStyles } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const useStyles = makeStyles(() => ({
  readIcon: {
    marginLeft: "auto",
    height: 20,
    width: 20,
    marginTop: 5
  }
}));

const Messages = (props) => {
  const classes = useStyles();
  const { messages, otherUser, userId } = props;
  const [lastReadMessage, setLastReadMessage] = useState({});

  useEffect(() => {
    setLastReadMessage((messages && messages.filter(message => {
      return message.readReceipt === true && message.senderId === userId;
    }).at(-1)) || {});
  }, [messages]);

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");

        return (message.senderId === userId ? (
          <>
            <SenderBubble key={message.id} text={message.text} time={time} />
            {lastReadMessage.id === message.id ? <Avatar className={classes.readIcon} src={otherUser.photoUrl} alt="Read icon of other user's avatar"></Avatar> : ''}
          </>
        ) : (
          <OtherUserBubble key={message.id} text={message.text} time={time} otherUser={otherUser} />
        ));
      })}
    </Box>
  );
};

export default Messages;
