import React, { Component } from 'react';

import classes from './Registration.module.css';
import Description from '../../components/Registration/Description/Description';

class Registration extends Component {
  descriptionClickHandler = () => {
    console.log('continue...');
  };

  render() {
    return (
      <React.Fragment>
        <header className={classes.Header}>Opetushallitus</header>
        <div className={classes.Registration}>
          <Description clicked={this.descriptionClickHandler} />
        </div>
      </React.Fragment>
    );
  }
}

export default Registration;
