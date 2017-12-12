import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { Redirect } from 'react-router-dom';

import Heading from 'react-components-kit/dist/Heading';
import Text from 'react-components-kit/dist/Text';
import TextField from 'react-components-kit/dist/TextField';
import Gutter from 'react-components-kit/dist/Gutter';
import Button from 'react-components-kit/dist/Button';
import Layout from 'react-components-kit/dist/Layout';
import media from 'react-components-kit/dist/media';

import logo from '../assets/logo.svg';

const propTypes = {
  user: PropTypes.object,
  userFetched: PropTypes.bool.isRequired,
  setUser: PropTypes.func.isRequired,
};

class CreateUser extends Component {
  state = {
    nickname: '',
    isValid: false,
  }

  validateNickname = nickname => {
    if (!!nickname && nickname.length < 20) {
      this.setState({ isValid: true });
      return true;
    }
    this.setState({ isValid: false });
    return false;
  }

  handleSubmit = event => {
    event.preventDefault();
    const { nickname } = this.state;

    if (nickname) {
      this.props.setUser({ nickname });
    }
  }

  render() {
    const { nickname, isValid } = this.state;

    return (
      <CreateUserWrapper onSubmit={this.handleSubmit}>
        <CreateUserCard column>
          <Logo src={logo} />

          <Heading style={{ textAlign: 'center' }}>
            Welcome to Yak Chat!
          </Heading>

          <Text size='18px' p>
            Before you get to yak at your friends
            we want to know what we should call you
          </Text>

          <Gutter vertical amount='32px' />

          <TextField
            name='nickname'
            label='What is your nickname?'
            onChange={({ target }) => this.setState({ nickname: target.value })}
            value={nickname}
            inputStyles={{ backgroundColor: '#fff' }}
            validationMessage='Your nickname should be under 20 characters'
            validator={this.validateNickname}
          />

          <Gutter vertical amount='32px' />

          <Layout justify='flex-end'>
            <Button flat type='submit' disabled={!isValid}>
              Start yakking!
            </Button>
          </Layout>
        </CreateUserCard>
      </CreateUserWrapper>
    );
  }
}

const CreateUserWrapper = styled.form`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.secondaryColorLightest};
`;

const Logo = styled.img`
  margin: 0 auto;
  width: 80px;
  height: 80px;
`;

const CreateUserCard = styled(Layout)`
  width: 100%;
  max-width: 500px;
  min-height: 400px;
  box-shadow: 0px 8px 20px rgba(0,0,0,0.1);
  border-radius: 8px;
  padding: 16px 24px;
  background-color: #fff;
`;

CreateUser.propTypes = propTypes;

export default inject(({ store }) => ({
  userFetched: store.userFetched,
  user: store.user,
  setUser: store.setUser,
}))(observer(CreateUser));
