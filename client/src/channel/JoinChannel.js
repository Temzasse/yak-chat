import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';

import Heading from 'react-components-kit/dist/Heading';
import Text from 'react-components-kit/dist/Text';
import TextField from 'react-components-kit/dist/TextField';
import Gutter from 'react-components-kit/dist/Gutter';
import Button from 'react-components-kit/dist/Button';
import Layout from 'react-components-kit/dist/Layout';
import Divider from 'react-components-kit/dist/Divider';
import media from 'react-components-kit/dist/media';

import logo from '../assets/logo.svg';

const propTypes = {
  joinChannel: PropTypes.func.isRequired,
  createChannel: PropTypes.func.isRequired,
  generatedChannelId: PropTypes.string,
};

class JoinChannel extends Component {
  state = {
    channelId: '',
  }

  createChannel = () => {
    const { generatedChannelId } = this.props;
    this.props.createChannel(generatedChannelId);
  }

  joinChannel = () => {
    const { channelId } = this.state;
    if (channelId) this.props.joinChannel(channelId);
  }

  render() {
    const { channelId } = this.state;
    const { generatedChannelId } = this.props;

    return (
      <JoinChannelWrapper>
        <JoinChannelCard column>
          <Logo src={logo} />

          <Heading h2 style={{ textAlign: 'center' }}>
            Join a channel
          </Heading>

          <TextField
            name='channelId'
            label='What is your channel name?'
            onChange={({ target }) => this.setState({ channelId: target.value })}
            value={channelId}
            inputStyles={{ backgroundColor: '#fff' }}
          />

          <Gutter vertical />

          <Layout justify='flex-end'>
            <Button
              flat
              secondary
              onClick={this.joinChannel}
              disabled={!channelId}
            >
              Join
            </Button>
          </Layout>

          <Divider amount='24px' />

          <Heading h2 style={{ textAlign: 'center', marginTop: 0 }}>
            Or create a new channel
          </Heading>

          <Text>
            Here is your pre-generated awesome channel name:
          </Text>

          <Gutter vertical />

          <ChannelName>
            {generatedChannelId}
          </ChannelName>

          <Gutter vertical amount='16px' />

          <Layout justify='flex-end'>
            <Button flat onClick={this.createChannel}>
              Create
            </Button>
          </Layout>
        </JoinChannelCard>
      </JoinChannelWrapper>
    );
  }
}

const JoinChannelWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.secondaryColorLightest};

  ${media.tablet`
    padding: 16px;
  `}
`;

const Logo = styled.img`
  margin: 0 auto;
  width: 80px;
  height: 80px;
`;

const JoinChannelCard = styled(Layout)`
  width: 100%;
  max-width: 500px;
  min-height: 400px;
  box-shadow: 0px 8px 20px rgba(0,0,0,0.1);
  border-radius: 8px;
  padding: 16px 24px;
  background-color: #fff;
`;

const ChannelName = styled.div`
  border: 1px dashed ${props => props.theme.secondaryColorLight};
  border-radius: 4px;
  padding: 12px 16px;
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.secondaryColor};
`;

JoinChannel.propTypes = propTypes;

export default inject(({ store }) => ({
  joinChannel: store.chat.joinChannel,
  createChannel: store.chat.createChannel,
  generatedChannelId: store.chat.generatedChannelId,
}))(observer(JoinChannel));
