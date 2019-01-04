import React, { Component } from 'react';

import classes from './Registration.module.css';
import ExamSessionList from './ExamSessionList/ExamSessionList';
import Description from '../../components/Registration/Description/Description';

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
        <header className={classes.Header}>Opetushallitus</header>
        <div className={classes.Registration}>
          {this.state.selecting ? (
            <ExamSessionList onReturn={this.onReturnHandler} />
          ) : (
            <Description clicked={this.descriptionClickHandler} />
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default Registration;
