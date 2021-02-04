import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Modal from '../../../components/UI/Modal/Modal';
import UpcomingExamSessions from '../../../components/UpcomingExamSessions/UpcomingExamSessions';
import OrganizationSessionParticipants from '../../../components/OrganizationSessionParticipants/OrganizationSessionParticipants';
import * as actions from '../../../store/actions/index';

class RegistryOrgModal extends PureComponent {

	state = {
		selectedSession: null,
		shownParticipants: null,
	};

	componentDidMount = () => {
		this.props.organization && this.props.onFetchExamSessions(this.props.organization.oid);
	};

	componentDidUpdate = (prevProps, prevState) => {
		if (!prevState.selectedSession && this.state.selectedSession) {
			this.props.onFetchSessionParticipants(this.props.organization.oid, this.state.selectedSession.id)
		}
	};

	selectSessionHandler = session =>
		this.setState({ selectedSession: session });

	clearSessionHandler = () => {
		this.setState({ selectedSession: null });
	}

	render() {
		const { organization, sessions, participants, showModal, closeModal } = this.props;

		const loadingSessions = () => {
			if (this.props.loadingSessions || !sessions) {
				return true;
			}
			return false;
		}

		const loadingParticipants = () => {
			if (this.props.loadingParticipants || !participants) {
				return true;
			}
			return false;
		}

		const examSessionsComponent = (
			<>{
				loadingSessions()
					? <div>Haetaan tilaisuuksia</div>
					: <UpcomingExamSessions
						examSessions={sessions}
						examSessionSelected={this.selectSessionHandler}
					/>
			}</>
		)

		const examSessionParticipantsComponent = (
			<>{
				loadingParticipants()
					? <div>Haetaan osallistujia</div>
					: <OrganizationSessionParticipants
						participants={participants}
						session={this.state.selectedSession}
						goBack={this.clearSessionHandler}
					/>
			}</>
		)

		const bodyContent = () => {
			return this.state.selectedSession
				? examSessionParticipantsComponent
				: examSessionsComponent;

		}

		return (
			<>
				{showModal &&
					<Modal
						show={showModal}
						modalClosed={closeModal}
					>
						<div>
							<h1 style={{ marginBlockStart: '0' }}>{organization.name}</h1>
						</div>
						{bodyContent()}
					</Modal>
				}
			</>
		);
	}
}

const mapStateToProps = state => {
	return {
		sessions: state.orgDetails.examSessions,
		participants: state.orgDetails.participants,
		loadingSessions: state.orgDetails.loadingExamSessions,
		loadingParticipants: state.orgDetails.loadingParticipants,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onFetchExamSessions: oid =>
			dispatch(actions.fetchOrgExamSessions(oid)),
		onFetchSessionParticipants: (oid, examSessionId) =>
			dispatch(actions.fetchOrgExamSessionParticipants(oid, examSessionId))
	};
};

RegistryOrgModal.propTypes = {
	organization: PropTypes.shape({
		oid: PropTypes.string.isRequired
	}).isRequired,
	sessions: PropTypes.array,
	participants: PropTypes.array,
	showModal: PropTypes.bool,
	loadingSessions: PropTypes.bool,
	loadingParticipants: PropTypes.bool,
	closeModal: PropTypes.func.isRequired,
	onFetchExamSessions: PropTypes.func.isRequired,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(withTranslation()(RegistryOrgModal));
