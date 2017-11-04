import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

const propTypes = {
  content: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  isOwn: PropTypes.bool.isRequired,
};

const MessageItem = ({ content, time, isOwn }) => (
  <Wrapper isOwn={isOwn}>
    <Item>
      <Bubble>
        {content}
      </Bubble>
      <Time>
        {time}
      </Time>
    </Item>
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

  ${props => props.isOwn && css`
    justify-content: flex-end;

    ${Item} {
      align-items: flex-end;
    }

    ${Bubble} {
      color: #fff;
      background-color: ${props.theme.primaryColorLightest};
    }
  `}
`;

const Time = styled.div`
  font-size: 12px;
  margin-top: 4px;
  color: #888;
`;

MessageItem.propTypes = propTypes;

export default MessageItem;
