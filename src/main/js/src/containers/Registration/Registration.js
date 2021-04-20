import queryString from 'query-string';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import YkiImage1 from '../../assets/images/ophYki_image1.png';
import { LANGUAGES, MOBILE_VIEW } from '../../common/Constants';
import HeadlineContainer from '../../components/HeadlineContainer/HeadlineContainer';
import ExamSessionList from '../../components/Registration/ExamSessionList/ExamSessionList';
import Filters from '../../components/Registration/Filters/Filters';
import * as actions from '../../store/actions/index';
import { getArraySize } from "../../util/util";
import classes from './Registration.module.css';

class Registration extends Component {
  componentDidMount() {
    const { language, level, location } = queryString.parse(
      this.props.history.location.search,
    );
    const lang = LANGUAGES.find(l => l.code === language);
    document.title = this.props.t('registration.document.title');
    const allQueryParamsExist = language && level && location;
    const paramsAreDifferent =
      (lang && this.props.language.name !== lang.name) ||
      this.props.level !== level ||
      this.props.location !== location;
    // if redux state is different from query params user has probably refreshed the page
    if (allQueryParamsExist !== undefined && paramsAreDifferent) {
      // set query params to redux state
      this.props.onSetAll(lang, level, location);
    }
    if (this.props.examSessions.length === 0 && !this.props.loading) {
      this.props.onFetchExamSessions();
    }
  }


  onLanguageChange = event => {
    const language = LANGUAGES.find(l => l.name === event.target.value);
    this.props.onSelectLanguage(language);
  };

  onLevelChange = event => {
    this.props.onSelectLevel(event.target.value);
  };

  onLocationChange = event => {
    this.props.onSelectLocation(event.target.value);
  };

  triggerFilters = (availability, open) => {
    if (availability && open) {
      this.props.onFilterAvailableAndRegistration();
    } else if (availability && !open) {
      this.props.onAvailabilitySelect();
    } else if (!availability && open) {
      this.props.onRegistrationSelect();
    } else {
      this.props.onClearFilters();
    }
  }

  onAvailabilityChange = () => {
    this.triggerFilters(!this.props.availabilityFilter, this.props.openRegistrationFilter);
    this.props.onToggleAvailabilityFilter(!this.props.availabilityFilter);
  }

  onRegistrationFilterChange = () => {
    this.triggerFilters(this.props.availabilityFilter, !this.props.openRegistrationFilter);
    this.props.onToggleOpenRegistrationFilter(!this.props.openRegistrationFilter);
  }

  getValuesOnFilterChange = () => {
    if (this.props.availabilityFilter && this.props.openRegistrationFilter) {
      return this.props.filteredExamsByAvailabilityAndRegistration;
    }
    if (this.props.availabilityFilter) {
      return this.props.filteredExamSessionsByAvailability;
    }
    if (this.props.openRegistrationFilter) {
      return this.props.filteredExamSessionsByOpenRegistration;
    } else {
      return this.props.filteredExamSessionsGroupedByDate;
    }
  };

  render() {
    return (
      <>
        <HeadlineContainer
          headlineTitle={this.props.t('registration.title')}
          headlineContent={<p>{this.props.t('registration.times.info')}</p>}
          headlineImage={YkiImage1}
        />
        <div className={classes.Content}>
          <div className={classes.FilterContainer}>
            <div className={classes.FilterSelectors}>
              <Filters
                language={this.props.language}
                onLanguageChange={this.onLanguageChange}
                level={this.props.level}
                onLevelChange={this.onLevelChange}
                location={this.props.location}
                onLocationChange={this.onLocationChange}
                locations={this.props.locations}
                history={this.props.history}
                onAvailabilityFilterChange={this.onAvailabilityChange}
                onRegistrationFilterChange={this.onRegistrationFilterChange}
              />
              <hr />
              <p>
                <strong>{`${getArraySize(this.getValuesOnFilterChange())}`}</strong>{' '}
                {`${this.props.t('common.searchResults')}`}
              </p>
            </div>
          </div>
          {MOBILE_VIEW || window.innerWidth < 1024 ? (
            <div style={{ paddingTop: '30px' }} />
          ) : null}
          <ExamSessionList
            examSessions={this.getValuesOnFilterChange()}
            language={this.props.language}
            history={this.props.history}
          />
        </div>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    examSessions: state.registration.examSessions,
    loading: state.registration.loading,
    filteredExamSessionsGroupedByDate: state.registration.filteredExamSessionsGroupedByDate,
    language: state.registration.language,
    level: state.registration.level,
    location: state.registration.location,
    locations: state.registration.locations,
    availabilityFilter: state.registration.availabilityFilter,
    openRegistrationFilter: state.registration.openRegistrationFilter,
    filteredExamSessionsByAvailability: state.registration.filteredExamSessionsByAvailability,
    filteredExamSessionsByOpenRegistration: state.registration.filteredExamSessionsByOpenRegistration,
    filteredExamsByAvailabilityAndRegistration: state.registration.filteredExamsByAvailabilityAndRegistration,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchExamSessions: () => dispatch(actions.fetchExamSessions()),
    onSelectLevel: level => dispatch(actions.selectLevel(level)),
    onSelectLanguage: language => dispatch(actions.selectLanguage(language)),
    onSelectLocation: location => dispatch(actions.selectLocation(location)),
    onSetAll: (language, level, location) =>
      dispatch(actions.setAll(language, level, location)),
    onToggleAvailabilityFilter: checked => dispatch(actions.toggleAvailabilityFilter(checked)),
    onToggleOpenRegistrationFilter: checked => dispatch(actions.toggleOpenRegistrationFilter(checked)),
    onClearFilters: () => dispatch(actions.filterByPathParams()),
    onAvailabilitySelect: () => dispatch(actions.filterExamByAvailability()),
    onRegistrationSelect: () =>
      dispatch(actions.filteredExamSessionsByOpenRegistration()),
    onFilterAvailableAndRegistration: () =>
      dispatch(actions.filteredExamsByAvailabilityAndRegistration()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(Registration));
