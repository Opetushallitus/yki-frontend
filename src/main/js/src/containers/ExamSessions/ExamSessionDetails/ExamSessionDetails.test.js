import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';

import { ExamSessionDetails } from './ExamSessionDetails';

configure({ adapter: new Adapter() });

const oid = "222.222.11.11.11";

const examSession = {
  registration_end_date: '2028-12-15',
  session_date: '2028-12-30',
  participants: 2,
  max_participants: 50,
  registration_start_date: '2018-09-01',
  language_code: 'eng',
  level_code: 'KESKI',
  location: [
    {
      lang: 'fi',
      name: 'Amiedu, Strömberginkuja 3',
    },
  ],
};

describe('<ExamSessionDetails />', () => {
  it('should render exam session details', () => {
    const wrapper = shallow(
      <ExamSessionDetails
        examSession={examSession}
        participants={[]}
        loading={false}
        t={t => t}
        oid={oid}
        onFetchExamSessionParticipants={jest.fn()}
        onSubmitUpdateExamSession={jest.fn()}
        onSubmitDeleteExamSession={jest.fn()}
      />,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
