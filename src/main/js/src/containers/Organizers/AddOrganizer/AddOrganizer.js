import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import axios from '../../../axios';
import classes from './AddOrganizer.module.css';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Modal from '../../../components/UI/Modal/Modal';
import AddOrganizerForm from './AddOrganizerForm/AddOrganizerForm';
import { getLocalizedName } from '../../../util/organizerUtil';

class AddOrganizer extends Component {
  state = {
    organizations: [],
    searchInput: '',
    numOfResults: 0,
    organizationsMatchingSearch: [],
    selectedOrganization: {},
  };

  componentDidMount() {
    document.title = 'Lisää järjestäjä - YKI Järjestäjärekisteri';
    axios
      .get(
        `/organisaatio-service/rest/organisaatio/v4/hae?searchStr=&aktiiviset=true&suunnitellut=true&lakkautetut=false`,
      )
      .then(res => {
        this.setState({ organizations: res.data.organisaatiot });
      })
      .catch(err => {
        console.error(`FETCHING ORGANIZATIONS FAILED: ${err}`);
      });
  }

  searchInputChangedHandler = event => {
    this.setState({
      searchInput: event.target.value,
      numOfResults: 0,
      organizationsMatchingSearch: [],
    });
    this.findMatchingOrganizations(event.target.value);
  };

  selectOrganizationHandler = org => {
    this.setState({ selectedOrganization: org });
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
    this.setState({ selectedOrganization: {} });
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

  searchResultInfo = () => {
    if (this.state.searchInput.length !== 0) {
      const info =
        this.state.numOfResults === 1
          ? this.state.numOfResults + ' hakutulos'
          : this.state.numOfResults + ' hakutulosta';
      return this.state.numOfResults > 50 ? info + '. Tarkenna hakua.' : info;
    }
  };

  render() {
    const search = (
      <React.Fragment>
        <h1>Hae lisättävä järjestäjä</h1>
        {this.state.organizations.length === 0 ? (
          <Spinner />
        ) : (
          <input
            autoFocus
            type="text"
            id="organizationSearchField"
            className={classes.Searchbar}
            placeholder="Järjestäjän nimi"
            value={this.state.organizationSearchInput}
            onChange={this.searchInputChangedHandler}
          />
        )}
      </React.Fragment>
    );

    const searchResultInfo = (
      <p>
        {this.state.searchInput.length !== 0 ? this.searchResultInfo() : ''}
      </p>
    );

    const searchResults = (
      <ul className={classes.SearchResults}>
        {this.state.organizationsMatchingSearch.map(org => (
          <li key={org.oid} onClick={() => this.selectOrganizationHandler(org)}>
            {getLocalizedName(org.nimi)}
          </li>
        ))}
      </ul>
    );

    const orgName =
      Object.keys(this.state.selectedOrganization).length !== 0
        ? getLocalizedName(this.state.selectedOrganization.nimi)
        : '';

    const addOrganizerForm = (
      <Modal
        show={Object.keys(this.state.selectedOrganization).length !== 0}
        modalClosed={this.addOrganizerCancelHandler}
      >
        <AddOrganizerForm name={orgName} onSubmit={this.addOrganizerHandler} />
      </Modal>
    );

    return (
      <div className={classes.AddOrganizer}>
        {search}
        {searchResultInfo}
        {searchResults}
        {addOrganizerForm}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    lang: state.org.lang,
  };
};

AddOrganizer.propTypes = {
  lang: PropTypes.string,
  history: PropTypes.object,
};

export default connect(
  mapStateToProps,
  null,
)(AddOrganizer);
