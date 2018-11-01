import React, { Component } from 'react';
import PropTypes from 'prop-types';

import axios from '../../../axios';
import classes from './AddOrganizer.module.css';
import Spinner from '../../../components/UI/Spinner/Spinner';
import AddOrganizerForm from './AddOrganizerForm/AddOrganizerForm';
import { getLocalizedName, getAddressText } from '../../../util/organizerUtil';

class AddOrganizer extends Component {
  state = {
    organizations: [],
    numOfResults: 0,
    searchInput: '',
    organizationsMatchingSearch: [],
    selected: false,
    selectedOrganization: {
      address: '',
    },
  };

  componentDidMount() {
    document.title = 'Lisää järjestäjä - YKI Järjestäjärekisteri';
    axios
      .get(
        `/organisaatio-service/rest/organisaatio/v4/hae?searchStr=&aktiiviset=true&suunnitellut=true&lakkautetut=false`,
      )
      .then(res => {
        this.setState({ organizations: res.data.organisaatiot });
        // TODO: REMOVE
        this.selectOrganizationHandler(this.state.organizations[0]);
      })
      .catch(err => {
        console.error(`FETCHING ORGANIZATIONS FAILED: ${err}`);
      });
  }

  searchInputChangedHandler = event => {
    this.setState({
      numOfResults: 0,
      searchInput: event.target.value,
      organizationsMatchingSearch: [],
      selected: false,
      selectedOrganization: {},
    });
    this.findMatchingOrganizations(event.target.value);
  };

  findMatchingOrganizations = str => {
    const results = [];

    for (const key in this.state.organizations) {
      if (
        Object.values(this.state.organizations[key].nimi).find(name => {
          return name.toLowerCase().includes(str.toLowerCase());
        })
      ) {
        results.push(this.state.organizations[key]);
      }
    }

    this.setState({ numOfResults: results.length });
    if (results.length <= 50) {
      this.setState({ organizationsMatchingSearch: results });
    }
  };

  selectOrganizationHandler = org => {
    axios
      .post('/organisaatio-service/rest/organisaatio/v3/findbyoids', [org.oid])
      .then(res => {
        const organization = {
          ...org,
        };
        organization.address = getAddressText(res.data[0]);
        this.setState({
          selectedOrganization: organization,
          selected: true,
          searchInput: '',
        });
      })
      .catch(err => console.error(`Unable to retrieve address info: ${err}`));
  };

  addOrganizerHandler = values => {
    const body = {
      ...values,
      oid: this.state.selectedOrganization.oid,
    };
    axios
      .post('/yki/api/virkailija/organizer', body)
      .catch(err => {
        console.error(`ADD_ORGANIZER failed: ${err}`);
      })
      .then(() => {
        this.props.history.push('/jarjestajarekisteri/');
      });
  };

  addOrganizerCancelHandler = () => {
    this.setState({
      numOfResults: 0,
      searchInput: '',
      selected: false,
      selectedOrganization: {},
      organizationsMatchingSearch: [],
    });
    this.props.onCancel();
  };

  searchInfo = () => {
    let info = '';
    if (this.state.searchInput.length !== 0 && !this.state.selected) {
      info += `${this.state.numOfResults} ${
        this.state.numOfResults === 1 ? 'hakutulos' : 'hakutulosta'
      }`;
      if (this.state.numOfResults > 50) {
        info += '. Tarkenna hakua.';
      }
    }
    return info;
  };

  orgName = () => {
    return this.state.selected
      ? getLocalizedName(
          this.state.selectedOrganization.nimi,
          this.props.localization,
        )
      : '';
  };

  render() {
    const search = (
      <React.Fragment>
        {this.state.organizations.length === 0 ? (
          <Spinner />
        ) : (
          <div className={classes.Search}>
            <input
              autoFocus
              type="text"
              id="organizationSearchField"
              placeholder="Hae organisaation nimellä"
              value={this.state.searchInput}
              onChange={this.searchInputChangedHandler}
            />
            <label>{this.searchInfo()}</label>
          </div>
        )}
      </React.Fragment>
    );

    const searchResults = (
      <div className={classes.SearchResults}>
        <ul>
          {this.state.organizationsMatchingSearch.map(org => (
            <li
              key={org.oid}
              onClick={() => this.selectOrganizationHandler(org)}
            >
              {getLocalizedName(org.nimi, this.props.localization)}
            </li>
          ))}
        </ul>
      </div>
    );

    const form = (
      <div>
        {!this.state.selected ? (
          searchResults
        ) : (
          <AddOrganizerForm
            name={this.orgName()}
            address={this.state.selectedOrganization.address}
            onSubmit={this.addOrganizerHandler}
          />
        )}
      </div>
    );

    return (
      <div className={classes.AddOrganizer}>
        <h1>Lisää uusi kielitutkintojen järjestäjä</h1>
        <button
          aria-label="Close"
          className={classes.ModalClose}
          onClick={this.addOrganizerCancelHandler}
        />
        {search}
        {form}
      </div>
    );
  }
}

AddOrganizer.propTypes = {
  localization: PropTypes.string,
  history: PropTypes.object,
};

export default AddOrganizer;
