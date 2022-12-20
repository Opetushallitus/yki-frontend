import moment from 'moment';
import React, { useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import * as R from 'ramda';

import Button from '../../components/UI/Button/Button';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Page from '../../hoc/Page/Page';
import classes from './Quarantine.module.css';
import * as actions from '../../store/actions/index';
import { DATE_FORMAT, LANGUAGES } from '../../common/Constants';
import Modal from '../../components/UI/Modal/Modal';

const Quarantine = props => {
  const {
    t,
    quarantines,
    onFetchQuarantines,
  } = props;
  const findLang = (language) => LANGUAGES.find(l => l.code === language).name;

  useEffect(onFetchQuarantines, []);

  return (
    <Page>
      <div className={classes.QuarantineMatches}>
        <h1>
          Karenssit
        </h1>

        <p>
          Asetetut karenssit.
        </p>

        <div className={classes.QuarantineList}>
          <div className={classes.ListHeader}>
            {t('common.examLanguage')}
          </div>
          <div className={classes.ListHeader}>
            {t('common.examDate')}
          </div>
          <div className={classes.ListHeader}>
            {t('common.names')}
          </div>
          <div className={classes.ListHeader}>
            {t('common.email')}
          </div>
          <div className={classes.ListHeader}>
            {t('common.birthdate')}
          </div>
          <div className={classes.ListHeader}>
            {t('common.phoneNumber')}
          </div>
          <div className={classes.ListHeader}>
            Tarkastettu
          </div>
          <div className={classes.ListHeader}>
            Tila
          </div>
          {quarantines.map((match) => (
            <React.Fragment key={`quarantine-match-row-{match.id}`}>
              <div>{findLang(match.language_code)}</div>
              <div>{moment(match.end_date).format(DATE_FORMAT)}</div>
              <div>
                {match.name}
              </div>
              <div>
                {match.email}
              </div>
              <div>
                {moment(match.birthdate).format(DATE_FORMAT)}
              </div>
              <div>
                {match.phone_number}
              </div>
              <div>
              </div>
              <div>
                Karenssissa
              </div>
            </React.Fragment>
          ))}
        </div>
     </div>
    </Page>
  );
};

const mapStateToProps = state => {
  return {
    quarantines: state.quarantine.quarantines,
    confirm: state.quarantine.confirm,
    error: state.quarantine.error,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchQuarantines: () => {
      console.log('fetch')
      dispatch(actions.fetchQuarantines());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(withErrorHandler(Quarantine)));
