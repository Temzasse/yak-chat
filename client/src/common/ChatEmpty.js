import React from 'react';
import styled from 'styled-components';
import chatting from '../assets/chatting.svg';
import media from 'react-components-kit/dist/media';

const ChatEmpty = () => (
  <Wrapper>
    <ChattingImg src={chatting} />
    <Instructions>
      Choose a channel from the sidebar to start yakking
    </Instructions>
  </Wrapper>
);

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  padding: 16px;
`;

const ChattingImg = styled.img`
  width: 300px;
  height: auto;

  ${media.tablet`
    width: 200px;
  `}
`;

const Instructions = styled.h3`
  font-size: 24px;
  color: ${props => props.theme.primaryColor};
  text-align: center;

  ${media.tablet`
    font-size: 20px;
  `}
`;

export default ChatEmpty;
