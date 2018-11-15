import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import classes from './OrganizerRegistry.module.css';
import Modal from '../../components/UI/Modal/Modal';
import AddOrganizer from './Organizer/AddOrganizer/AddOrganizer';
import * as actions from '../../store/actions/index';
import Button from '../../components/UI/Button/Button';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios';
import { filterOrganizerInfo } from '../../util/organizerUtil';
import Organizer from './Organizer/Organizer';

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
    const searchBar = (
      <div className={classes.Searchbar}>
        <input type="text" placeholder="Hae järjestäjää tai paikkakuntaa" />
        <Button clicked={this.toggleModalHandler}>Lisää järjestäjä</Button>
      </div>
    );

    const addOrganizerModal = (
      <Modal show={this.state.showModal} modalClosed={this.toggleModalHandler}>
        <AddOrganizer
          onSubmit={this.addOrganizerHandler}
          onCancel={this.toggleModalHandler}
        />
      </Modal>
    );

    const organizerList = this.props.registry.map((org, i) => {
      const organizer = filterOrganizerInfo(
        org.organizer,
        org.organization,
        this.props.localization,
      );
      return <Organizer key={i} organizer={organizer} />;
    });

    return (
      <div className={classes.OrganizerRegistry}>
        <h1>Kielitutkintojen järjestäjärekisteri</h1>
        {searchBar}
        {addOrganizerModal}
        {organizerList}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    registry: state.org.organizerRegistry,
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
  registry: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  localization: PropTypes.string.isRequired,
  history: PropTypes.object,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withErrorHandler(OrganizerRegistry, axios));
