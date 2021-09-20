import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

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
import * as i18nKeys from "../../../../common/LocalizationKeys";

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
        this.state.numOfResults === 1
          ? this.props.t(i18nKeys.common_searchResult)
          : this.props.t(i18nKeys.common_searchResults)
      }`;
      if (this.state.numOfResults > 50) {
        info += this.props.t(i18nKeys.common_searchTooManyResults);
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
              autoComplete="off"
              id="organizationSearchField"
              placeholder={this.props.t(i18nKeys.registryItem_search_placeholder)}
              value={this.state.searchInput}
              onChange={this.searchInputChangedHandler}
            />
            <label>{info}</label>
          </div>
        )}
      </React.Fragment>
    );

    const orgTypes = {
      organisaatiotyyppi_01: this.props.t(i18nKeys.registry_search_orgType01),
      organisaatiotyyppi_02: this.props.t(i18nKeys.registry_search_orgType02),
      organisaatiotyyppi_05: this.props.t(i18nKeys.registry_search_orgType05),
    };
    const searchResults = (
      <div className={classes.SearchResults}>
        {this.state.organizationsMatchingSearch.map(org => (
          <div
            key={org.oid}
            data-cy={org.oppilaitosKoodi}
            className={classes.SearchResult}
            onClick={() => this.selectOrganizationHandler(org)}
          >
            {getLocalizedName(org.nimi, this.props.i18n.lang)}
            <span className={classes.OrgType}>
              ({orgTypes[org.organisaatiotyypit[0]]})
            </span>
          </div>
        ))}
      </div>
    );

    const name =
      this.state.selected &&
      getLocalizedName(
        this.state.selectedOrganization.nimi,
        this.props.i18n.lang,
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
        <h1>{this.props.t(i18nKeys.registryItem_add_header)}</h1>
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
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAddRegistryItem: organizer =>
      dispatch(actions.addRegistryItem(organizer)),
  };
};

NewRegistryItem.propTypes = {
  organizations: PropTypes.array.isRequired,
  onAddRegistryItem: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(NewRegistryItem));
