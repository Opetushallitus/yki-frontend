import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import * as actions from '../../store/actions/index';
import * as registryUtil from '../../util/registryUtil.js'
import moment from 'moment';
import Page from '../../hoc/Page/Page';
import classes from './RegistryExamSessions.module.css';
import { Link } from 'react-router-dom';
import UpcomingAndPastExamSessions from '../../components/ExamSessions/ExamSessions';
import ParticipantList from '../../components/ExamSessions/ParticipantList/ParticipantList';
import Spinner from '../../components/UI/Spinner/Spinner';
import Modal from '../../components/UI/Modal/Modal';
import { getLanguagesWithLevelDescriptions } from '../../util/util';
import { DATE_FORMAT } from '../../common/Constants';
import ExamSessionOrganizer from '../../components/ExamSessionOrganizer/ExamSessionOrganizer.js'

class RegistryExamSessions extends PureComponent {
	state = {
		registryItem: null,
		organizationNotFound: null,
		selectedSession: null,
		shownParticipants: null,
		showModal: false,
	};

	getOrganizationFromRegistry = () => {
		if (!this.state.registryItem && !this.state.organizationNotFound && this.props.orgRegistry.length > 0) {
			const oid = this.props.match.params.oid;
			let matchingRegistryItem;
			for (const index in this.props.orgRegistry) {
				const organization = this.props.orgRegistry[index].organization
				if (organization && organization.oid === oid) {
					matchingRegistryItem = this.props.orgRegistry[index];
					break;
				}
			}
			if (matchingRegistryItem) {
				this.setState({ registryItem: matchingRegistryItem });
			} else {
				this.setState({ organizationNotFound: true });
			}
		}
	}

	componentDidMount = () => {
		this.props.match.params.oid && this.props.onFetchExamSessions(this.props.match.params.oid);
		if (this.props.orgRegistry.length === 0) {
			this.props.onFetchRegistryContent()
		}
		this.getOrganizationFromRegistry()
	};

	componentDidUpdate = (prevProps, prevState) => {
		if (!prevState.selectedSession && this.state.selectedSession) {
			this.props.onFetchSessionParticipants(this.props.match.params.oid, this.state.selectedSession.id)
		}

		this.getOrganizationFromRegistry()
	};

	selectSessionHandler = session =>
		this.setState({ selectedSession: session });

	clearSessionHandler = () => {
		this.setState({ selectedSession: null });
	}

	render() {
		const { sessions, participants } = this.props;
		const backLinkText = `< ${this.props.t('registry.examSessions.back')}`;

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

		const getLocationName = () => {
			if (!this.state.selectedSession) return '';
			return this.state.selectedSession.location && this.state.selectedSession.location[0]
				? this.state.selectedSession.location[0].name
				: '';
		}

		const sessionInfo = (
			<>
				{this.state.selectedSession && <>
					<h1>
						{getLocationName()}
					</h1>
					<h2>
						{this.props.t('examSession')}
						{': '}
						{getLanguagesWithLevelDescriptions([
							this.state.selectedSession,
						])[0].toLowerCase()}{' '}
						{moment(this.state.selectedSession.session_date).format(DATE_FORMAT)}
					</h2>
				</>}
			</>
		)

		const backLink = (
			<Link
				to={{ pathname: '/jarjestajarekisteri' }}
				className={classes.LinkStyle}>
				{backLinkText}
			</Link>
		)

		const organizationNotFoundComponent = (
			<div className={classes.Content}>
				{backLink}
				<h1>{this.props.t('registry.examSession.organizationNotFound')}</h1>
			</div>
		)

		const examSessionsComponent = (
			<>{
				loadingSessions()
					? <Spinner />
					: <UpcomingAndPastExamSessions
						examSessions={sessions}
						examSessionSelected={this.selectSessionHandler}
					/>
			}</>
		)

		const participantsModal = (
			<Modal
				show={!!this.state.selectedSession}
				modalClosed={this.clearSessionHandler}
			>
				<>
					{loadingParticipants()
						? <Spinner />
						: <>{this.state.selectedSession &&
							<>
								{sessionInfo}
								<ParticipantList
									examSession={this.state.selectedSession}
									participants={participants}
									examSessions={this.props.sessions}
									isAdminView={true}
								/>
							</>
						}
						</>}
				</>
			</Modal>
		)

		const organisationHeaderComponent = () => {
			if (!this.state.registryItem) return null;
			const { organization, organizer } = this.state.registryItem;
			return (
				<>
					<h1>{organization
						&& organization.nimi
						&& registryUtil.getLocalizedName(organization.nimi)}</h1>
					<h3>
						<ExamSessionOrganizer
							hideContact={true}
							organization={organization}
							organizer={organizer}
						/>
					</h3>
				</>
			)

		}

		return (
			<Page>
				{participantsModal}
				{this.state.organizationNotFound
					? organizationNotFoundComponent
					: (<div className={classes.Content}>
						{backLink}
						{organisationHeaderComponent()}
						{examSessionsComponent}
					</div>)}
			</Page>

		);
	}
}

const mapStateToProps = state => {
	return {
		sessions: state.registryDetails.examSessions,
		participants: state.registryDetails.participants,
		loadingSessions: state.registryDetails.loadingExamSessions,
		loadingParticipants: state.registryDetails.loadingParticipants,
		orgRegistry: state.registry.registry,
		registryLoading: state.registry.loading,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onFetchExamSessions: oid =>
			dispatch(actions.fetchRegistryExamSessions(oid)),
		onFetchSessionParticipants: (oid, examSessionId) =>
			dispatch(actions.fetchRegistryExamSessionParticipants(oid, examSessionId)),
		onFetchRegistryContent: () =>
			dispatch(actions.fetchRegistryContent())
	};
};

RegistryExamSessions.propTypes = {
	sessions: PropTypes.array,
	participants: PropTypes.array,
	loadingSessions: PropTypes.bool,
	loadingParticipants: PropTypes.bool,
	onFetchExamSessions: PropTypes.func.isRequired,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(withTranslation()(RegistryExamSessions));
