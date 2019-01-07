import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import ExamSessionForm from './ExamSessionForm';

configure({ adapter: new Adapter() });

const examSessionContent = {
  organizer: {
    languages: [
      {
        language_code: 'fin',
        level_code: 'PERUS',
      },
      {
        language_code: 'swe',
        level_code: 'KESKI',
      },
      {
        language_code: 'fin',
        level_code: 'YLIN',
      },
    ],
  },
  organization: { nimi: 'Test org' },
  examSessions: [
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
  ],
  examDates: [
    {
      exam_date: '2019-01-27',
      registration_start_date: '2018-12-01',
      registration_end_date: '2018-12-08',
      languages: [{ language_code: 'fin' }],
    },
    {
      exam_date: '2019-10-27',
      registration_start_date: '2019-09-03',
      registration_end_date: '2019-09-28',
      languages: [{ language_code: 'swe' }],
    },
  ],
};

const onSubmitSpy = jest.fn();

jest.mock('react-i18next', () => ({
  withNamespaces: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: () => '' };
    return Component;
  },
}));

describe('<ExamSessionForm />', () => {
  it('should render form', () => {
    const form = mount(
      <ExamSessionForm
        onSubmit={onSubmitSpy}
        examSessionContent={examSessionContent}
      />,
    );
    expect(form.find('.Form').exists()).toBeTruthy();
    expect(form.find('.Button').prop('disabled')).toBeTruthy();

    expect(form.find('[htmlFor="fin"]').text()).toEqual('suomi');
  });
});
