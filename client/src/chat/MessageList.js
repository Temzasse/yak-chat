import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import format from 'date-fns/format';
import { observer, PropTypes as pt } from 'mobx-react';
import throttle from 'lodash.throttle';

import MessageItem from './MessageItem';
import UnseenMessages from './UnseenMessages';

class MessageList extends Component {
  static propTypes = {
    messages: pt.observableArrayOf(PropTypes.shape({
      timestamp: PropTypes.number.isRequired,
      content: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['message', 'file']).isRequired,
      sender: PropTypes.object.isRequired,
    })).isRequired,
    user: PropTypes.object.isRequired,
    unseenMessages: PropTypes.bool.isRequired,
    followingMessages: PropTypes.bool.isRequired,
  }

  /**
   * NOTE:
   * Mobx makes using componentWillReceiveProps impossible.
   * So we are forced to use componentWill/DidUpdate instead...
   */
  componentDidUpdate() {
    // Keep to user at the bottom if he is following the chat
    if (this.props.followingMessages) this.scrollToBottom();
  }

  handleFollowing = throttle(() => {
    const { scrollTop, scrollHeight, offsetHeight } = this.listNode;
    const fromBottom = Math.abs((scrollTop + offsetHeight) - scrollHeight);

    if (!this.props.followingMessages) {
      // If we are close to bottom of scroll container -> start to follow
      if (fromBottom < 100) {
        this.props.followMessages();
      }
    } else if (fromBottom > 100) {
      // Detach follow if user scrolls far enough from the bottom
      this.props.unfollowMessages();
    }
  }, 500)

  /**
   * Use intermideate handleScroll method to first persist the event and then
   * pass it throught to the actual (throttled) handler.
   */
  handleScroll = event => {
    event.persist();
    this.handleFollowing(event);
  }

  scrollToBottom = () => {
    this.listNode.scrollTop = this.listNode.scrollHeight;
  }

  render() {
    const { messages, user, unseenMessages, followingMessages } = this.props;

    return (
      <Wrapper
        innerRef={node => { this.listNode = node; }}
        onScroll={this.handleScroll}
        onWheel={this.handleScroll}
      >
        {messages.map(msg =>
          <MessageItem
            isOwn={msg.sender.id === user.id}
            time={format(new Date(msg.timestamp), 'HH.mm')}
            content={msg.content}
            nickname={msg.sender.nickname}
            key={`${msg.timestamp}-${msg.sender.id}`}
          />
        )}

        <UnseenMessages
          handlePress={this.scrollToBottom}
          show={unseenMessages && !followingMessages}
        />
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  padding: 16px 16px 0px 16px;
  overflow-y: scroll;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  position: relative;

  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
`;

export default observer(MessageList);
