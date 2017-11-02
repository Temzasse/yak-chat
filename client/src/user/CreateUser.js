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

import logo from '../assets/logo.svg';

const propTypes = {
  userFound: PropTypes.bool.isRequired,
  userFetched: PropTypes.bool.isRequired,
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

  render() {
    const { nickname, isValid } = this.state;
    const { userFound, userFetched } = this.props;

    return (
      <CreateUserWrapper>
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
            <Button type='submit' disabled={!isValid}>
              Get yakking!
            </Button>
          </Layout>
        </CreateUserCard>

        {userFetched && userFound &&
          <Redirect to='/' />
        }
      </CreateUserWrapper>
    );
  }
}

const CreateUserWrapper = styled.form`
  width: 100vw;
  height: 100vh;
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

const CreateUserView = observer(CreateUser);

export default inject(({ store }) => ({
  userFetched: store.userFetched,
  userFound: store.userFound,
}))(CreateUserView);
