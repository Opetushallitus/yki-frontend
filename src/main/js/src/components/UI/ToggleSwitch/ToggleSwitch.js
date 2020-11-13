import React from 'react';
import PropTypes from 'prop-types';

import classes from './ToggleSwitch.module.css';

const ToggleSwitch = (props) => {
    const {ariaLabel, onChange} = props;

    return (
        <label className={classes.Switch}>
            <input type="checkbox" onChange={onChange} aria-label={ariaLabel || null} />
            <span className={classes.RoundSlider} />
        </label>
    );
}

ToggleSwitch.propTypes = {
    onChange: PropTypes.func.isRequired,
    ariaLabel: PropTypes.string,
};

export default ToggleSwitch;