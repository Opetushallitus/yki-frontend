import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import classes from './OrganizationSessionParticipants.module.css';

const OrganizationSessionParticipants = (props) => {
	const { participants, session, goBack } = props;
	const showError = !participants || !session;

	const participantRows = () => {
		if (!participants) return null;
		return participants.map((participant, i) => {
			const form = participant.form;
			const name = form.first_name + ' ' + form.last_name;
			return (
				<div
					className={classes.Row}
					key={i}
					data-cy={`exam-sessions-table-row-${i}`}

				>
					<p>{name}</p>
					<p>Muu tieto</p>
					<p>Muu tieto</p>
					<p>Muu tieto</p>
				</div>
			)
		})
	};


	const errorMessage = (
		<div>
			Osallistujia ei voitu hakea
		</div>
	)

	const backLink = () => {
		const backText = '< Takaisin'
		return (
			<div className={classes.LinkStyle}>
				<p onClick={goBack}>{backText}</p>
			</div>
		)
	}

	const participantsTable = (
		<div>
			<>
				{participants.length > 0 ? (
					<div className={classes.Grid} data-cy="exam-sessions-table">
						<h4>Nimi</h4>
						<h4>Ilmoittautumisaika</h4>
						<h4>Tutkinto maksettu</h4>
						<h4>Oid</h4>
						{participantRows()}
					</div>
				) :
					(<p>Ei ilmoittautuneita</p>)}
			</>
		</div>
	)

	return (
		<>
			{showError
				? { errorMessage }
				: (<div>
					{backLink()}
					<div>
						Tasso, kieli ja päivämäärä
					</div>
					{participantsTable}
				</div>)}
		</>
	)
}

OrganizationSessionParticipants.propTypes = {
	participants: PropTypes.array.isRequired,
	session: PropTypes.shape({
		id: PropTypes.number.isRequired
	}).isRequired,
	goBack: PropTypes.func.isRequired
};

export default withTranslation()(OrganizationSessionParticipants);