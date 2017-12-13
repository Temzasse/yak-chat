import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import NavIcon from 'react-icons/lib/fa/align-left';
import media from 'react-components-kit/dist/media';
import Gutter from 'react-components-kit/dist/Gutter';
import Text from 'react-components-kit/dist/Text';
import Button from 'reac-components-kit/dist/Button';

const propTypes = {
  onMenuPress: PropTypes.func.isRequired,
  onSharePress: PropTypes.func.isRequired,
  activeChannel: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

const Navbar = ({ onMenuPress, activeChannel, onSharePress }) => (
  <NavbarWrapper>
    <NavIcon onClick={onMenuPress} />
    <Gutter />
    <Text bold>
      {activeChannel ? activeChannel.id : ''}
    </Text>
    <Button onClick={onSharePress}>
      Share
    </Button>
  </NavbarWrapper>
);

const NavbarWrapper = styled.div`
  height: 50px;
  background-color: #fff;
  border-bottom: 1px solid ${props => props.theme.greyLight};
  padding: 0px 16px;
  align-items: center;
  display: none;

  ${media.tablet`
    display: flex;
  `}
`;

Navbar.propTypes = propTypes;

export default inject(({ store }) => ({
  activeChannel: store.chat.activeChannel,
}))(observer(Navbar));
