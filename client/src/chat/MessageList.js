import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import format from 'date-fns/format';
import { observer, PropTypes as pt } from 'mobx-react';
import MessageItem from './MessageItem';

const propTypes = {
  messages: pt.observableArrayOf(PropTypes.shape({
    timestamp: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['message', 'file']).isRequired,
    sender: PropTypes.object.isRequired,
  })).isRequired,
};

class MessageList extends Component {
  /**
   * NOTE:
   * Mobx makes using componentWillReceiveProps impossible.
   * So we are forced to use componentWill/DidUpdate instead...
   */
  componentDidUpdate(nextProps) {
    if (nextProps.messages.length > 0) {
      // New message arrived.. I guess...
      const { messages } = nextProps;
      const { user } = this.props;
      const newest = messages[messages.length - 1];

      // Users own message --> scroll to bottom
      if (newest.sender.id === user.id) {
        this.listNode.scrollTop = this.listNode.scrollHeight;
      }
    }
  }

  render() {
    const { messages, user } = this.props;

    return (
      <Wrapper innerRef={node => { this.listNode = node; }}>
        {messages.map(msg =>
          <MessageItem
            isOwn={msg.sender.id === user.id}
            time={format(new Date(msg.timestamp), 'HH.mm')}
            content={msg.content}
            key={`${msg.timestamp}-${msg.sender.id}`}
          />
        )}
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  padding: 16px;
  overflow-y: scroll;
  overflow-x: hidden;
`;

MessageList.propTypes = propTypes;

export default observer(MessageList);
