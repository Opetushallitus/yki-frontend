import * as actionTypes from '../actions/actionTypes';

const initialState = {
	examSessions: [],
	participants: [],
	loadingExamSessions: false,
	loadingParticipants: false,
}

const reducer = (state = initialState, action) => {
	if (action.type.includes('FETCH_REGISTRY_EXAM_SESSIONS')) {
		switch (action.type) {
			case actionTypes.FETCH_REGISTRY_EXAM_SESSIONS_START:
				return {
					...state,
					loadingExamSessions: true,
				};
			case actionTypes.FETCH_REGISTRY_EXAM_SESSIONS_SUCCESS:
				return {
					...state,
					loadingExamSessions: false,
					examSessions: action.examSessions
				};
			case actionTypes.FETCH_REGISTRY_EXAM_SESSIONS_FAIL:
				return {
					...state,
					loadingExamSessions: false,
				};
			default:
				return state;
		}
	} else if (action.type.includes('FETCH_REGISTRY_EXAM_SESSION_PARTICIPANTS')) {
		switch (action.type) {
			case actionTypes.FETCH_REGISTRY_EXAM_SESSION_PARTICIPANTS_START:
				return {
					...state,
					loadingParticipants: true,
				};
			case actionTypes.FETCH_REGISTRY_EXAM_SESSION_PARTICIPANTS_SUCCESS:
				return {
					...state,
					loadingParticipants: false,
					participants: action.participants
				};
			case actionTypes.FETCH_REGISTRY_EXAM_SESSION_PARTICIPANTS_FAIL:
				return {
					...state,
					loadingParticipants: false,
				};
			default:
				return state;
		}
	}
	else {
		return state;
	}
}

export default reducer;