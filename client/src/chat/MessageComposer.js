import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { css, keyframes } from 'styled-components';
import SendIcon from 'react-icons/lib/md/send';
import { guid } from '../services/utils';

const propTypes = {
  addMessage: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  followMessages: PropTypes.func.isRequired
};

class MessageComposer extends Component {
  state = {
    message: '',
    inputFocused: false,
  }

  handleSubmit = event => {
    event.preventDefault();
    const { message } = this.state;
    const { user } = this.props;

    if (message) {
      this.props.addMessage({ id: guid(), content: message, sender: user });
      this.setState({ message: '' });
      this.props.followMessages();
    }
  }

  handleChange = ({ target }) => {
    this.setState({ message: target.value });
  }

  handleFocus = () => {
    this.setState({ inputFocused: true });
  }

  handleBlur = () => {
    this.setState({ inputFocused: false });
  }

  render() {
    const { message, inputFocused } = this.state;

    return (
      <Wrapper onSubmit={this.handleSubmit}>
        <Blinker blink={!inputFocused} />

        <Input
          value={message}
          onChange={this.handleChange}
          placeholder='Yak to your buddies...'
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
        />

        <SendButton type='submit'>
          <Icon readyToSend={message && message.length > 0} />
        </SendButton>
      </Wrapper>
    );
  }
}

const blink = keyframes`
  from { opacity: 0 }
  to { opacity: 1 }
`;

const Wrapper = styled.form`
  height: 60px;
  border-top: 1px solid ${props => props.theme.greyLight};
  padding: 0px 16px;
  display: flex;
  align-items: center;
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: white;
`;

const Input = styled.input`
  padding: 12px 0px;
  border: none;
  background: none;
  flex: 1;
  outline: none;
  margin-left: 2px;
  font-size: 14px;
`;

const SendButton = styled.button`
  border: none;
  background: none;
  margin-left: 16px;
  outline: none;
  transition: transform 0.3s ease;

  &:active {
    transform: scale(1.2);
  }
`;

const Icon = styled(SendIcon)`
  width: 24px;
  height: 24px;
  transition: fill 0.4s ease;
  fill: ${props => props.theme.greyLighter};

  ${props => props.readyToSend && css`
    fill: ${props.theme.secondaryColor};
  `}
`;

const Blinker = styled.div`
  height: 24px;
  width: 4px;
  background-color: ${props => props.theme.secondaryColor};
  opacity: 0;
  border-radius: 2px;

  ${props => props.blink && css`
    animation: ${blink} infinite 2s forwards;
  `}
`;

MessageComposer.propTypes = propTypes;

export default MessageComposer;
