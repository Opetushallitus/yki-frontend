import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { upcomingExamSessions as UpcomingExamSessions } from './UpcomingExamSessions';

configure({ adapter: new Adapter() });

const examSessions = [
  {
    registration_end_date: '2028-12-15',
    session_date: '2028-12-30',
    participants: 50,
    max_participants: 50,
    registration_start_date: '2018-09-01',
    language_code: 'eng',
    level_code: 'KESKI',
  },
  {
    registration_end_date: '2025-12-15',
    session_date: '2028-05-30',
    participants: 0,
    max_participants: 30,
    registration_start_date: '2028-03-01',
    language_code: 'fin',
    level_code: 'PERUS',
  },
];

jest.mock('i18next', () => ({
  use: () => {
    return { init: () => {} };
  },
  t: k => k,
}));

describe('<UpcomingExamSessions />', () => {
  it('should render 2 exam session rows', () => {
    const wrapper = shallow(
      <UpcomingExamSessions t={key => key} examSessions={examSessions} />,
    );

    expect(wrapper.find('.ExamSessionList').exists()).toBeTruthy();
    expect(wrapper.find('.Row')).toHaveLength(2);
  });
});
