import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { inject, observer, PropTypes as pt } from 'mobx-react';
import Spinner from 'react-components-kit/dist/Spinner';

import MessageComposer from './MessageComposer';
import MessageList from './MessageList';
import ChatHeader from './ChatHeader';

const propTypes = {
  loadingMessages: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  addMessage: PropTypes.func.isRequired,
  messages: pt.observableArray.isRequired,
  unseenMessages: PropTypes.bool.isRequired,
  followingMessages: PropTypes.bool.isRequired,
  followMessages: PropTypes.func.isRequired,
  unfollowMessages: PropTypes.func.isRequired,
};

const ActiveChat = ({
  messages,
  loadingMessages,
  user,
  unseenMessages,
  followingMessages,
  addMessage,
  followMessages,
  unfollowMessages,
}) => (
  <Wrapper>
    <ChatHeader />
    {loadingMessages ?
      <Loader>
        <Spinner md color='#ccc' />
      </Loader> :

      [
        <MessageList
          messages={messages}
          user={user}
          unseenMessages={unseenMessages}
          followingMessages={followingMessages}
          followMessages={followMessages}
          unfollowMessages={unfollowMessages}
          key='message-list'
        />,
        <MessageComposer
          user={user}
          addMessage={addMessage}
          key='message-composer'
        />
      ]
    }
  </Wrapper>
);

const Wrapper = styled.div`
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Loader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
`;

ActiveChat.propTypes = propTypes;

export default inject(({ store: { chat, user } }) => ({
  addMessage: chat.addMessage,
  messages: chat.getMessages(),
  loadingMessages: chat.activeChannel.loadingMessages,
  unseenMessages: chat.activeChannel.unseenMessages,
  followingMessages: chat.activeChannel.followingMessages,
  followMessages: chat.activeChannel.followMessages,
  unfollowMessages: chat.activeChannel.unfollowMessages,
  user,
}))(observer(ActiveChat));
