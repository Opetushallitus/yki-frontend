import React, { Component } from 'react';

import classes from './Registration.module.css';
import Logo from '../../components/UI/Logo/Logo';

class Registration extends Component {
  state = {
    selecting: false,
  };

  onReturnHandler = () => {
    this.setState({ selecting: false });
  };

  descriptionClickHandler = () => {
    this.setState({ selecting: true });
  };

  render() {
    return (
      <React.Fragment>
        <header className={classes.Header}>
          <Logo />
          Opetushallitus
        </header>
        <div className={classes.Registration}>
          {this.state.selecting ? (
            <ExamSessionSelection onReturn={this.onReturnHandler} />
          ) : (
            <Description clicked={this.descriptionClickHandler} />
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default Registration;
