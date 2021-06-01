import PropTypes from 'prop-types';
import React from 'react';

import Header from '../../components/Header/Header';
import classes from './Page.module.css';

const page = props => (
  <React.Fragment>
    <Header nav />
    <main id="main" className={classes.Content}>
      {props.children}
    </main>
  </React.Fragment>
);

page.propTypes = {
  children: PropTypes.any.isRequired,
};

export default page;
