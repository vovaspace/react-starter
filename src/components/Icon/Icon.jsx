import React from 'react';
import PropTypes from 'prop-types';
import { cn as makeBemClassName } from '@bem-react/classname';
import classNames from 'classnames';


// Icons are stored in src/resources/icons

// Load resources
const iconFiels = require.context('../../resources/icons', true, /.*\.svg$/);
iconFiels.keys().forEach(iconFiels);


const cn = makeBemClassName('Icon');

export default function Icon({ icon, className }) {
  const componentClass = classNames(cn(), className);

  return (
    <svg className={componentClass}>
      <use xlinkHref={`#icon-${icon}`} />
    </svg>
  );
}

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  className: PropTypes.string
};

Icon.defaultProps = {
  className: ''
};
