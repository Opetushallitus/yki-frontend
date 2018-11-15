import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import axios from '../../../../axios';
import classes from './AddOrganizer.module.css';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import AddOrganizerForm from '../../../../components/AddOrganizerForm/AddOrganizerForm';
import { LANGUAGES } from '../../../../common/Constants';
import { firstCharToUpper } from '../../../../util/util';
import {
  getLocalizedName,
  getAddressText,
} from '../../../../util/organizerUtil';

class AddOrganizer extends Component {
  state = {
    numOfResults: 0,
    searchInput: '',
    organizationsMatchingSearch: [],
    selected: false,
    selectedOrganization: {
      address: '',
    },
    languages: [],
  };

  componentDidMount() {
    document.title = 'Lisää järjestäjä - YKI Järjestäjärekisteri';
    const languages = [];
    for (const lang in LANGUAGES) {
      for (const level in LANGUAGES[lang].levels) {
        const lName =
          LANGUAGES[lang].name +
          ' / ' +
          firstCharToUpper(LANGUAGES[lang].levels[level]);
        languages.push({
          value: lName,
          label: lName,
          code: LANGUAGES[lang].code,
          level: LANGUAGES[lang].levels[level],
        });
      }
    }
    this.setState({ languages: languages });
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
        this.props.history.push('/jarjestajarekisteri');
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

  render() {
    const search = (
      <React.Fragment>
        {this.props.loading ? (
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

    const name = this.state.selected
      ? getLocalizedName(
          this.state.selectedOrganization.nimi,
          this.props.localization,
        )
      : '';

    const form = (
      <div>
        {!this.state.selected ? (
          searchResults
        ) : (
          <AddOrganizerForm
            name={name}
            address={this.state.selectedOrganization.address}
            languages={this.state.languages}
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

const mapStateToProps = state => {
  return {
    organizations: state.org.organizations,
    loading: state.org.loadingOrganizations,
    localization: state.org.localization,
  };
};

AddOrganizer.propTypes = {
  history: PropTypes.object,
};

export default connect(
  mapStateToProps,
  null,
)(AddOrganizer);
