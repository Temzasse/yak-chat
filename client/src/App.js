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

let DevTools = null;

if (process.env.NODE_ENV !== 'production') {
  DevTools = require('mobx-react-devtools').default; // eslint-disable-line
}

class App extends Component {
  componentWillMount() {
    this.props.fetchUser();
    this.props.fetchChannels();
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
              <Route path='/chat' component={Chat} />
              <Route path='/create-user' component={CreateUser} />
              <Route path='/join-channel' component={JoinChannel} />

              {/* If we dont hit any above paths redirect to chat */}
              <Redirect to='/chat' />
            </Switch>

            {!user &&
              <Redirect to='/create-user' />
            }

            {user && !activeChannel &&
              <Redirect to='/join-channel' />
            }

            {user && activeChannel &&
              <Redirect to={`/chat/${activeChannel.id}`} />
            }
          </div>
        </Router>

        {DevTools && <DevTools />}
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
  fetchChannels: store.chat.fetchChannels
}))(AppView);
