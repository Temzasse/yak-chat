import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { inject, observer, PropTypes as pt } from 'mobx-react';

import MessageComposer from './MessageComposer';
import MessageList from './MessageList';
import ChatHeader from './ChatHeader';

const propTypes = {
  user: PropTypes.object.isRequired,
  addMessage: PropTypes.func.isRequired,
  joinChannel: PropTypes.func.isRequired,
  messages: pt.observableArray.isRequired,
  activeChannel: PropTypes.object.isRequired,
};

class ActiveChat extends Component {
  componentDidMount() {
    // Handle autojoining channel
    const { match: { params }, activeChannel } = this.props;
    const { channelId } = params;

    if (activeChannel !== channelId) {
      this.props.joinChannel(channelId);
    }
  }

  render() {
    const { messages, user, activeChannel, addMessage } = this.props;

    if (!activeChannel) return null; // bail out, nothing here to see

    const {
      unseenMessages,
      followingMessages,
      followMessages,
      unfollowMessages,
    } = activeChannel;

    return (
      <Wrapper>
        <ChatHeader />
        <MessageList
          messages={messages}
          user={user || {}}
          unseenMessages={unseenMessages}
          followingMessages={followingMessages}
          followMessages={followMessages}
          unfollowMessages={unfollowMessages}
          key='message-list'
        />
        <MessageComposer
          user={user}
          addMessage={addMessage}
          key='message-composer'
        />
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

ActiveChat.propTypes = propTypes;

export default inject(({ store: { chat, user } }) => ({
  addMessage: chat.addMessage,
  messages: chat.getMessages(),
  activeChannel: chat.activeChannel,
  joinChannel: chat.joinChannel,
  user,
}))(observer(ActiveChat));
