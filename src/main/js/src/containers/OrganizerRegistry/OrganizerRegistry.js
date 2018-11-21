import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import classes from './OrganizerRegistry.module.css';
import Spinner from '../../components/UI/Spinner/Spinner';
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
    this.props.onFetchRegistryContent();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.registry !== this.props.registry ||
      nextState.showModal !== this.state.showModal
    );
  }

  toggleModalHandler = () => {
    this.setState(prevState => ({ showModal: !prevState.showModal }));
  };

  render() {
    const searchBar = (
      <div className={classes.Searchbar}>
        <input type="search" placeholder="Hae järjestäjää tai paikkakuntaa" />
        <Button clicked={this.toggleModalHandler}>Lisää järjestäjä</Button>
      </div>
    );

    const addOrganizerModal = (
      <Modal show={this.state.showModal} modalClosed={this.toggleModalHandler}>
        <AddOrganizer onExit={this.toggleModalHandler} />
      </Modal>
    );

    const organizerList = this.state.loading ? (
      <Spinner />
    ) : (
      this.props.registry.map((org, i) => {
        const organizer = filterOrganizerInfo(
          org.organizer,
          org.organization,
          this.props.localization,
        );
        return <Organizer key={i} organizer={organizer} />;
      })
    );

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
    registry: state.registry.registry,
    loading: state.registry.loading,
    localization: state.registry.localization,
    error: state.registry.error,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchRegistryContent: () => dispatch(actions.fetchRegistryContent()),
  };
};

OrganizerRegistry.propTypes = {
  registry: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  localization: PropTypes.string.isRequired,
  history: PropTypes.object,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withErrorHandler(OrganizerRegistry, axios));
