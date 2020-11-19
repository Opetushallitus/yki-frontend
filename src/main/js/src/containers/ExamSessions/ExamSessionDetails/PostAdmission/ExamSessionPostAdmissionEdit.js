import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {withTranslation} from 'react-i18next';
import moment from 'moment';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import DatePicker from '../../../../components/UI/DatePicker/DatePicker';
import {addPostAdmission, togglePostAdmissionActivation} from '../../../../store/actions/examSession';
import classes from './ExamSessionPostAdmission.module.css'

class ExamSessionPostAdmissionEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {edit: false, confirmActiveToggle: false};
  }

  toggleActivePostAdmission = () => {
    const payload = {
      post_admission_active: !this.props.postAdmission.post_admission_active
    }
    this.props.togglePostAdmissionActivation(this.props.oid, this.props.examSessionId, payload);
    this.setState({confirmActiveToggle: !this.state.confirmActiveToggle});
  }

  render() {
    const t = this.props.t;
    const active = this.props.postAdmission.post_admission_active;
    const validationSchema = Yup.object().shape({
      postAdmissionStart: Yup.string().required(t('error.mandatory')),
      postAdmissionEnd: Yup.string().required(t('error.mandatory')),
      // postAdmissionQuota: Yup.number().typeError(t('error.numeric.int')).required(t('error.mandatory')).positive(t('error.numeric.positive')).integer(t('error.numeric.int')),
    });

    const confirmActivityChangeButtons = (
      <div className={classes.activityToggleButtonBox}>
        <h3 data-cy="h3-admission-confirm-text">{t('examSession.postAdmission.confirmationText')}</h3>
        <div className={classes.ButtonGroup}>
          <button
            className={`${classes.Button} ${classes.CancelButton}`}
            type="button"
            onClick={e => this.setState({confirmActiveToggle: !this.state.confirmActiveToggle})}
            tabIndex="5"
          >
            {t('common.cancelConfirm')}
          </button>
          <button
            className={classes.Button} data-cy="button-admission-activity-confirm"
            type="button"
            onClick={this.toggleActivePostAdmission}
          >
            {t('common.confirm')}
          </button>
        </div>
      </div>
    )


    const modifyFormState = (
      <div className={classes.ButtonGroup}>
        {active ?
          null :
          <button className={classes.Button} data-cy="button-admission-modify" type="button" tabIndex="1"
                  onClick={e => this.setState({edit: !this.state.edit})}>
            {t('common.modify')}
          </button>}
        <button className={`${classes.Button} ${active ? null : classes.ButtonRight}`}
                data-cy="button-admission-toggle-active" type="button" tabIndex="2"
                onClick={e => this.setState({confirmActiveToggle: !this.state.confirmActiveToggle})}>
          {active ? t('examSession.postAdmission.hide') : t('examSession.postAdmission.publish')}
        </button>
      </div>
    )


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
              post_admission_quota: parseInt(values.postAdmissionQuota),
              post_admission_active: this.state.active
            }

            this.props.addPostAdmission(this.props.oid, this.props.examSessionId, submitPayload);
            this.setState({edit: false});
          }}
          render={({values, setFieldValue, isValid, handleReset}) => (
            <Form className={classes.Form}>
              <div className={classes.FormItem} data-cy="post-admission-form-create">
                <div className={classes.DatePickerWrapper}>
                  <label className={classes.Label}
                         htmlFor="postAdmissionStart">{t('examSession.postAdmission.startDate')}</label>
                  <DatePicker
                    id="postAdmissionStart"
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
                  <label className={classes.Label}
                         htmlFor="postAdmissionEnd">{t('examSession.postAdmission.endDate')}</label>
                  <Field
                    id="postAdmissionEnd"
                    className={`${classes.Input} ${classes.Disabled}`}
                    name="postAdmissionEnd"
                    data-cy="input-admission-endDate"
                    disabled
                  />
                </div>
              </div>
              <div>
                <div>
                  <label className={`${classes.Label} ${classes.QuotaLabel}`} htmlFor="postAdmissionQuota">
                    {t('examSession.postAdmission.participantAmount')}: {this.props.postAdmissionQuota}
                  </label>
                  {/*
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
                  */}
                </div>
                <div className={classes.ButtonGroup}>
                  <button
                    className={`${classes.Button} ${classes.CancelButton}`}
                    type="button"
                    onClick={e => this.setState({edit: !this.state.edit})}
                    tabIndex="5"
                  >
                    {t('common.cancelConfirm')}
                  </button>
                  <button className={classes.Button} data-cy="button-admission-submit" type="submit" tabIndex="3">
                    {t('common.save')}
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
          <div className={classes.FormItem}>
            <div>
              <label className={classes.Label}>
                {t('examSession.postAdmission.startDate')}
              </label>
              <input className={`${classes.Input} ${classes.Disabled}`} data-cy="input-admission-startDate"
                     value={moment(this.props.postAdmission.post_admission_start_date).format('D.M.YYYY')} disabled/>
            </div>
            <div>
              <label className={classes.Label}>
                {t('examSession.postAdmission.endDate')}
              </label>
              <input className={`${classes.Input} ${classes.Disabled}`} data-cy="input-admission-endDate"
                     value={moment(this.props.postAdmissionEndDate).format('D.M.YYYY')} disabled/>
            </div>
          </div>
          {/*
          <label className={classes.Label}>
            {t('examSession.postAdmission.participantAmount')}
          </label>
          <input className={`${classes.Input} ${classes.Disabled}`} data-cy="input-admission-quota" value={this.props.postAdmission.post_admission_quota} disabled />
          */}
          <label className={`${classes.Label} ${classes.QuotaLabel}`} htmlFor="postAdmissionQuota">
            {t('examSession.postAdmission.participantAmount')}: {this.props.postAdmissionQuota}
          </label>
          <div className={classes.Buttons}>
            {this.state.confirmActiveToggle ? confirmActivityChangeButtons : modifyFormState}
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

export default connect(null, {
  addPostAdmission,
  togglePostAdmissionActivation
})(withTranslation()(ExamSessionPostAdmissionEdit));
