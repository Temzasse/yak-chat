import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { inject, observer, PropTypes as pt } from 'mobx-react';
import Layout from 'react-components-kit/dist/Layout';
import Gutter from 'react-components-kit/dist/Gutter';
import Spinner from 'react-components-kit/dist/Spinner';
import NewIcon from 'react-icons/lib/fa/plus';
import JoinIcon from 'react-icons/lib/fa/group';

import Sidebar from '../common/Sidebar';
import Navbar from '../common/Navbar';
import BlockButton from '../common/BlockButton';
import MessageComposer from './MessageComposer';
import MessageList from './MessageList';
import ChatHeader from './ChatHeader';

class Chat extends Component {
  static propTypes = {
    fetchMessages: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    addMessage: PropTypes.func.isRequired,
    messages: pt.observableArray.isRequired,
    unseenMessages: PropTypes.bool.isRequired,
    followingMessages: PropTypes.bool.isRequired,
    followMessages: PropTypes.func.isRequired,
    unfollowMessages: PropTypes.func.isRequired,
  }

  state = {
    sidebarOpen: false,
  }

  componentWillMount() {
    this.props.fetchMessages();
  }

  toggleSidebarOpen = () => {
    this.setState(prev => ({ sidebarOpen: !prev.sidebarOpen }));
  }

  render() {
    const { sidebarOpen } = this.state;
    const {
      messages,
      loading,
      user,
      unseenMessages,
      followingMessages,
    } = this.props;

    return (
      <Wrapper row>
        <Sidebar isOpen={sidebarOpen} toggleOpen={this.toggleSidebarOpen}>
          <BlockButton secondary flat>
            <JoinIcon />
            <Gutter amount='8px' />
            Join channel
          </BlockButton>

          <Gutter vertical />

          <BlockButton flat>
            <NewIcon />
            <Gutter amount='8px' />
            New channel
          </BlockButton>
        </Sidebar>

        <Main column>
          <Navbar onMenuPress={this.toggleSidebarOpen} />
          <ChatHeader />

          {loading ?
            <Loader>
              <Spinner md color='#ccc' />
            </Loader> :

            <MessageList
              messages={messages}
              user={user}
              unseenMessages={unseenMessages}
              followingMessages={followingMessages}
              followMessages={this.props.followMessages}
              unfollowMessages={this.props.unfollowMessages}
            />
          }

          <MessageComposer user={user} addMessage={this.props.addMessage} />
        </Main>
      </Wrapper>
    );
  }
}

const Wrapper = styled(Layout)`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

const Main = styled(Layout)`
  height: 100%;
  flex: 1;
`;

const Loader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
`;

export default inject(({ store: { chat, user } }) => ({
  fetchMessages: chat.fetchMessages,
  addMessage: chat.addMessage,
  messages: chat.messages,
  loading: chat.loading,
  unseenMessages: chat.unseenMessages,
  followingMessages: chat.followingMessages,
  followMessages: chat.followMessages,
  unfollowMessages: chat.unfollowMessages,
  user,
}))(observer(Chat));
