import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Layout from 'react-components-kit/dist/Layout';
import Gutter from 'react-components-kit/dist/Gutter';
import NewIcon from 'react-icons/lib/fa/plus';
import { Link, Route } from 'react-router-dom';

import Sidebar from '../common/Sidebar';
import Navbar from '../common/Navbar';
import BlockButton from '../common/BlockButton';
import ActiveChat from './ActiveChat';

class Chat extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
  }

  state = {
    sidebarOpen: false,
  }

  toggleSidebarOpen = () => {
    this.setState(prev => ({ sidebarOpen: !prev.sidebarOpen }));
  }

  render() {
    const { sidebarOpen } = this.state;
    const { match } = this.props;

    return (
      <Wrapper row>
        <Sidebar isOpen={sidebarOpen} toggleOpen={this.toggleSidebarOpen}>
          <Link to='/join-channel'>
            <BlockButton flat>
              <NewIcon />
              <Gutter amount='8px' />
              New channel
            </BlockButton>
          </Link>
        </Sidebar>

        <Main column>
          <Navbar onMenuPress={this.toggleSidebarOpen} />
          <Route path={`${match.url}/:channelId`} component={ActiveChat} />
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

export default Chat;
