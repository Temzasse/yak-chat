import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from 'react-components-kit/dist/Button';

const propTypes = {
  children: PropTypes.any,
};

/**
 * NOTE:
 * This is a tmp hack to get react-components-kit Button to fill the whole width
 * of it's container...
 */

const BlockButton = ({ children, ...rest }) => (
  <BlockButtonWrapper {...rest} wrapperStyles={{ width: '100%' }}>
    {children}
  </BlockButtonWrapper>
);

const BlockButtonWrapper = styled(Button)`
  width: 100%;
`;

BlockButton.propTypes = propTypes;

export default BlockButton;
