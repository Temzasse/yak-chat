import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';

import Chat from './chat/Chat';
import CreateUser from './user/CreateUser';

class App extends Component {
  componentWillMount() {
    this.props.fetchUser();
  }

  render() {
    const { userFound, userFetched } = this.props;
    console.debug('[this.props]', this.props);

    return (
      <AppWrapper>
        <Router>
          <div>
            <Route path='/create-user' component={CreateUser} />
            <Route path='/chat' component={Chat} />

            {userFetched && !userFound &&
              <Redirect to='/create-user' />
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
  userFetched: store.userFetched,
  userFound: store.userFound,
  fetchUser: store.fetchUser,
}))(AppView);
