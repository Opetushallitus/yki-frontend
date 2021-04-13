import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import ExamSessionPostAdmissionEdit from './ExamSessionPostAdmissionEdit';
import ExamSessionPostAdmissionForm from './ExamSessionPostAdmissionForm';
import classes from './ExamSessionPostAdmission.module.css';

export class ExamSessionPostAdmission extends Component {
  constructor(props) {
    super(props);

    this.state = {
      createMode: false,
    }
  }

  toggleCreateMode = () => {
    this.setState({ createMode: !this.state.createMode });
  }

  render() {
    const t = this.props.t;
    const postAdmission = {
      post_admission_quota: this.props.examSession.post_admission_quota,
      post_admission_start_date: this.props.examSession.post_admission_start_date,
      post_admission_end_date: this.props.examSession.post_admission_end_date,
      post_admission_enabled: this.props.examSession.post_admission_enabled,
      post_admission_active: this.props.examSession.post_admission_active,
    }

    if (!this.props.examSession.post_admission_enabled)
      return <p>{t('examSession.postAdmission.notAllowed')}</p>

    if (this.state.createMode)
      return (
        <ExamSessionPostAdmissionForm
          oid={this.props.oid}
          examSessionId={this.props.examSession.id}
          postAdmissionStartDate={this.props.examSession.post_admission_start_date}
          postAdmissionEndDate={this.props.examSession.post_admission_end_date}
          onClose={this.toggleCreateMode}
        />
      )

    if (this.props.examSession.post_admission_active)
      return (
        <ExamSessionPostAdmissionEdit
          oid={this.props.oid}
          postAdmission={postAdmission}
          examSessionId={this.props.examSession.id}
        />
      )

    return (
      <div data-cy="exam-session-no-post-admission">
        <button
          className={classes.CreatePostAdmissionLinkButton}
          data-cy="exam-session-post-admission-add-button"
          onClick={() => this.toggleCreateMode()}
        >
          {t('examSession.postAdmission.create')}
        </button>
      </div>
    )
  }
}

ExamSessionPostAdmission.propTypes = {
  examSession: PropTypes.object.isRequired,
  oid: PropTypes.string.isRequired,
}

export default withTranslation()(ExamSessionPostAdmission);
