import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {withTranslation} from 'react-i18next';
import moment from 'moment';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import DatePicker from '../../../../components/UI/DatePicker/DatePicker';
import {addPostAdmission} from '../../../../store/actions/index';
import closeSign from '../../../../assets/svg/close-overlay.svg';
import classes from './ExamSessionPostAdmission.module.css'

const ExamSessionPostAdmissionCreate = props => {
  const t = props.t;
  const validationSchema = Yup.object().shape({
    postAdmissionStart: Yup.string().required(t('error.mandatory')),
    postAdmissionEnd: Yup.string().required(t('error.mandatory')),
    postAdmissionQuota: Yup.number().typeError(t('error.numeric.int')).required(t('error.mandatory')).positive(t('error.numeric.positive')).integer(t('error.numeric.int')),
  });

  const postAdmissionAddHandler = (postadmission) => {
    props.addPostAdmission(props.oid, props.examSessionId, postadmission);
    props.onCancel();
  }

  return (
    <Formik
      initialValues={{
        postAdmissionStart: '',
        postAdmissionEnd: moment(props.postAdmissionEndDate).format('D.M.YYYY'),
        postAdmissionQuota: '',
      }}
      validationSchema={validationSchema}
      onSubmit={values => {
        const submitPayload = {
          post_admission_start_date: values.postAdmissionStart,
          post_admission_quota: parseInt(values.postAdmissionQuota),
          post_admission_active: false,
        }

        postAdmissionAddHandler(submitPayload);
      }}
      render={({values, setFieldValue, isValid, handleReset}) => (
        <Form className={classes.Form}>
          <div className={classes.FormItem}>
            <h2>{t('examSession.postAdmission')}</h2>
            <button className={classes.ExitButton} onClick={props.onCancel} tabIndex='5'>
              <img src={closeSign} alt={t('common.cancelConfirm')}/>
            </button>
          </div>
          <div className={classes.FormItem} data-cy="post-admission-form-create">
            <div className={classes.DatePickerWrapper}>
              <label className={classes.Label}
                     htmlFor="postAdmissionStart">{t('examSession.postAdmission.startDate')}</label>
              <DatePicker
                id="postAdmissionStart"
                options={{
                  defaultDate: '',
                  value: values.postAdmissionStart,
                  minDate: moment(props.postAdmissionMinDate).add(1, 'days').format('YYYY MM DD'),
                  maxDate: moment(props.postAdmissionEndDate).add(-1, 'days').format('YYYY MM DD')
                }}
                onChange={d =>
                  setFieldValue(
                    'postAdmissionStart',
                    moment(d[0]).format('YYYY-MM-DD'),
                  )
                }
                locale={props.i18n.language}
                tabIndex="1"
              />
              <ErrorMessage
                name="postAdmissionStart"
                component="span"
                className={classes.ErrorMessage}
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
              <label className={classes.Label} htmlFor="postAdmissionQuota">
                {t('examSession.postAdmission.participantAmount')}
              </label>
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
            </div>
            <div>
              <button className={classes.Button} data-cy="button-admission-submit" type="submit" tabIndex="4">
                {t('examSession.postAdmission.createTemplate')}
              </button>
            </div>
          </div>
        </Form>
      )}/>
  )
}

ExamSessionPostAdmissionCreate.propTypes = {
  examSessionId: PropTypes.number.isRequired,
  postAdmissionMinDate: PropTypes.string.isRequired,
  postAdmissionEndDate: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
}

export default connect(null, {addPostAdmission})(withTranslation()(ExamSessionPostAdmissionCreate));
