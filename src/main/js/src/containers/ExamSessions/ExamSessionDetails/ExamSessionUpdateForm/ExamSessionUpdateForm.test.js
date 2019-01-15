import React from 'react';
import { configure, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';

import { ExamSessionUpdateForm } from './ExamSessionUpdateForm';

configure({ adapter: new Adapter() });

const examSession = {
  registration_end_date: '2028-12-15',
  session_date: '2028-12-30',
  participants: 2,
  max_participants: 50,
  registration_start_date: '2028-09-01',
  language_code: 'eng',
  level_code: 'KESKI',
  location: [
    {
      lang: 'fi',
      extra_information: null,
      name: 'Omenia',
      other_location_info: 'auditorio A2',
      address: 'Jokukatu 4, 00100 Tammerfors',
    },
  ],
};

describe('<ExamSessionUpdateForm />', () => {
  it('should render form', () => {
    const wrapper = render(
      <ExamSessionUpdateForm
        examSession={examSession}
        t={t => t}
        onSubmit={jest.fn()}
        onDelete={jest.fn()}
      />,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
