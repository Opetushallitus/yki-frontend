import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import classes from './Registry.module.css';
import Spinner from '../../components/UI/Spinner/Spinner';
import Modal from '../../components/UI/Modal/Modal';
import Button from '../../components/UI/Button/Button';
import * as actions from '../../store/actions/index';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios';
import { collectRegistryItemDetails } from '../../util/registryUtil';
import RegistryItem from './RegistryItem/RegistryItem';
import NewRegistryItem from './RegistryItem/NewRegistryItem/NewRegistryItem';
import UpdateRegistryItem from './RegistryItem/UpdateRegistryItem/UpdateRegistryItem';

export class Registry extends Component {
  state = {
    showModal: false,
    updating: false,
    selectedItem: {},
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

  openModalHandler = () => {
    this.setState({ showModal: true });
  };

  closeModalHandler = () => {
    this.setState({ showModal: false, updating: false });
  };

  updateRegistryItemHandler = item => {
    this.setState({ showModal: true, updating: true, selectedItem: item });
  };

  render() {
    const searchBar = (
      <div className={classes.Searchbar}>
        <input type="search" placeholder="Hae järjestäjää tai paikkakuntaa" />
        <Button clicked={this.openModalHandler}>Lisää järjestäjä</Button>
      </div>
    );

    const modal = (
      <React.Fragment>
        {this.state.showModal ? (
          <Modal
            show={this.state.showModal}
            modalClosed={this.closeModalHandler}
          >
            {this.state.updating ? (
              <UpdateRegistryItem
                item={this.state.selectedItem}
                onClose={this.closeModalHandler}
              />
            ) : (
              <NewRegistryItem onClose={this.closeModalHandler} />
            )}
          </Modal>
        ) : null}
      </React.Fragment>
    );

    const registry = this.props.loading ? (
      <Spinner />
    ) : (
      this.props.registry.map((item, index) => {
        const registryItem = collectRegistryItemDetails(
          item.organizer,
          item.organization,
          this.props.localization,
        );
        return (
          <RegistryItem
            key={index}
            item={registryItem}
            update={() => this.updateRegistryItemHandler(registryItem)}
          />
        );
      })
    );

    return (
      <div className={classes.Registry}>
        <h1>Kielitutkintojen järjestäjärekisteri</h1>
        {searchBar}
        {modal}
        {registry}
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

Registry.propTypes = {
  onFetchRegistryContent: PropTypes.func.isRequired,
  registry: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  localization: PropTypes.string.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withErrorHandler(Registry, axios));
