import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import media from 'react-components-kit/dist/media';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleOpen: PropTypes.func.isRequired,
  children: PropTypes.any,
};

const Sidebar = ({ isOpen, toggleOpen, children }) => (
  <div>
    <Menu isOpen={isOpen}>
      <Head>
        <CloseButton onClick={toggleOpen}>
          &times;
        </CloseButton>
      </Head>

      <Items>
        {children}
      </Items>
    </Menu>

    {isOpen &&
      <Backdrop onClick={toggleOpen} />
    }
  </div>
);

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Head = styled.div`
  justify-content: flex-end;
  padding: 4px;
  display: none;

  ${media.tablet`
    display: flex;
  `}
`;

const CloseButton = styled.button`
  background: transparent;
  border: 0;
  font-size: 24px;
  font-family: Arial, Helvetica, sans-serif;
  color: #fff;
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  animation: ${fadeIn} 0.4s;
  z-index: 99;
  display: none;

  ${media.tablet`
    display: block;
  `}
`;

const Items = styled.div`
  padding: 16px;

  ${media.tablet`
    padding: 24px 16px;
  `}
`;

const Menu = styled.div`
  width: 250px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.primaryColorDarker};

  ${media.tablet`
    width: 80%;
    z-index: 100;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    box-shadow: 0px 0px 12px rgba(0,0,0,0.5);
    opacity: ${props => props.isOpen ? 1 : 0};
    transform: translateX(${props => props.isOpen ? 0 : -100}%);
    transition: transform 0.4s cubic-bezier(0.2, 0.71, 0.14, 0.91);
  `}
`;

Sidebar.propTypes = propTypes;

export default Sidebar;
