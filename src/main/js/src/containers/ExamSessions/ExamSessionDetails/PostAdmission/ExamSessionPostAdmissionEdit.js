import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DatePicker from '../../../../components/UI/DatePicker/DatePicker';
import { addPostAdmission } from '../../../../store/actions/examSession';
import classes from './ExamSessionPostAdmission.module.css'

class ExamSessionPostAdmissionEdit extends React.Component {
  constructor (props) {
    super(props);

    this.state = { edit: false, active: this.props.postAdmission.post_admission_active };
  }

  render() {
    console.log(this.props)
    const t = this.props.t;
    const validationSchema = Yup.object().shape({
      postAdmissionStart: Yup.string().required(t('error.mandatory')),
      postAdmissionEnd: Yup.string().required(t('error.mandatory')),
      postAdmissionQuota: Yup.number().typeError(t('error.numeric.int')).required(t('error.mandatory')).positive(t('error.numeric.positive')).integer(t('error.numeric.int')),
    });

    if (this.state.edit) {
      return (
        <Formik
          initialValues={{
            postAdmissionStart: this.props.postAdmission.post_admission_start_date,
            postAdmissionEnd: moment(this.props.postAdmissionEndDate).format('D.M.YYYY'),
            postAdmissionQuota: this.props.postAdmission.post_admission_quota,
          }}
          validationSchema={validationSchema}
          onSubmit={values => {
            const submitPayload = {
              post_admission_start_date: values.postAdmissionStart,
              post_admission_end_date: values.postAdmissionEnd,
              post_admission_quota: values.postAdmissionQuota,
              post_admission_active: this.state.active
            }

            this.props.addPostAdmission(this.props.examSessionId, submitPayload);
            this.setState({ edit: false });
          }}
          render={({ values, setFieldValue, isValid, handleReset }) => (
            <Form className={classes.Form}>
              <div data-cy="post-admission-form-create">
                <div>
                  <label className={classes.Label} htmlFor="postAdmissionStart">{t('examSession.postAdmission.startDate')}</label>
                  <DatePicker
                    id="postAdmissionStart"
                    className={`${classes.Input} ${classes.DatePicker}`}
                    options={{
                      defaultDate: this.props.postAdmission.post_admission_start_date,
                      value: values.postAdmissionStart,
                      minDate: moment(this.props.postAdmissionMinDate).add(1, 'days').format('YYYY MM DD'),
                      maxDate: moment(this.props.postAdmissionEndDate).add(-1, 'days').format('YYYY MM DD'),
                    }}
                    onChange={d =>
                      setFieldValue(
                        'postAdmissionStart',
                        moment(d[0]).format('YYYY-MM-DD'),
                      )
                    }
                    locale={this.props.i18n.language}
                    tabIndex="1"
                  />
                  <ErrorMessage
                    name="postAdmissionStart"
                    component="span"
                    className={classes.ErrorMessage}
                  />
                </div>
                <div>
                  <label className={classes.Label} htmlFor="postAdmissionEnd">{t('examSession.postAdmission.endDate')}</label>
                  <Field
                    id="postAdmissionEnd"
                    className={`${classes.Input} ${classes.Disabled}`}
                    name="postAdmissionEnd"
                    data-cy="input-admission-endDate"
                    disabled
                  />
                </div>
                <div>
                  <label className={classes.Label} htmlFor="postAdmissionParticipantAmount">{t('examSession.postAdmission.participantAmount')}</label>
                  <Field
                    id="postAdmissionQuota"
                    className={classes.Input}
                    name="postAdmissionQuota"
                    data-cy="input-admission-quota"
                    tabIndex="2"
                  />
                  <ErrorMessage
                    name="postAdmissionQuota"
                    component="span"
                    className={classes.ErrorMessage}
                  />
                </div>
                <div className={classes.Buttons} data-cy="admission-create-form-controls">
                  <button className={classes.Button} type="submit" tabIndex="3">
                    Tallenna
                  </button>
                </div>
              </div>
            </Form>
          )}
        />
      )
    } else {
      return (
        <>
          <label className={classes.Label}>
            {t('examSession.postAdmission.startDate')}
          </label>
          <input className={`${classes.Input} ${classes.Disabled}`} value={moment(this.props.postAdmission.post_admission_start_date).format('D.M.YYYY')} disabled />
          <label className={classes.Label}>
            {t('examSession.postAdmission.endDate')}
          </label>
          <input className={`${classes.Input} ${classes.Disabled}`} value={moment(this.props.postAdmissionEndDate).format('D.M.YYYY')} disabled />
          <label className={classes.Label}>
            {t('examSession.postAdmission.participantAmount')}
          </label>
          <input className={`${classes.Input} ${classes.Disabled}`} value={this.props.postAdmission.post_admission_quota} disabled />
          <div className={classes.Buttons} data-cy="admission-create-form-controls">
            <button className={classes.Button} type="button" tabIndex="1" onClick={e => this.setState({ edit: true })}>
              Muokkaa
            </button>
            <button className={`${classes.Button} ${classes.ButtonRight}`} type="button" tabIndex="2">
              Aktivoi
            </button>
          </div>
        </>
      )
    }
  }
}

ExamSessionPostAdmissionEdit.propTypes = {
  postAdmission: PropTypes.object.isRequired,
  examSessionId: PropTypes.number.isRequired,
  postAdmissionMinDate: PropTypes.string.isRequired,
  postAdmissionEndDate: PropTypes.string.isRequired,
}

export default connect(null, { addPostAdmission })(withTranslation()(ExamSessionPostAdmissionEdit));