import React from 'react';
import PropTypes from 'prop-types';
import { cn as makeBemClassName } from '@bem-react/classname';
import classNames from 'classnames';

const cn = makeBemClassName('Icon');

// Icons are stored in src/resources/icons

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
