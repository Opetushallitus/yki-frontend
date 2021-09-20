import React, { Component } from 'react';
import { Field, ErrorMessage } from 'formik';
import { withTranslation } from 'react-i18next';
import classes from './SessionContact.module.css';
import * as i18nKeys from "../../common/LocalizationKeys";

export class SessionContact extends Component {

	render() {
		const t = this.props.t;
		return (
			<div className={classes.FormElement}>
				<h3>{t(i18nKeys.examSession_contact_title)}</h3>
				<label className={classes.ExtraLabel}>
					{t(i18nKeys.examSession_contact_name_label)}
				</label>
				<Field
					id="contactName"
					name="contactName"
					placeholder={t(i18nKeys.examSession_contact_name_placeholder)}
					className={classes.TextInput}
				/>
				<ErrorMessage
					name="contactName"
					component="span"
					className={classes.ErrorMessage}
				/>
				<label className={classes.ExtraLabel}>
					{t(i18nKeys.examSession_contact_email_label)}
				</label>
				<Field
					id="contactEmail"
					name="contactEmail"
					placeholder={t(i18nKeys.examSession_contact_email_placeholder)}
					className={classes.TextInput}
				/>
				<ErrorMessage
					name="contactEmail"
					component="span"
					className={classes.ErrorMessage}
				/>
				<label className={classes.ExtraLabel}>
					{t(i18nKeys.examSession_contact_phoneNumber_label)}
				</label>
				<Field
					id="contactPhoneNumber"
					name="contactPhoneNumber"
					placeholder={t(i18nKeys.examSession_contact_phoneNumber_placeholder)}
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
