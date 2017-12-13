import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import media from 'react-components-kit/dist/media';
import { inject, observer, PropTypes as pt } from 'mobx-react';

import MessageComposer from './MessageComposer';
import MessageList from './MessageList';
import ChatHeader from './ChatHeader';

class ActiveChat extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    addMessage: PropTypes.func.isRequired,
    joinChannel: PropTypes.func.isRequired,
    messages: pt.observableArray.isRequired,
    activeChannel: PropTypes.object.isRequired,
    onSharePress: PropTypes.func.isRequired
  };

  state = {
    showShareModal: false,
  };

  componentDidMount() {
    // Handle autojoining channel
    const { match: { params }, activeChannel } = this.props;
    const { channelId } = params;

    if (activeChannel !== channelId) {
      this.props.joinChannel(channelId);
    }
  }

  render() {
    const { messages, user, activeChannel, addMessage, onSharePress } = this.props;
    if (!activeChannel) return null; // bail out, nothing here to see

    const {
      unseenMessages,
      followingMessages,
      followMessages,
      unfollowMessages,
    } = activeChannel;

    return (
      <Wrapper>
        <ChatHeader onSharePress={onSharePress} />
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
          followMessages={followMessages}
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

  ${media.tablet`
    margin-bottom: 60px;
  `}
`;

export default inject(({ store: { chat, user } }) => ({
  addMessage: chat.addMessage,
  messages: chat.getMessages(),
  activeChannel: chat.activeChannel,
  joinChannel: chat.joinChannel,
  user,
}))(observer(ActiveChat));
