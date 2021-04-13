import React, { Component } from 'react';
import { Field, ErrorMessage } from 'formik';
import { withTranslation } from 'react-i18next';
import classes from './SessionContact.module.css';

export class SessionContact extends Component {

	render() {
		const t = this.props.t;
		return (
			<div className={classes.FormElement}>
				<h3>{t('examSession.contact.title')}</h3>
				<label className={classes.ExtraLabel}>
					{t('examSession.contact.name.label')}
				</label>
				<Field
					id="contactName"
					name="contactName"
					placeholder={t('examSession.contact.name.placeholder')}
					className={classes.TextInput}
				/>
				<ErrorMessage
					name="contactName"
					component="span"
					className={classes.ErrorMessage}
				/>
				<label className={classes.ExtraLabel}>
					{t('examSession.contact.email.label')}
				</label>
				<Field
					id="contactEmail"
					name="contactEmail"
					placeholder={t('examSession.contact.email.placeholder')}
					className={classes.TextInput}
				/>
				<ErrorMessage
					name="contactEmail"
					component="span"
					className={classes.ErrorMessage}
				/>
				<label className={classes.ExtraLabel}>
					{t('examSession.contact.phoneNumber.label')}
				</label>
				<Field
					id="contactPhoneNumber"
					name="contactPhoneNumber"
					placeholder={t('examSession.contact.phoneNumber.placeholder')}
					className={classes.TextInput}
				/>
				<ErrorMessage
					name="contactPhoneNumber"
					component="span"
					className={classes.ErrorMessage}
				/>
			</div>
		);
	}
}

export default withTranslation()(SessionContact);
