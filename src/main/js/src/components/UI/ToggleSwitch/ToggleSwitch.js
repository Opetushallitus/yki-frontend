import React from 'react';
import PropTypes from 'prop-types';

import classes from './ToggleSwitch.module.css';

const ToggleSwitch = (props) => {
    const { dataCy, ariaLabel, checked, onChange } = props;

    return (
        <label className={classes.Switch}>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                aria-label={ariaLabel || null} />
            <span data-cy={dataCy} className={classes.RoundSlider} />
        </label>
    );
}

ToggleSwitch.propTypes = {
    dataCy: PropTypes.string,
    ariaLabel: PropTypes.string,
    checked: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
};

export default ToggleSwitch;