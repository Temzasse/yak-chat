import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import media from 'react-components-kit/dist/media';
import Text from 'react-components-kit/dist/Text';

const propTypes = {
  activeChannel: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

const ChatHeader = ({ activeChannel }) => (
  <ChatHeaderWrapper>
    <Text size='18px' bold>
      {activeChannel ? activeChannel.id : ''}
    </Text>
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

ChatHeader.propTypes = propTypes;

export default inject(({ store }) => ({
  activeChannel: store.chat.activeChannel,
}))(observer(ChatHeader));
