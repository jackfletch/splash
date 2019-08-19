import React from 'react';
import PropTypes from 'prop-types';

const GradientWrapper = props => {
  const {children, colorData, gradientId, ...otherProps} = props;
  const childProps = {...otherProps, ...children.props};

  return (
    <g>
      <defs>
        <linearGradient id={gradientId}>
          {colorData.map(d => (
            <stop
              key={d.offset.toString()}
              offset={d.offset}
              stopColor={d.stopColor}
            />
          ))}
        </linearGradient>
      </defs>
      {React.cloneElement(children, childProps)}
    </g>
  );
};

GradientWrapper.propTypes = {
  children: PropTypes.object.isRequired,
  colorData: PropTypes.arrayOf(
    PropTypes.shape({
      offset: PropTypes.string.isRequired,
      stopColor: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  gradientId: PropTypes.string.isRequired,
};

export default GradientWrapper;
