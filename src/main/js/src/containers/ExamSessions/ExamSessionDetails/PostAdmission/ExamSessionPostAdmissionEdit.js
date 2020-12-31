import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import { addPostAdmission, deactivatePostAdmission } from '../../../../store/actions/examSession';
import classes from './ExamSessionPostAdmission.module.css'
import ExamSessionPostAdmissionForm from './ExamSessionPostAdmissionForm';

class ExamSessionPostAdmissionEdit extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      edit: false,
      confirmActiveToggle: false,
      quota: this.props.postAdmission.post_admission_quota || ''
    };
  }

  deactivatePostAdmission = () => {
    this.props.deactivatePostAdmission(this.props.oid, this.props.examSessionId);
    this.setState({ confirmActiveToggle: !this.state.confirmActiveToggle });
  }

  render() {
    const t = this.props.t;
    const active = this.props.postAdmission.post_admission_active;

    const confirmActivityChangeButtons = (
      <div className={classes.activityToggleButtonBox}>
        <h3 data-cy="h3-admission-confirm-text">{t('examSession.postAdmission.confirmationText')}</h3>
        <div className={classes.ButtonGroup}>
          <button
            className={`${classes.Button} ${classes.CancelButton}`}
            data-cy="exam-session-post-admission-cancel"
            type="button"
            onClick={e => this.setState({ confirmActiveToggle: !this.state.confirmActiveToggle })}
            tabIndex="5"
          >
            {t('common.cancelConfirm')}
          </button>
          <button
            className={classes.Button}
            data-cy="exam-session-post-admission-confirm"
            type="button"
            onClick={this.deactivatePostAdmission}
          >
            {t('common.confirm')}
          </button>
        </div>
      </div>
    )


    const modifyFormState = (
      <div className={classes.ButtonGroup}>
        <button className={classes.Button} data-cy="exam-session-post-admission-modify-button" type="button" tabIndex="1"
          onClick={e => this.setState({ edit: !this.state.edit })}>
          {t('common.modify')}
        </button>
        <button className={`${classes.Button} ${active ? null : classes.ButtonRight}`}
          data-cy="exam-session-post-admission-deactivate-button" type="button" tabIndex="2"
          onClick={e => this.setState({ confirmActiveToggle: !this.state.confirmActiveToggle })}>
          {active ? t('examSession.postAdmission.close') : t('examSession.postAdmission.publish')}
        </button>
      </div>
    )


    if (this.state.edit) {
      return (
        <ExamSessionPostAdmissionForm
          oid={this.props.oid}
          examSessionId={this.props.examSessionId}
          postAdmissionStartDate={this.props.postAdmission.post_admission_start_date}
          postAdmissionEndDate={this.props.postAdmission.post_admission_end_date}
          postAdmissionQuota={this.props.postAdmission.post_admission_quota}
          onClose={() => this.setState({ edit: false })}
        />
      )
    } else {
      return (
        <>
          <div className={classes.FormItem}>
            <div>
              <label className={classes.Label}>
                {t('examSession.postAdmission.startDate')}
              </label>
              <input className={`${classes.Input} ${classes.Disabled}`} data-cy="exam-session-post-admission-input-startDate"
                value={moment(this.props.postAdmission.post_admission_start_date).format('D.M.YYYY')} disabled />
            </div>
            <div>
              <label className={classes.Label}>
                {t('examSession.postAdmission.endDate')}
              </label>
              <input className={`${classes.Input} ${classes.Disabled}`} data-cy="exam-session-post-admission-input-endDate"
                value={moment(this.props.postAdmission.post_admission_end_date).format('D.M.YYYY')} disabled />
            </div>
          </div>
          {/*
          <label className={classes.Label}>
            {t('examSession.postAdmission.participantAmount')}
          </label>
          <input
            className={`${classes.Input} ${classes.Disabled}`}
            data-cy="exam-session-post-admission-input-quota"
            value={this.state.quota}
            disabled />
          <div className={classes.Buttons}>
            {this.state.confirmActiveToggle ? confirmActivityChangeButtons : modifyFormState}
          </div>
        </>
      )
    }
  }
}

ExamSessionPostAdmissionEdit.propTypes = {
  oid: PropTypes.string.isRequired,
  postAdmission: PropTypes.object.isRequired,
  examSessionId: PropTypes.number.isRequired,
}

export default connect(null, {
  addPostAdmission,
  deactivatePostAdmission
})(withTranslation()(ExamSessionPostAdmissionEdit));
