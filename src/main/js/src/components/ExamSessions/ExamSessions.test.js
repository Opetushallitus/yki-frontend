import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';

import { upcomingAndPastExamSessions as UpcomingAndPastExamSessions } from './ExamSessions';

configure({ adapter: new Adapter() });

const examSessions = [
  {
    registration_end_date: '2028-12-15',
    session_date: '2028-12-30',
    participants: 50,
    pa_participants: 0,
    max_participants: 50,
    registration_start_date: '2018-09-01',
    language_code: 'eng',
    level_code: 'KESKI',
  },
  {
    registration_end_date: '2025-12-15',
    session_date: '2028-05-30',
    participants: 0,
    pa_participants: 0,
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

describe('<UpcomingAndPastExamSessions />', () => {
  it('should render exam session rows', () => {
    const wrapper = shallow(
      <UpcomingAndPastExamSessions
        t={key => key}
        examSessions={examSessions}
        examSessionSelected={jest.fn()}
      />,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
