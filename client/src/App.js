import React, { Component } from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import Chat from './chat/Chat';
import CreateUser from './user/CreateUser';
import JoinChannel from './channel/JoinChannel';

class App extends Component {
  componentWillMount() {
    this.props.fetchUser();
    this.props.fetchChannel();
  }

  render() {
    const { user, userFetched, activeChannel } = this.props;

    // Wait until the user has been fetched
    if (!userFetched) return null;

    return (
      <AppWrapper>
        <Router>
          <div>
            <Switch>
              <Route exact path='/' component={Chat} />
              <Route path='/create-user' component={CreateUser} />
              <Route path='/join-channel' component={JoinChannel} />
            </Switch>

            {!user &&
              <Redirect to='/create-user' />
            }

            {user && !activeChannel &&
              <Redirect to='/join-channel' />
            }
          </div>
        </Router>
      </AppWrapper>
    );
  }
}

const AppWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: #fff;
`;

const AppView = observer(App);

export default inject(({ store }) => ({
  user: store.user,
  userFetched: store.userFetched,
  fetchUser: store.fetchUser,
  activeChannel: store.chat.activeChannel,
  fetchChannel: store.chat.fetchChannel,
}))(AppView);
