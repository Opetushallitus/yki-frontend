import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';

import classes from './ExamSessionUpdateForm.module.css';
import Button from '../../../../components/UI/Button/Button';
import DeleteButton from '../../../../components/UI/DeleteButton/DeleteButton';
import {
  DATE_FORMAT,
  DATE_FORMAT_WITHOUT_YEAR,
} from '../../../../common/Constants';

export class ExamSessionUpdateForm extends Component {
  state = {
    deleting: false,
  };

  toggleDeleting = () => {
    this.setState(prevState => ({
      deleting: !prevState.deleting,
    }));
  };

  render() {
    const validationSchema = Yup.object().shape({
      maxParticipants: Yup.number()
        .typeError(this.props.t('error.numeric'))
        .required(this.props.t('error.mandatory'))
        .min(
          this.props.examSession.participants,
          this.props.t('examSession.maxParticipants.lessThan.participants'),
        )
        .integer(),
      address: Yup.string().required(this.props.t('error.mandatory')),
      location: Yup.string(),
      extra: Yup.string(),
    });

    const registrationPediod = examSession => {
      const start = moment(examSession.registration_start_date).format(
        DATE_FORMAT_WITHOUT_YEAR,
      );
      const end = moment(examSession.registration_end_date).format(DATE_FORMAT);
      return (
        <label>
          {start} &ndash; {end}
        </label>
      );
    };

    const deleteButton = examSession => {
      const registrationStarted = moment().isAfter(
        moment(examSession.registration_start_date),
      );
      return registrationStarted ? null : (
        <div className={classes.DeleteButton}>
        <DeleteButton
          onClick={this.props.onDelete}
          deleting={this.state.deleting}
          toggleDeleting={this.toggleDeleting}
          deleteText={this.props.t('examSession.delete')}
          deleteConfirmText={this.props.t('common.confirm')}
          deleteCancelText={this.props.t('common.cancelConfirm')}
        />
        </div>

      );
    };

    return (
      <Formik
        initialValues={{
          maxParticipants: this.props.examSession.max_participants,
          address: this.props.examSession.location[0].address,
          location: this.props.examSession.location[0].other_location_info,
          extra: this.props.examSession.location[0].extra_information
            ? this.props.examSession.location[0].extra_information
            : '',
        }}
        validationSchema={validationSchema}
        onSubmit={values => {
          const payload = {
            ...this.props.examSession,
            max_participants: Number.parseInt(values.maxParticipants),
            location: [
              {
                name: this.props.examSession.location[0].name,
                address: values.address,
                other_location_info: values.location,
                extra_information: values.extra,
                lang: 'fi',
              },
            ],
          };
          this.props.onSubmit(payload);
        }}
        render={({ isValid }) => (
          <Form className={classes.Form}>
            <div>
              <div className={classes.FormElement}>
                <h3>{this.props.t('common.registationPeriod')}</h3>
                {registrationPediod(this.props.examSession)}
              </div>
              <div className={classes.FormElement}>
                <h3>{`${this.props.t('examSession.maxParticipants')} *`}</h3>
                <Field
                  id="maxParticipants"
                  name="maxParticipants"
                  data-cy="input-max-participants"
                  className={classes.MaxParticipantsInput}
                />
                <ErrorMessage
                  name="maxParticipants"
                  component="span"
                  className={classes.ErrorMessage}
                />
              </div>
              <div className={classes.FormElement}>
                <h3>{`${this.props.t('common.address')} *`}</h3>
                <Field
                  id="address"
                  name="address"
                  data-cy="input-address"
                  className={classes.TextInput}
                />
                <ErrorMessage
                  name="address"
                  component="span"
                  className={classes.ErrorMessage}
                />
              </div>
            </div>
            <div>
              <div className={classes.FormElement}>
                <h3>{this.props.t('common.location')}</h3>
                <Field
                  id="location"
                  name="location"
                  className={classes.TextInput}
                />
                <ErrorMessage
                  name="location"
                  component="span"
                  className={classes.ErrorMessage}
                />
              </div>
              <div className={classes.FormElement}>
                <h3>{this.props.t('common.extra')}</h3>
                <Field
                  component="textarea"
                  id="extra"
                  name="extra"
                  rows={5}
                  cols={33}
                  maxLength="2048"
                  wrap="soft"
                  className={classes.TextArea}
                />
                <ErrorMessage
                  name="extra"
                  component="span"
                  className={classes.ErrorMessage}
                />
              </div>
              <div className={classes.Buttons}>
                {deleteButton(this.props.examSession)}
                <Button
                  type="submit"
                  disabled={!isValid}
                  className={classes.UpdateButton}
                >
                  {this.props.t('registryItem.button.update')}
                </Button>
              </div>
            </div>
          </Form>
        )}
      />
    );
  }
}

ExamSessionUpdateForm.propTypes = {
  examSession: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default withNamespaces()(ExamSessionUpdateForm);
