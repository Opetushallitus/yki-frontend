import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';

import { ExamSessionDetails } from './ExamSessionDetails';

configure({ adapter: new Adapter() });

const examSession = {
  registration_end_date: '2028-12-15',
  session_date: '2028-12-30',
  participants: 2,
  max_participants: 50,
  registration_start_date: '2018-09-01',
  language_code: 'eng',
  level_code: 'KESKI',
};

describe('<ExamSessionDetails />', () => {
  it('should render exam session details', () => {
    const wrapper = shallow(
      <ExamSessionDetails
        examSession={examSession}
        participants={[]}
        loading={false}
        t={t => t}
        onFetchExamSessionParticipants={jest.fn()}
        onCancelRegistration={jest.fn()}
        errorConfirmedHandler={jest.fn()}
        onSubmitUpdateExamSession={jest.fn()}
        onSubmitDeleteExamSession={jest.fn()}
        onRelocate={jest.fn()}
      />,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
