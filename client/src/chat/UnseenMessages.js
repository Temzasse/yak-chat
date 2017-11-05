import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const propTypes = {
  handlePress: PropTypes.func.isRequired,
};

const UnseenMessages = ({ handlePress }) => (
  <UnseenMessagesWrapper onClick={handlePress}>
    You have new messages
  </UnseenMessagesWrapper>
);

const UnseenMessagesWrapper = styled.div`
  position: sticky;
  bottom: 8px;
  left: 50%;
  width: 160px;
  text-align: center;
  transform: translateX(-50%);
  border-radius: 24px;
  background-color: ${props => props.theme.secondaryColorLight};
  color: #fff;
  font-size: 14px;
  padding: 6px 12px;
  box-shadow: 0px 2px 6px rgba(0,0,0,0.4);
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.secondaryColor};
  }

  &:active {
    background-color: ${props => props.theme.secondaryColorDark};
  }
`;

UnseenMessages.propTypes = propTypes;

export default UnseenMessages;
