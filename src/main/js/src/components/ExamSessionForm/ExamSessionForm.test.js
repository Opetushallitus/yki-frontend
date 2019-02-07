import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ExamSessionForm from './ExamSessionForm';

configure({ adapter: new Adapter() });

const organizationChildren = [];

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
  organization: {
    oid: '1.2.246.562.10.80191559571',
    nimi: {
      fi: 'Amiedu',
    },
  },
  organizationChildren: organizationChildren,
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
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: () => '' };
    return Component;
  },
}));

jest.mock('i18next', () => ({
  use: () => {
    return { init: () => {} };
  },
  t: k => k,
}));

describe('<ExamSessionForm />', () => {
  it('should render form with disabled submit button', () => {
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

  it('should render organization office selection if organization has children', () => {
    organizationChildren.push(
      {
        oid: '1.2.246.562.10.80191559573',
        nimi: {
          fi: 'Amiedu 2',
        },
      },
      {
        oid: '1.2.246.562.10.80191559574',
        nimi: {
          fi: 'Amiedu 3',
        },
      },
    );
    const form = mount(
      <ExamSessionForm
        onSubmit={onSubmitSpy}
        examSessionContent={examSessionContent}
      />,
    );
    expect(form.find('select').children()).toHaveLength(2);
  });
});
