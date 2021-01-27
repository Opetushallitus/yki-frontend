import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import queryString from 'query-string';

import classes from './Registration.module.css';
import {LANGUAGES, MOBILE_VIEW} from '../../common/Constants';
import Filters from '../../components/Registration/Filters/Filters';
import ExamSessionList from '../../components/Registration/ExamSessionList/ExamSessionList';

import * as actions from '../../store/actions/index';

import HeadlineContainer from "../../components/HeadlineContainer/HeadlineContainer";
import YkiImage1 from '../../assets/images/ophYki_image1.png';
import {getObjectValuesCount} from "../../util/util";

class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      availabilityFilter: false,
      openRegistrationFilter: false
    }
  }

  componentDidMount() {
    const {language, level, location} = queryString.parse(
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
    if (this.props.examSessions.length === 0) {
      this.props.onFetchExamSessions();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // see if both checkboxes are checked to apply both filters
    const prev = prevState.availabilityFilter && prevState.openRegistrationFilter;
    const current = this.state.availabilityFilter && this.state.openRegistrationFilter;
    if (prev !== current) {
      return this.props.onFilterAvailableAndRegistration();
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

  onAvailabilityChange = () => {
    this.setState((prev) => ({
      ...prev,
      availabilityFilter: !this.state.availabilityFilter
    }));
    this.props.onAvailabilitySelect();
  }

  onRegistrationFilterChange = () => {
    this.setState((prev) => ({
      ...prev,
      openRegistrationFilter: !this.state.openRegistrationFilter
    }));
    this.props.onRegistrationSelect();
  }

  getValuesOnFilterChange = () => {
    if (this.state.availabilityFilter && this.state.openRegistrationFilter) {
      return this.props.filteredExamsByAvailabilityAndRegistration;
    }
    if (this.state.availabilityFilter) {
      return this.props.filteredExamSessionsByAvailability;
    }
    if (this.state.openRegistrationFilter) {
      return this.props.filteredExamSessionsByOpenRegistration;
    }
    else {
      return this.props.filteredExamSessionsGroupedByDate;
    }
  }

  render() {
    return (
        <>
          <HeadlineContainer
              headlineTitle={this.props.t('registration.title')}
              headlineContent={ <p>{this.props.t('registration.times.info')}</p> }
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
                  <strong>{`${getObjectValuesCount(this.getValuesOnFilterChange())}`}</strong>{' '}
                  {`${this.props.t('common.searchResults')}`}
                </p>
              </div>
            </div>
            {(MOBILE_VIEW || window.innerWidth < 1024) ? <div style={{paddingTop: '30px'}} /> : null}
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
    filteredExamSessionsGroupedByDate: state.registration.filteredExamSessionsGroupedByDate,
    language: state.registration.language,
    level: state.registration.level,
    location: state.registration.location,
    locations: state.registration.locations,
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
    onAvailabilitySelect: () => dispatch(actions.filterExamByAvailability()),
    onRegistrationSelect: () => dispatch(actions.filteredExamSessionsByOpenRegistration()),
    onFilterAvailableAndRegistration: () => dispatch(actions.filteredExamsByAvailabilityAndRegistration())
  };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslation()(Registration));
