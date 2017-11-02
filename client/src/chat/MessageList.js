import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const propTypes = {
  something: PropTypes.any,
};

const MessageList = ({ messages }) => (
  <MessageListWrapper>
    
  </MessageListWrapper>
);

const MessageListWrapper = styled.div`

`;

MessageList.propTypes = propTypes;

export default MessageList;
