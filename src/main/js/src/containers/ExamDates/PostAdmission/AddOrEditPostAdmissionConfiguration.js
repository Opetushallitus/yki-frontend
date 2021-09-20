import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Formik, Form, ErrorMessage } from 'formik';
import { withTranslation } from 'react-i18next';
import * as Yup from 'yup';
import DatePicker from '../../../components/UI/DatePicker/DatePicker';
import ActionButton from '../../../components/UI/ActionButton/ActionButton';
import { DATE_FORMAT } from '../../../common/Constants';
import { languageToString } from '../../../util/util';
import classes from './AddOrEditPostAdmissionConfiguration.module.css';
import * as actions from '../../../store/actions';
import * as i18nKeys from "../../../common/LocalizationKeys";

// NO LONGER IN USE
// Can be removed when post admission feature is confirmed to work
// and no more stuff needs to be saved.

const AddOrEditPostAdmissionConfiguration = (props) => {
  const t = props.t;
  const validationSchema = Yup.object().shape({
    postAdmissionEnd: Yup.string().required(t(i18nKeys.error_mandatory)),
  });

  const endDateSubmitHandler = (payload) => {
    props.onUpdateEndDate(props.examDate.id, payload);
    props.onUpdate();
  }

  const deleteHandler = () => {
    props.onDelete(props.examDate.id);
    props.onUpdate();
  }

  const deleteButton = examDate => {
    const postAdmissionRegistrationStarted = moment().isAfter(
      moment(examDate.registration_end_date),
    );
    return postAdmissionRegistrationStarted || !examDate.post_admission_end_date ? null : (
      <div className={classes.ActionButton}>
        <ActionButton
          onClick={deleteHandler}
          confirmOnRight={true}
          children={t(i18nKeys.examSession_delete)}
          confirmText={t(i18nKeys.common_confirm)}
          cancelText={t(i18nKeys.common_cancelConfirm)}
        />
      </div>
    );
  };

  const FormFields = () => (
    <Formik
      initialValues={{
        postAdmissionEnd: props.examDate.post_admission_end_date
      }}
      validationSchema={validationSchema}
      onSubmit={values => {
        const submitPayload = {
          post_admission_end_date: values.postAdmissionEnd,
        }

        endDateSubmitHandler(submitPayload);
      }}
      render={({ values, setFieldValue }) => (
        <Form className={classes.Form}>
          <div data-cy="post-admission-form-create">
            <div className={classes.DatePickerWrapper}>
              <label className={classes.Label} htmlFor="postAdmissionEnd">Jälki-ilmoittautumisen päättymispäivä</label>
              <DatePicker
                id="postAdmissionEnd"
                options={{
                  defaultDate: props.examDate.post_admission_end_date,
                  value: values.postAdmissionEnd,
                  minDate: moment(props.examDate.registration_end_date).add(1, 'days').format('YYYY MM DD'),
                  maxDate: moment(props.examDate.exam_date).add(-1, 'days').format('YYYY MM DD')
                }}
                onChange={d =>
                  setFieldValue(
                    'postAdmissionEnd',
                    moment(d[0]).format('YYYY-MM-DD'),
                  )
                }
                locale={props.i18n.language}
                tabIndex="1"
              />
              <ErrorMessage
                name="postAdmissionEnd"
                component="span"
                className={classes.ErrorMessage}
              />
            </div>
            <div className={classes.Buttons}>
              <button className={classes.Button} type="submit" tabIndex="2">
                Tallenna
              </button>
              {deleteButton(props.examDate)}
            </div>
          </div>
        </Form>
      )}
    />
  )

  const ExamDateDetails = () => (
    <>
      <p>Tutkintopäivä: {moment(props.examDate.exam_date).format(DATE_FORMAT)}</p>
      <p>Kielet: {props.examDate.languages.map(l => languageToString(l.language_code).toLowerCase()).join(', ')}</p>
    </>
  );

  const editView = () => (
    <>
      <h1>Muokkaa jälki-ilmoittautumisasetuksia</h1>
      {/* { tähän jotain helpparitekstejä kertomaan jos konfiguraatiota ei voi poistaa } */}

      <ExamDateDetails />
      <FormFields />
    </>
  );

  const createView = () => (
    <>
      <h1>Luo jälki-ilmoittautumisasetukset</h1>
      <ExamDateDetails />
      <FormFields />
    </>
  );

  return (
    props.examDate.post_admission_end_date ? editView() : createView()
  )
}

const mapDispatchToProps = dispatch => {
  return {
    onUpdateEndDate: (examDateId, endDate) => dispatch(actions.updatePostAdmissionEndDate(examDateId, endDate)),
    onDelete: (examDateId) => dispatch(actions.deletePostAdmissionEndDate(examDateId)),
  }
}

AddOrEditPostAdmissionConfiguration.propTypes = {
  examDate: PropTypes.object.isRequired,
  onUpdateEndDate: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(withTranslation()(AddOrEditPostAdmissionConfiguration));
