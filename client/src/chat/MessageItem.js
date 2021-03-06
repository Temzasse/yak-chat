import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { getAvatarGradient } from '../services/utils';

const propTypes = {
  content: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  isOwn: PropTypes.bool.isRequired,
};

const MessageItem = ({ content, time, nickname, id, isOwn }) => (
  <Wrapper isOwn={isOwn}>
    <Message>
      {!isOwn &&
        <Avatar bg={getAvatarGradient(id)}>
          {nickname.substring(0, 2)}
        </Avatar>
      }
      <Item>
        {!isOwn &&
          <Nickname>
            {nickname}
          </Nickname>
        }
        <Bubble>
          {content}
        </Bubble>
        <Time>
          {time}
        </Time>
      </Item>
    </Message>
  </Wrapper>
);

const Item = styled.div`
  display: flex;
  flex-direction: column;
`;

const Bubble = styled.div`
  border-radius: 8px;
  padding: 8px;
  font-size: 16px;
  color: #222;
  background-color: ${props => props.theme.greyLighter};
  max-width: 500px;
`;

const Wrapper = styled.div`
  display: flex;
  margin-bottom: 16px;

  ${Bubble} {
    align-self: flex-start;
  }

  ${props => props.isOwn && css`
    justify-content: flex-end;

    ${Item} {
      align-items: flex-end;
    }

    ${Bubble} {
      color: #fff;
      background-color: ${props.theme.primaryColorLight};
      align-self: flex-end;
    }
  `}
`;

const Time = styled.div`
  font-size: 12px;
  margin: 4px 8px 0px 8px;
  color: #888;
`;

const Nickname = styled.div`
  font-size: 12px;
  margin: 0px 8px 4px 8px;
  color: #888;
`;

// background-color: ${props => props.theme.secondaryColorLight};
const Avatar = styled.div`
  flex: none;
  border-radius: 50%;
  height: 32px;
  width: 32px;
  background: ${props => props.bg};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  text-transform: uppercase;
  margin-top: 20px;
  margin-right: 8px;
`;

const Message = styled.div`
  display: flex;
  flex-direction: row;
`;

MessageItem.propTypes = propTypes;

export default MessageItem;
