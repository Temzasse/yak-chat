import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import Layout from 'react-components-kit/dist/Layout';
import Gutter from 'react-components-kit/dist/Gutter';
import NewIcon from 'react-icons/lib/fa/plus';
import { Link, Route, Redirect } from 'react-router-dom';

import Sidebar from '../common/Sidebar';
import Navbar from '../common/Navbar';
import BlockButton from '../common/BlockButton';
import ActiveChat from './ActiveChat';

class Chat extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    channels: PropTypes.array.isRequired,
    setActiveChannel: PropTypes.func.isRequired,
    activeChannel: PropTypes.object,
  }

  state = {
    sidebarOpen: false,
  }

  toggleSidebarOpen = () => {
    this.setState(prev => ({ sidebarOpen: !prev.sidebarOpen }));
  }

  render() {
    const { sidebarOpen } = this.state;
    const { match, activeChannel, channels } = this.props;

    if (!activeChannel) {
      return (
        <Redirect to='/join-channel' />
      );
    }

    return (
      <Wrapper row>
        <Sidebar isOpen={sidebarOpen} toggleOpen={this.toggleSidebarOpen}>
          <Link to='/join-channel'>
            <BlockButton flat>
              <NewIcon />
              {sidebarOpen && [
                <Gutter amount='8px' key='gutter' />,
                <span style={{ minWidth: 100 }} key='new-channel'>
                  New channel
                </span>
              ]}
            </BlockButton>
          </Link>

          {channels.map(channel =>
            <Link to={`/chat/${channel.id}`} key={channel.id}>
              <ChannelButton
                active={channel.id === activeChannel.id}
                onClick={() => this.props.setActiveChannel(channel.id)}
              >
                {sidebarOpen ?
                  <span style={{ minWidth: 200 }}>
                    {channel.id}
                  </span> :
                  <span>
                    {channel.id.substring(0, 3)}
                  </span>
                }
                {!sidebarOpen && channel.id === activeChannel.id &&
                  <ChannelActiveIndicator />
                }
              </ChannelButton>
            </Link>
          )}
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

const ChannelButton = styled.button`
  border-radius: 4px;
  padding: 8px;
  text-align: center;
  margin-top: 16px;
  width: 100%;
  outline: none;
  background-color: transparent;
  text-transform: uppercase;
  position: relative;
  border: 1px solid ${props => props.active
    ? props.theme.secondaryColorLight
    : props.theme.primaryColorLightest};
  color: ${props => props.active
    ? props.theme.secondaryColorLight
    : props.theme.primaryColorLightest};

  &:hover {
    color: #fff;
    cursor: pointer;
    background-color: ${props => props.active
    ? props.theme.secondaryColorLight
    : props.theme.primaryColorLightest};
  }
`;

const ChannelActiveIndicator = styled.div`
  position: absolute;
  left: -19px;
  top: 50%;
  width: 10px;
  height: 10px;
  background-color: ${props => props.theme.secondaryColorLighter};
  border-radius: 12px;
  transform: translateY(-50%);
`;

export default inject(({ store: { chat } }) => ({
  activeChannel: chat.activeChannel,
  channels: chat.getChannels(),
  setActiveChannel: chat.setActiveChannel,
}))(observer(Chat));
