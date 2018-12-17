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
import RegistryFilter from '../../components/RegistryFilter/RegistryFilter';
import { collectRegistryItemDetails } from '../../util/registryUtil';
import RegistryItem from './RegistryItem/RegistryItem';
import NewRegistryItem from './RegistryItem/NewRegistryItem/NewRegistryItem';
import UpdateRegistryItem from './RegistryItem/UpdateRegistryItem/UpdateRegistryItem';
import i18n from '../../common/i18n';

export class Registry extends Component {
  state = {
    showModal: false,
    updating: false,
    selectedItem: {},
    filtering: false,
    filtered: [],
  };

  componentDidMount = () => {
    document.title = i18n.t('registry.document.title');
    this.props.onFetchRegistryContent();
  };

  shouldComponentUpdate = (nextProps, nextState) =>
    nextProps.registry !== this.props.registry ||
    nextState.showModal !== this.state.showModal ||
    nextState.filtered !== this.state.filtered;

  openModalHandler = () => this.setState({ showModal: true });

  closeModalHandler = () =>
    this.setState({ showModal: false, updating: false });

  updateRegistryItemHandler = item =>
    this.setState({ showModal: true, updating: true, selectedItem: item });

  filterChangeHandler = (filtering, filtered) =>
    this.setState({ filtering: filtering, filtered: filtered });

  render() {
    const searchBar = (
      <div className={classes.Searchbar}>
<<<<<<< b4a3cc3abc8025e2375efc86f73553113c03641a
        <RegistryFilter
          registry={this.props.registry}
          onChange={(filtering, filtered) =>
            this.filterChangeHandler(filtering, filtered)
          }
        />
        <Button clicked={this.openModalHandler}>Lisää järjestäjä</Button>
=======
        <input
          type="search"
          placeholder={i18n.t('registry.search.placeholder')}
        />
        <Button clicked={this.openModalHandler}>
          {i18n.t('registryItem.button.add')}
        </Button>
>>>>>>> Initial version of i18n
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
          this.props.lang,
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
        Annetuilla hakuehdoilla ei löytynyt järjestäjiä.
      </p>
    ) : null;

    return (
      <div className={classes.Registry}>
        <h1>{i18n.t('common.exam.languages.registry')}</h1>
        {searchBar}
        {modal}
        {list}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    registry: state.registry.registry,
    loading: state.registry.loading,
    lang: state.localisation.lang,
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
  lang: PropTypes.string.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withErrorHandler(Registry, axios));
