import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import classes from './OrganizerRegistry.module.css';
import Modal from '../../components/UI/Modal/Modal';
import AddOrganizer from '../Organizers/AddOrganizer/AddOrganizer';
import * as actions from '../../store/actions/index';
import Organizers from '../Organizers/Organizers';
import Button from '../../components/UI/Button/Button';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios';

class OrganizerRegistry extends Component {
  state = {
    showModal: false,
  };

  componentDidMount() {
    document.title = 'YKI - Järjestäjärekisteri';
    this.props.onFetchOrganizerRegistryContent();
  }

  addOrganizerHandler = () => {
    this.setState({ showModal: false });
    console.log('TODO: Make post to backend.');
  };

  toggleModalHandler = () => {
    this.setState(prevState => ({ showModal: !prevState.showModal }));
  };

  render() {
    return (
      <div className={classes.OrganizerRegistry}>
        <h1>Kielitutkintojen järjestäjärekisteri</h1>
        <div className={classes.Searchbar}>
          <input type="text" placeholder="Hae järjestäjää tai paikkakuntaa" />
          <Button clicked={this.toggleModalHandler}>Lisää järjestäjä</Button>
        </div>
        <Modal
          show={this.state.showModal}
          modalClosed={this.toggleModalHandler}
        >
          <AddOrganizer
            onSubmit={this.addOrganizerHandler}
            onCancel={this.toggleModalHandler}
          />
        </Modal>
        <div>
          <Organizers
            localization={this.props.localization}
            loading={this.props.loading}
            registry={this.props.organizerRegistry}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    organizerRegistry: state.org.organizerRegistry,
    loading: state.org.loading,
    localization: state.org.localization,
    error: state.org.error,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchOrganizerRegistryContent: () =>
      dispatch(actions.fetchOrganizerRegistryContent()),
  };
};

OrganizerRegistry.propTypes = {
  onFetchOrganizerRegistryContent: PropTypes.func.isRequired,
  organizerRegistry: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  localization: PropTypes.string.isRequired,
  history: PropTypes.object,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withErrorHandler(OrganizerRegistry, axios));
