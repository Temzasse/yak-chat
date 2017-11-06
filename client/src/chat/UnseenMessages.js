import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Transition } from 'react-transition-group';

const propTypes = {
  handlePress: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
};

const UnseenMessages = ({ handlePress, show }) => (
  <Transition in={show} timeout={300} mountOnEnter unmountOnExit>
    {state => (
      <UnseenMessagesWrapper onClick={handlePress} show={state === 'entered'}>
        You have new messages
      </UnseenMessagesWrapper>
    )}
  </Transition>
);

const UnseenMessagesWrapper = styled.div`
  position: sticky;
  bottom: 8px;
  left: 50%;
  width: 160px;
  text-align: center;
  transform: translateX(-50%) translateY(110%);
  border-radius: 24px;
  background-color: ${props => props.theme.secondaryColorLight};
  color: #fff;
  font-size: 14px;
  padding: 6px 12px;
  box-shadow: 0px 2px 6px rgba(0,0,0,0.4);
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0;

  ${props => props.show && css`
    opacity: 1;
    transform: translateX(-50%) translateY(0%);
  `}

  &:hover {
    background-color: ${props => props.theme.secondaryColor};
  }

  &:active {
    background-color: ${props => props.theme.secondaryColorDark};
  }
`;

UnseenMessages.propTypes = propTypes;

export default UnseenMessages;
