import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes, css } from 'styled-components';
import media from 'react-components-kit/dist/media';
import ToggleIcon from 'react-icons/lib/md/arrow-forward';

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

        <ToggleButton onClick={toggleOpen}>
          <ToggleIcon />
        </ToggleButton>
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

const SIDEBAR_W = 250;

const Head = styled.div`
  justify-content: flex-end;
`;

const ToggleButton = styled.div`
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  border-bottom: 1px solid ${props => props.theme.primaryColorDarkest};

  & > svg {
    height: 20px;
    width: 20px;
    transition: transform 0.2s ease;

    &:active {
      transform: scale(1.2);
    }
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: 0;
  font-size: 24px;
  font-family: Arial, Helvetica, sans-serif;
  color: #fff;
  display: none;

  ${media.tablet`
    display: block;
    margin-left: auto;
  `}
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
  padding: 12px;

  ${media.tablet`
    padding: 24px 16px;
  `}
`;

const Menu = styled.div`
  width: 70px;
  height: 100vh;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.primaryColorDarker};
  transition: width 0.3s ease;

  ${props => props.isOpen && css`
    width: ${SIDEBAR_W}px;

    ${ToggleButton} {
      transition: transform 0.3s ease;
      transform: rotate(180deg);
    }
  `}

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

    ${ToggleButton} {
      display: none;
    }
  `}
`;

Sidebar.propTypes = propTypes;

export default Sidebar;
