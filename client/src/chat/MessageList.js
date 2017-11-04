import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import format from 'date-fns/format';
import MessageItem from './MessageItem';

const propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    timestamp: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['message', 'file']).isRequired,
    sender: PropTypes.object.isRequired,
  })).isRequired,
};

const MessageList = ({ messages, user }) => (
  <Wrapper>
    {messages.map(msg =>
      <MessageItem
        isOwn={msg.sender.id === user.id}
        time={format(new Date(msg.timestamp), 'HH.mm')}
        content={msg.content}
      />
    )}
  </Wrapper>
);

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  padding: 16px;
  overflow-y: scroll;
  overflow-x: hidden;
`;

MessageList.propTypes = propTypes;

export default MessageList;
