import * as actionTypes from './actionTypes';
import axios from '../../axios';
import moment from 'moment';
import * as R from 'ramda';

import { ISO_DATE_FORMAT_SHORT } from '../../common/Constants';
import { capitalize } from '../../util/util';

export const fetchExamSessions = () => {
  return dispatch => {
    dispatch(fetchExamSessionsStart());
    const today = moment().format(ISO_DATE_FORMAT_SHORT);
    axios
      .get(`/yki/api/exam-session?from=${today}`)
      .then(res => {
        dispatch(extractExamLocations(res.data.exam_sessions));
        dispatch(fetchExamSessionsSuccess(res.data.exam_sessions));
        dispatch(filterAndGroupByDate());
      })
      .catch(err => {
        dispatch(fetchExamSessionsFail(err));
      });
  };
};
const locationByLang = (examSession, lang) => {
  const language = examSession.location.find(l => l.lang === lang)
  return language && language.post_office ? capitalize(language.post_office) : null;
};

const extractExamLocations = examSessions => {
  const getUniqueLocations = (locations, examSession) => {
    const location = { fi: locationByLang(examSession, 'fi'), sv: locationByLang(examSession, 'sv') };
    return R.includes(location, locations) ? locations : R.append(location, locations);
  };

  const unique = R.reduce(getUniqueLocations, []);
  const sortByFi = R.sort(R.prop('fi'));
  return {
    type: actionTypes.ADD_EXAM_LOCATIONS,
    locations: R.compose(sortByFi, unique)(examSessions),
  };
};

const filterAndGroupByDate = () => {
  return {
    type: actionTypes.FILTER_AND_GROUP_BY_DATE,
  };
};

const filterByAvailability = () => {
  return {
    type: actionTypes.FILTER_BY_AVAILABILITY
  }
}

export const filterExamByAvailability = () => {
  return dispatch => {
    dispatch(filterByAvailability())
  }
}

const filterOpenRegistration = () => {
  return {
    type: actionTypes.FILTER_BY_OPEN_REGISTRATION
  }
}

export const filteredExamSessionsByOpenRegistration = () => {
  return dispatch => {
    dispatch(filterOpenRegistration())
  }
}

const filterAvailabilityAndRegistration = () => {
  return {
    type: actionTypes.FILTER_BY_AVAILABILITY_AND_REGISTRATION
  }
}

export const filteredExamsByAvailabilityAndRegistration = () => {
  return dispatch => {
    dispatch(filterAvailabilityAndRegistration())
  }
}

const fetchExamSessionsStart = () => {
  return {
    type: actionTypes.FETCH_EXAM_SESSIONS_START,
  };
};

const fetchExamSessionsSuccess = examSessions => {
  return {
    type: actionTypes.FETCH_EXAM_SESSIONS_SUCCESS,
    examSessions: examSessions,
  };
};

const fetchExamSessionsFail = error => {
  return {
    type: actionTypes.FETCH_EXAM_SESSIONS_FAIL,
    error: error,
  };
};

export const selectLanguage = language => {
  return dispatch => {
    dispatch(setLanguage(language));
    dispatch(filterAndGroupByDate());
  };
};

const setLanguage = language => {
  return {
    type: actionTypes.SELECT_LANGUAGE,
    language: language,
  };
};

export const selectLevel = level => {
  return dispatch => {
    dispatch(setLevel(level));
    dispatch(filterAndGroupByDate());
  };
};

const setLevel = level => {
  return {
    type: actionTypes.SELECT_LEVEL,
    level: level,
  };
};

export const setAll = (language, level, location) => {
  return dispatch => {
    dispatch(setLanguage(language));
    dispatch(setLevel(level));
    dispatch(setLocation(location));
  };
};

export const selectLocation = location => {
  return dispatch => {
    dispatch(setLocation(location));
    dispatch(filterAndGroupByDate());
  };
};

const setLocation = location => {
  return {
    type: actionTypes.SELECT_LOCATION,
    location: location,
  };
};

export const selectExamSession = examSession => {
  return {
    type: actionTypes.SELECT_EXAM_SESSION,
    examSession: examSession,
  };
};

export const fetchExamSession = examSessionId => {
  return dispatch => {
    dispatch(fetchExamSessionStart());
    axios
      .get(`/yki/api/exam-session/${examSessionId}`)
      .then(res => dispatch(fetchExamSessionSuccess(res.data)))
      .catch(err => dispatch(fetchExamSessionFail(err)));
  };
};

const fetchExamSessionStart = () => {
  return {
    type: actionTypes.FETCH_EXAM_SESSIONS_START,
  };
};

const fetchExamSessionSuccess = examSession => {
  return {
    type: actionTypes.FETCH_EXAM_SESSION_SUCCESS,
    examSession: examSession,
  };
};

const fetchExamSessionFail = error => {
  return {
    type: actionTypes.FETCH_EXAM_SESSION_FAIL,
    error: error,
  };
};

export const initRegistrationForm = examSessionId => {
  return dispatch => {
    dispatch(initRegistrationFormStart());
    Promise.all([
      axios.post('/yki/api/registration/init', {
        exam_session_id: Math.trunc(examSessionId),
      }),
      axios.get('/yki/api/code/maatjavaltiot2'),
      axios.get('/yki/api/code/sukupuoli'),
    ])
      .then(([init, nationalities, genders]) => {
        dispatch(
          initRegistrationFormSuccess(
            init.data,
            nationalities.data,
            genders.data,
          ),
        );
      })
      .catch(err => {
        dispatch(initRegistrationFormFail(err));
      });
  };
};

const initRegistrationFormStart = () => {
  return {
    type: actionTypes.INIT_REGISTRATION_FORM_START,
  };
};

const initRegistrationFormSuccess = (formInitData, nationalities, genders) => {
  return {
    type: actionTypes.INIT_REGISTRATION_FORM_SUCCESS,
    formInitData: Object.assign(
      formInitData,
      { nationalities: nationalities },
      { genders: genders },
    ),
  };
};

const initRegistrationFormFail = error => {
  return {
    type: actionTypes.INIT_REGISTRATION_FORM_FAIL,
    error: error.response,
  };
};

export const submitRegistrationForm = (registrationId, registrationForm) => {
  return dispatch => {
    dispatch(submitRegistrationFormStart());
    axios
      .post(`/yki/api/registration/${registrationId}/submit`, registrationForm)
      .then(res => {
        dispatch(submitRegistrationFormSuccess(registrationForm));
      })
      .catch(err => {
        dispatch(submitRegistrationFormFail(err));
      });
  };
};

const submitRegistrationFormStart = () => {
  return {
    type: actionTypes.SUBMIT_REGISTRATION_FORM_START,
  };
};

const submitRegistrationFormSuccess = registrationForm => {
  return {
    type: actionTypes.SUBMIT_REGISTRATION_FORM_SUCCESS,
    formData: registrationForm,
  };
};

const submitRegistrationFormFail = error => {
  return {
    type: actionTypes.SUBMIT_REGISTRATION_FORM_FAIL,
    error: error,
  };
};
