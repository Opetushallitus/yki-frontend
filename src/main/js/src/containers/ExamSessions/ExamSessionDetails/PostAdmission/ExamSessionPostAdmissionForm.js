import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { activatePostAdmission } from '../../../../store/actions/index';
import closeSign from '../../../../assets/svg/close-overlay.svg';
import classes from './ExamSessionPostAdmission.module.css'

const ExamSessionPostAdmissionForm = props => {

  const t = props.t;
  const validationSchema = Yup.object().shape({
    postAdmissionQuota: Yup.number().typeError(t('error.numeric.int')).required(t('error.mandatory')).positive(t('error.numeric.positive')).integer(t('error.numeric.int')),
  });

  const postAdmissionAddHandler = (postadmission) => {
    props.activatePostAdmission(props.oid, props.examSessionId, postadmission);
    props.onClose();
  }

  const getSaveButtonStyle = (isValid) => isValid
    ? classes.Button
    : [classes.Button, classes.DisabledButton, classes.Disabled].join(" ")


  return (
    <Formik
      initialValues={{
        postAdmissionStart: moment(props.postAdmissionStartDate).format('D.M.YYYY'),
        postAdmissionEnd: moment(props.postAdmissionEndDate).format('D.M.YYYY'),
        postAdmissionQuota: props.postAdmissionQuota || '',
      }}
      validationSchema={validationSchema}
      onSubmit={values => {
        const submitPayload = {
          post_admission_quota: parseInt(values.postAdmissionQuota),
        }
        postAdmissionAddHandler(submitPayload);
      }}
      render={({ values, setFieldValue, isValid, dirty, handleReset }) => (
        <Form className={classes.Form}>
          <div className={classes.ExitItem}>
            <div onClick={props.onClose}>{t('common.close')}</div>
            <button
              onClick={props.onClose}
              className={classes.ExitButton}
              tabIndex='5'>
              <img src={closeSign} alt={t('common.cancelConfirm')} />
            </button>
          </div>
          <div className={classes.FormItem} data-cy="post-admission-form-create">
            <div className={classes.DatePickerWrapper}>
              <label className={classes.Label}
                htmlFor="postAdmissionStart">{t('examSession.postAdmission.startDate')}</label>
              <Field
                id="postAdmissionEnd"
                className={`${classes.Input} ${classes.Disabled}`}
                name="postAdmissionStart"
                data-cy="input-admission-endDate"
                tabIndex="3"
                disabled
              />
            </div>
            <div>
              <label
                className={classes.Label}
                htmlFor="postAdmissionEnd">
                {t('examSession.postAdmission.endDate')}
              </label>
              <Field
                id="postAdmissionEnd"
                className={`${classes.Input} ${classes.Disabled}`}
                name="postAdmissionEnd"
                data-cy="input-admission-endDate"
                tabIndex="3"
                disabled
              />
            </div>
          </div>
          <div className={classes.FormItem}>
            <div>
              <label className={`${classes.Label} ${classes.QuotaLabel}`} htmlFor="postAdmissionQuota">
                {t('examSession.postAdmission.participantAmount')}: {props.postAdmissionQuota}
              </label>
              {/*
              <Field
                id="postAdmissionQuota"
                className={classes.Input}
                name="postAdmissionQuota"
                data-cy="input-admission-quota"
                tabIndex="3"
              />
              <ErrorMessage
                name="postAdmissionQuota"
                component="span"
                className={classes.ErrorMessage}
              />
              */}
            </div>
            <div className={classes.ButtonGroupButtons}>
              <button
                disabled={!(isValid && dirty)}
                className={getSaveButtonStyle(isValid)}
                data-cy="button-admission-submit"
                type="submit" tabIndex="4">
                {t('examSession.postAdmission.publish')}
              </button>
            </div>
          </div>
        </Form>
      )} />
  )
}

ExamSessionPostAdmissionForm.propTypes = {
  oid: PropTypes.string.isRequired,
  examSessionId: PropTypes.number.isRequired,
  postAdmissionStartDate: PropTypes.string.isRequired,
  postAdmissionEndDate: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  activateAdmissionQuota: PropTypes.number,
}

export default connect(null, { activatePostAdmission })(withTranslation()(ExamSessionPostAdmissionForm));
