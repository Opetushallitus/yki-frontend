import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';

import classes from './Collapsible.module.css';

const collapsible = props => {
  const { className, clicked, children, extendedClassName, show } = props;
  const { t } = useTranslation();

  return (
    <React.Fragment>
      {/* Button Element */}
      <div
        tabIndex={0}
        role="button"
        className={[classes.Header, className].join(' ')}
        onClick={clicked}
        onKeyPress={clicked}
        aria-label={show ? t('common.close') : t('common.open')}
      >
        {children[0]}
      </div>
      {/* Content */}
      <div
        className={`${extendedClassName} ${!show ? classes.HiddenContent : ''}`}
        aria-expanded={show}
      >
        {children[1]}
      </div>
    </React.Fragment>
  );
};

collapsible.propTypes = {
  className: PropTypes.string,
  clicked: PropTypes.func.isRequired,
  children: PropTypes.any,
  extendedClassName: PropTypes.string,
};

export default collapsible;
