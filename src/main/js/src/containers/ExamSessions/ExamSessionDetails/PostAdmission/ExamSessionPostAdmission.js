import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import ExamSessionPostAdmissionEdit from './ExamSessionPostAdmissionEdit';
import ExamSessionPostAdmissionCreate from './ExamSessionPostAdmissionCreate';
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
        <ExamSessionPostAdmissionCreate
          oid={this.props.oid} examSessionId={this.props.examSession.id}
          postAdmissionStartDate={this.props.examSession.post_admission_start_date}
          postAdmissionEndDate={this.props.examSession.post_admission_end_date}
          onCancel={this.toggleCreateMode}
        />
      )

    if (this.props.examSession.post_admission_active)
      return (
        <ExamSessionPostAdmissionEdit
          oid={this.props.oid}
          examSession={this.props.examSession}
          postAdmission={postAdmission}
          examSessionId={this.props.examSession.id}
          postAdmissionMinDate={this.props.examSession.registration_end_date}
          postAdmissionEndDate={this.props.examSession.post_admission_end_date}
        />
      )

    return (
      <div data-cy="exam-session-no-post-admission">
        <button
          className={classes.CreatePostAdmissionLinkButton}
          data-cy="button-add-post-admission"
          onClick={() => this.toggleCreateMode()}
        >
          {t('examSession.postAdmission.create')}
        </button>
      </div>
    )


    /*     if (!this.props.examSession.post_admission_end_date) {
          // Post admission not available
          return <p>{t('examSession.postAdmission.notAllowed')}</p>
        } else if (this.props.examSession.post_admission_end_date) {
          // Possible to create PostAdmission
          if (this.props.examSession.post_admission_start_date) {
            // Show Edit view
            return <ExamSessionPostAdmissionEdit
              oid={this.props.oid}
              examSession={this.props.examSession}
              postAdmission={postAdmission}
              examSessionId={this.props.examSession.id}
              postAdmissionMinDate={this.props.examSession.registration_end_date}
              postAdmissionEndDate={this.props.examSession.post_admission_end_date}
            />
          } else if (this.state.createMode) {
            // Show Create view
            return <ExamSessionPostAdmissionCreate
              oid={this.props.oid} examSessionId={this.props.examSession.id}
              postAdmissionMinDate={this.props.examSession.registration_end_date}
              postAdmissionEndDate={this.props.examSession.post_admission_end_date}
              onCancel={this.toggleCreateMode}
            />
          } else {
            // Show Create button
            return (
              <div data-cy="exam-session-no-post-admission">
                <button
                  className={classes.CreatePostAdmissionLinkButton}
                  data-cy="button-add-post-admission"
                  onClick={() => this.toggleCreateMode()}
                >
                  {t('examSession.postAdmission.create')}
                </button>
              </div>
            )
          }
        } */
  }
}

ExamSessionPostAdmission.propTypes = {
  examSession: PropTypes.object.isRequired,
  oid: PropTypes.string.isRequired,
}

export default withTranslation()(ExamSessionPostAdmission);
