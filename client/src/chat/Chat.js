import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import Layout from 'react-components-kit/dist/Layout';
import Gutter from 'react-components-kit/dist/Gutter';
import NewIcon from 'react-icons/lib/fa/plus';
import { Link, Route, withRouter } from 'react-router-dom';
import Modal from 'react-components-kit/dist/Modal';

import Sidebar from '../common/Sidebar';
import Navbar from '../common/Navbar';
import BlockButton from '../common/BlockButton';
import ActiveChat from './ActiveChat';
import CreateUser from '../user/CreateUser';
import JoinChannel from '../channel/JoinChannel';

class Chat extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    channels: PropTypes.array.isRequired,
    setActiveChannel: PropTypes.func.isRequired,
    activeChannel: PropTypes.object,
    user: PropTypes.object
  }

  state = {
    sidebarOpen: false,
    joinModalOpen: false,
  }

  componentWillMount() {
    // Automatically go to current active channel
    const { activeChannel } = this.props;

    if (activeChannel) {
      this.props.history.push(`/chat/${activeChannel.id}`);
    }
  }

  toggleSidebarOpen = () => {
    this.setState(prev => ({ sidebarOpen: !prev.sidebarOpen }));
  }

  openJoinModal = () => {
    this.setState({ joinModalOpen: true });
  }

  closeJoinModal = () => {
    if (this.props.activeChannel) this.setState({ joinModalOpen: false });
  }

  render() {
    const { sidebarOpen, joinModalOpen } = this.state;
    const { match, activeChannel, channels, user } = this.props;
    const noChannels = channels.length === 0;

    return (
      <Wrapper row>
        <Sidebar isOpen={sidebarOpen} toggleOpen={this.toggleSidebarOpen}>
          <BlockButton flat onClick={this.openJoinModal}>
            <NewIcon />
            {sidebarOpen && [
              <Gutter amount='8px' key='gutter' />,
              <span style={{ minWidth: 100 }} key='new-channel'>
                New channel
              </span>
            ]}
          </BlockButton>

          {channels.map(channel =>
            <Link to={`/chat/${channel.id}`} key={channel.id}>
              <ChannelButton
                active={activeChannel && channel.id === activeChannel.id}
                sidebarOpen={sidebarOpen}
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
                {!sidebarOpen && activeChannel &&
                channel.id === activeChannel.id &&
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

        <Modal visible={!user}>
          <CreateUser />
        </Modal>

        {/* NOTE:
          * We don't want to show JoinChannel modal if the user has any
          * channels persisted.
          *
          * Only if there is no active channel and no channels we should
          * force the modal to be visible.
          *
          * And don't show modal if user has not been created yet!
          */}
        {user &&
          <Modal
            visible={(noChannels && !activeChannel) || joinModalOpen}
            hide={this.closeJoinModal}
          >
            <JoinChannel onJoin={this.closeJoinModal} />
          </Modal>
        }
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
  ${props => props.sidebarOpen && 'border-width: 0px;'}
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

export default inject(({ store: { chat, user } }) => ({
  activeChannel: chat.activeChannel,
  channels: chat.getChannels(),
  setActiveChannel: chat.setActiveChannel,
  joinChannel: chat.joinChannel,
  user
}))(withRouter(observer(Chat)));
