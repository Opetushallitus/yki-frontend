import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import axios from '../../../../axios';
import classes from './NewRegistryItem.module.css';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import RegistryItemForm from '../../../../components/RegistryItemForm/RegistryItemForm';
import {
  getLocalizedName,
  getCompleteAddress,
  sortArrayByName,
} from '../../../../util/registryUtil';
import * as actions from '../../../../store/actions/index';

class NewRegistryItem extends PureComponent {
  state = {
    numOfResults: 0,
    searchInput: '',
    organizationsMatchingSearch: [],
    selected: false,
    selectedOrganization: {
      address: '',
    },
  };

  searchInputChangedHandler = event => {
    this.setState({
      numOfResults: 0,
      searchInput: event.target.value,
      organizationsMatchingSearch: [],
      selected: false,
      selectedOrganization: {},
    });
    this.findOrganizationsMatchingSearch(event.target.value);
  };

  findOrganizationsMatchingSearch = str => {
    const results = [];
    for (const key in this.props.organizations) {
      if (
        Object.values(this.props.organizations[key].nimi).find(name => {
          return name.toLowerCase().includes(str.toLowerCase());
        })
      ) {
        results.push(this.props.organizations[key]);
      }
    }

    this.setState({ numOfResults: results.length });
    if (results.length <= 50) {
      sortArrayByName(results);
      this.setState({ organizationsMatchingSearch: results });
    }
  };

  selectOrganizationHandler = org => {
    axios
      .post('/organisaatio-service/rest/organisaatio/v3/findbyoids', [org.oid])
      .then(res => {
        const organization = {
          ...org,
          address: '',
        };
        organization.address = getCompleteAddress(res.data[0]);
        this.setState({
          selected: true,
          selectedOrganization: organization,
          searchInput: '',
        });
      })
      .catch(err => console.error(`Unable to retrieve address info: ${err}`));
  };

  newRegistryItemHandler = values => {
    const organizer = {
      ...values,
      oid: this.state.selectedOrganization.oid,
    };
    this.props.onAddRegistryItem(organizer);
    this.props.onClose();
  };

  render() {
    let info = '';
    if (this.state.searchInput.length !== 0 && !this.state.selected) {
      info += `${this.state.numOfResults} ${
        this.state.numOfResults === 1 ? 'hakutulos' : 'hakutulosta'
      }`;
      if (this.state.numOfResults > 50) {
        info += '. Tarkenna hakua.';
      }
    }
    const search = (
      <React.Fragment>
        {this.props.loading ? (
          <Spinner />
        ) : (
          <div className={classes.Search}>
            <input
              autoFocus
              type="search"
              id="organizationSearchField"
              placeholder="Hae organisaation nimellä"
              value={this.state.searchInput}
              onChange={this.searchInputChangedHandler}
            />
            <label>{info}</label>
          </div>
        )}
      </React.Fragment>
    );

    const searchResults = (
      <div className={classes.SearchResults}>
        {this.state.organizationsMatchingSearch.map(org => (
          <div
            key={org.oid}
            className={classes.SearchResult}
            onClick={() => this.selectOrganizationHandler(org)}
          >
            {getLocalizedName(org.nimi, this.props.localization)}
          </div>
        ))}
      </div>
    );

    const name =
      this.state.selected &&
      getLocalizedName(
        this.state.selectedOrganization.nimi,
        this.props.localization,
      );

    const form = (
      <div>
        {!this.state.selected ? (
          searchResults
        ) : (
          <RegistryItemForm
            name={name}
            address={this.state.selectedOrganization.address}
            onSubmit={this.newRegistryItemHandler}
          />
        )}
      </div>
    );

    return (
      <div className={classes.RegistryItem}>
        <h1>Lisää uusi kielitutkintojen järjestäjä</h1>
        {search}
        {form}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    organizations: state.registry.organizations,
    loading: state.registry.loadingOrganizations,
    localization: state.registry.localization,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAddRegistryItem: organizer =>
      dispatch(actions.addRegistryItem(organizer)),
  };
};

NewRegistryItem.propTypes = {
  history: PropTypes.object,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewRegistryItem);
