import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import UsersIcon from 'react-icons/lib/md/supervisor-account';
import Gutter from 'react-components-kit/dist/Gutter';

const propTypes = {
  count: PropTypes.number.isRequired,
};

const ChannelUserCount = ({ count }) => (
  <Wrapper>
    <UsersIcon />
    <Gutter amount='8px' />
    {count}
  </Wrapper>
);

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 2px 6px;
  border-radius: 4px;
  background-color: ${props => props.theme.greyLighter};
  font-size: 14px;
`;

ChannelUserCount.propTypes = propTypes;

export default ChannelUserCount;
