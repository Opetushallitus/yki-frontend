import moment from 'moment';
import {examSessionParticipantsCount} from "./examSessionUtil";

describe('examSessionParticipantsCount', () => {
    const tomorrow = moment().add(1, 'days');
    const yesterday = moment().subtract(1, 'days');
    it('should use max_participants without post admission', () => {
        const e = {
            registration_end_date: tomorrow,
            participants: 45,
            max_participants: 100,
        };
        expect(examSessionParticipantsCount(e)).toEqual({participants: 45, maxParticipants: 100});
    });

    it('should use max_participants still when registration is open', () => {
        const e = {
            registration_end_date: tomorrow,
            participants: 45,
            max_participants: 100,
            post_admission_start_date: tomorrow.add(1, 'days'),
            post_admission_end_date: tomorrow.add(10, 'days'),
            post_admission_active: true,
            post_admission_quota: 5,
            pa_participants: 0,
        };
        expect(examSessionParticipantsCount(e)).toEqual({participants: 45, maxParticipants: 100});
    });

    it('should use pa_quota and participants as max_participants when registration passed', () => {
        const e = {
            registration_end_date: yesterday,
            participants: 45,
            max_participants: 100,
            post_admission_start_date: tomorrow.add(1, 'days'),
            post_admission_end_date: tomorrow.add(10, 'days'),
            post_admission_active: true,
            post_admission_quota: 5,
            pa_participants: 0,
        };
        expect(examSessionParticipantsCount(e)).toEqual({participants: 45, maxParticipants: 50});
    });

    it('should use pa_quota and participants as max_participants and count both participants and pa_participants', () => {
        const e = {
            registration_end_date: yesterday,
            participants: 45,
            max_participants: 100,
            post_admission_start_date: tomorrow.add(1, 'days'),
            post_admission_end_date: tomorrow.add(10, 'days'),
            post_admission_active: true,
            post_admission_quota: 5,
            pa_participants: 4,
        };
        expect(examSessionParticipantsCount(e)).toEqual({participants: 49, maxParticipants: 50});
    });
})
