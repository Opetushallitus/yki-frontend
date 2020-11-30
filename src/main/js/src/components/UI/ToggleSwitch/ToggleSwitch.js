import React from 'react';
import PropTypes from 'prop-types';

import classes from './ToggleSwitch.module.css';

const ToggleSwitch = (props) => {
    const {ariaLabel, checked, onChange} = props;

    return (
        <label className={classes.Switch}>
            <input type="checkbox" checked={checked} onChange={onChange} aria-label={ariaLabel || null} />
            <span className={classes.RoundSlider} />
        </label>
    );
}

ToggleSwitch.propTypes = {
    ariaLabel: PropTypes.string,
    checked: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
};

export default ToggleSwitch;