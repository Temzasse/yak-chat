import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Layout from 'react-components-kit/dist/Layout';
import Gutter from 'react-components-kit/dist/Gutter';
import NewIcon from 'react-icons/lib/fa/plus';
import JoinIcon from 'react-icons/lib/fa/group';

import Sidebar from '../common/Sidebar';
import Navbar from '../common/Navbar';
import BlockButton from '../common/BlockButton';
import MessageComposer from './MessageComposer';
import MessageList from './MessageList';
import ChatHeader from './ChatHeader';

const propTypes = {
  something: PropTypes.any,
};

class Chat extends Component {
  state = {
    sidebarOpen: false,
  }

  toggleSidebarOpen = () => {
    this.setState(prev => ({ sidebarOpen: !prev.sidebarOpen }));
  }

  render() {
    const { sidebarOpen } = this.state;

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

          <Layout.Box flex='1'>
            <MessageList />
          </Layout.Box>

          <MessageComposer />
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

Chat.propTypes = propTypes;

export default Chat;
