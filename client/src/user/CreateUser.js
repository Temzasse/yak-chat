import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { Redirect } from 'react-router-dom';

import media from 'react-components-kit/dist/media';

import CreateUserModal from './CreateUserModal';

const propTypes = {
  user: PropTypes.object,
  userFetched: PropTypes.bool.isRequired,
  setUser: PropTypes.func.isRequired,
};


const CreateUser = ({}) => (
  <CreateUserWrapper onSubmit={this.handleSubmit}>
    <CreateUserModal />
  </CreateUserWrapper>
);

const CreateUserWrapper = styled.form`
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

CreateUser.propTypes = propTypes;

export default inject(({ store }) => ({
  userFetched: store.userFetched,
  user: store.user,
  setUser: store.setUser,
}))(observer(CreateUser));
