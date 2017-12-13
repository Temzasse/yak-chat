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
import config from './config';

let DevTools = null;

if (config.IS_PROD) {
  DevTools = require('mobx-react-devtools').default; // eslint-disable-line
}

class App extends Component {
  componentWillMount() {
    this.props.fetchUser();
    this.props.fetchChannels();
  }

  render() {
    const { userFetched } = this.props;

    // Wait until the user has been fetched
    if (!userFetched) return null;

    return (
      <AppWrapper>
        <Router>
          <div>
            <Switch>
              <Route path='/chat' component={Chat} />
              {/* If we dont hit any above paths redirect to chat */}
              <Redirect to='/chat' />
            </Switch>
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
