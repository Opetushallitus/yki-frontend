import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import RegistryFilter from '../../components/RegistryFilter/RegistryFilter';
import Button from '../../components/UI/Button/Button';
import Modal from '../../components/UI/Modal/Modal';
import Spinner from '../../components/UI/Spinner/Spinner';
import Page from '../../hoc/Page/Page';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import { collectRegistryItemDetails } from '../../util/registryUtil';
import classes from './Registry.module.css';
import NewRegistryItem from './RegistryItem/NewRegistryItem/NewRegistryItem';
import RegistryItem from './RegistryItem/RegistryItem';
import UpdateRegistryItem from './RegistryItem/UpdateRegistryItem/UpdateRegistryItem';

export class Registry extends Component {
  state = {
    showModal: false,
    updating: false,
    selectedItem: {},
    filtering: false,
    filtered: [],
  };

  componentDidMount = () => {
    document.title = this.props.t('registry.document.title');
    this.props.onFetchRegistryContent();
  };

  shouldComponentUpdate = (nextProps, nextState) =>
    nextProps.error !== this.props.error ||
    nextProps.registry !== this.props.registry ||
    nextState.showModal !== this.state.showModal ||
    nextState.filtered !== this.state.filtered;

  openModalHandler = () => this.setState({ showModal: true });

  closeModalHandler = () => {
    this.setState({ showModal: false, updating: false });
  };

  updateRegistryItemHandler = item =>
    this.setState({ showModal: true, updating: true, selectedItem: item });

  filterChangeHandler = (filtering, filtered) =>
    this.setState({ filtering: filtering, filtered: filtered });

  render() {
    const searchBar = (
      <div className={classes.Searchbar}>
        <RegistryFilter
          registry={this.props.registry}
          onChange={(filtering, filtered) =>
            this.filterChangeHandler(filtering, filtered)
          }
        />
        <Button clicked={this.openModalHandler}>
          {this.props.t('registryItem.button.add')}
        </Button>
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

    const items = this.state.filtering
      ? this.state.filtered
      : this.props.registry;

    const list = this.props.loading ? (
      <Spinner />
    ) : items.length ? (
      items.map((item, index) => {
        const registryItem = collectRegistryItemDetails(
          item.organizer,
          item.organization,
          this.props.i18n.lang,
        );
        return (
          <RegistryItem
            key={index}
            item={registryItem}
            update={() => this.updateRegistryItemHandler(registryItem)}
          />
        );
      })
    ) : this.state.filtering ? (
      <p className={classes.SearchResultsEmpty}>
        {this.props.t('registry.search.noResults')}
      </p>
    ) : null;

    return (
      <Page>
        <div className={classes.Registry}>
          <h1>{this.props.t('common.exam.languages.registry')}</h1>
          {searchBar}
          {modal}
          {list}
        </div>
      </Page>
    );
  }
}

const mapStateToProps = state => {
  return {
    registry: state.registry.registry,
    loading: state.registry.loading,
    error: state.registry.error,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchRegistryContent: () => dispatch(actions.fetchRegistryContent()),
    errorConfirmedHandler: () => dispatch(actions.registryFailReset()),
  };
};

Registry.propTypes = {
  onFetchRegistryContent: PropTypes.func.isRequired,
  registry: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  errorConfirmedHandler: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(withErrorHandler(Registry)));
