import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import media from 'react-components-kit/dist/media';
import Text from 'react-components-kit/dist/Text';
import Gutter from 'react-components-kit/dist/Gutter';
import ShareIcon from 'react-icons/lib/fa/share-square-o';
import ChannelUserCount from '../channel/ChannelUserCount';

const propTypes = {
  activeChannel: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  onSharePress: PropTypes.func.isRequired,
};

const ChatHeader = ({ activeChannel, onSharePress }) => (
  <ChatHeaderWrapper>
    <Text size='18px' bold>
      {activeChannel ? activeChannel.id : ''}
    </Text>
    <Gutter />
    <ChannelUserCount count={activeChannel ? activeChannel.userCount : 0} />
    <Gutter />
    <Flex />
    <ShareIcon onClick={onSharePress} />
  </ChatHeaderWrapper>
);

const ChatHeaderWrapper = styled.div`
  height: 40px;
  background-color: #fff;
  border-bottom: 1px solid ${props => props.theme.greyLight};
  padding: 0px 16px;
  align-items: center;
  display: flex;

  ${media.tablet`
    display: none;
  `}
`;

const Flex = styled.div`
  flex: 1;
`;

ChatHeader.propTypes = propTypes;

export default inject(({ store }) => ({
  activeChannel: store.chat.activeChannel,
}))(observer(ChatHeader));
