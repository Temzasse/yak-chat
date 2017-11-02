import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const propTypes = {
  something: PropTypes.any,
};

const Chat = () => (
  <ChatWrapper>
    Chat
  </ChatWrapper>
);

const ChatWrapper = styled.div`

`;

Chat.propTypes = propTypes;

export default Chat;
