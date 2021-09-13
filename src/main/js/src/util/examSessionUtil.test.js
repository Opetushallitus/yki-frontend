import moment from 'moment';
import {examSessionParticipantsCount} from "./examSessionUtil";

describe('examSessionParticipantsCount', () => {
    const tomorrow = moment().add(1, 'days');
    const yesterday = moment().subtract(1, 'days');
    it('should use max_participants', () => {
        const e = {
            post_admission_enabled: false,
            registration_end_date: tomorrow,
            participants: 45,
            max_participants: 100,
            post_admission_quota: null,
            pa_participants: null
        };
        expect(examSessionParticipantsCount(e)).toEqual({participants: 45, max_participants: 100});
    });

    it('should use max_participants still when registration is open', () => {
        const e = {
            post_admission_enabled: true,
            registration_end_date: tomorrow,
            participants: 45,
            max_participants: 100,
            post_admission_quota: 5,
            pa_participants: 0
        };
        expect(examSessionParticipantsCount(e)).toEqual({participants: 45, max_participants: 100});
    });

    it('should use pa_quota and participants as max_participants when registration passed', () => {
        const e = {
            post_admission_enabled: true,
            registration_end_date: yesterday,
            participants: 45,
            max_participants: 100,
            post_admission_quota: 5,
            pa_participants: 0
        };
        expect(examSessionParticipantsCount(e)).toEqual({participants: 45, max_participants: 50});
    });

    it('should use pa_quota and participants as max_participants and count both participants and pa_participants', () => {
        const e = {
            post_admission_enabled: true,
            registration_end_date: yesterday,
            participants: 45,
            max_participants: 100,
            post_admission_quota: 5,
            pa_participants: 4
        };
        expect(examSessionParticipantsCount(e)).toEqual({participants: 49, max_participants: 50});
    });

})