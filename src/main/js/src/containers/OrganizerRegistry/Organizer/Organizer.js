import React, { Component } from 'react';

import classes from './Organizer.module.css';
import Collapsible from '../../../components/UI/Collapsible/Collapsible';
import OrganizerDetails from '../../../components/OrganizerDetails/OrganizerDetails';

class Organizer extends Component {
  state = {
    show: false,
    agreementExpired: false,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.show !== this.state.show;
  }

  toggleHandler = () => {
    this.setState(prevState => ({
      show: !prevState.show,
    }));
  };

  render() {
    console.log(this.props.organizer);

    const languages = this.props.organizer.languages
      .map(lang => {
        return lang.split(' ')[0].toLowerCase();
      })
      .join(', ');

    return (
      <div
        className={
          this.state.show ? classes.OrganizerWithDetails : classes.Organizer
        }
      >
        <Collapsible
          show={this.state.show}
          clicked={this.toggleHandler}
          className={classes.Collapsible}
        >
          <div className={classes.HeaderText}>
            <div>
              <strong>{this.props.organizer.name}</strong>
            </div>
            <div>{languages}</div>
            <div className={classes.HeaderCity}>
              {this.props.organizer.address.city}
            </div>
          </div>
          <OrganizerDetails organizer={this.props.organizer} />
        </Collapsible>
      </div>
    );
  }
}

export default Organizer;
