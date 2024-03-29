const bodyParser = require('body-parser');
const fs = require('fs');
const axios = require('axios');
const moment = require('moment');

const getCurrentTime = () => {
  const tzoffset = new Date().getTimezoneOffset() * 60000;
  const localISOTime = new Date(Date.now() - tzoffset)
    .toISOString()
    .slice(0, -1);
  return localISOTime;
};

const printError = (req, err) => {
  console.log(
    '\n Error in: ' +
      req.method +
      ': ' +
      req.originalUrl +
      '\n' +
      req.body +
      '\n From ' +
      (err.config && err.config.url) +
      '\n Message: ' +
      err.message +
      '\n Response data: ' +
      (err.response && JSON.stringify(err.response.data)),
  );
};

const useLocalProxy = process.env.REACT_APP_USE_LOCAL_PROXY_BACKEND === 'true';

const getExamDates = () => {
  return JSON.parse(fs.readFileSync('./dev/rest/examSessions/examDates.json'));
};

let examDates = getExamDates();

const getExamSessions = () => {
  return JSON.parse(
    fs.readFileSync('./dev/rest/examSessions/examSessions.json'),
  );
};

let examSessions = getExamSessions();

const getAllExamSessions = () => {
  return JSON.parse(
    fs.readFileSync('./dev/rest/examSessions/allExamSessions.json'),
  );
};

let allExamSessions = getAllExamSessions();

const getRegistrations = () => {
  return JSON.parse(
    fs.readFileSync('./dev/rest/examSessions/registrations.json'),
  );
};

const findByOids = () => {
  return JSON.parse(fs.readFileSync('./dev/rest/organization/findbyoids.json'));
};

let organizations = findByOids();

let registrations = {
  1: getRegistrations(),
  2: { participants: [] },
  3: { participants: [] },
};

const countries = JSON.parse(
  fs.readFileSync('./dev/rest/codes/maatjavaltiot2.json'),
);

const genders = JSON.parse(fs.readFileSync('./dev/rest/codes/sukupuoli.json'));

const evaluationPeriods = JSON.parse(
  fs.readFileSync('./dev/rest/registration/evaluationPeriods.json'),
);

const paymentsReport = JSON.parse(fs.readFileSync('./dev/rest/examPayments/paymentsReport.json'))

let organizers = [
  {
    oid: '1.2.246.562.10.28646781493',
    agreement_start_date: '2018-01-01',
    agreement_end_date: '2029-01-01',
    contact_name: 'Iida Ikola',
    contact_email: 'iida.ikola@amiedu.fi',
    contact_phone_number: '0101234546',
    languages: [
      {
        language_code: 'fin',
        level_code: 'PERUS',
      },
      {
        language_code: 'fin',
        level_code: 'KESKI',
      },
      {
        language_code: 'fin',
        level_code: 'YLIN',
      },
      {
        language_code: 'deu',
        level_code: 'YLIN',
      },
      {
        language_code: 'sme',
        level_code: 'PERUS',
      },
      {
        language_code: 'sme',
        level_code: 'KESKI',
      },
    ],
    extra: 'Yleinen sähköpostilista: yki@amiedu.fi',
  },
  {
    oid: '1.2.246.562.10.39706139522',
    agreement_start_date: '2018-01-01T00:00:00.000Z',
    agreement_end_date: '2029-01-01T00:00:00.000Z',
    contact_name: 'Ismo Supinen',
    contact_email: 'ismo.supinen@jkl.fi',
    contact_phone_number: '01412345467',
    languages: null,
    extra: 'Sisäänkäynti hämyiseltä sivuovelta',
  },
];

const quarantineMatches = {
  quarantine_matches: [{
    quarantine_lang: 'fin',
    birthdate: '2018-02-01',
    email: 'email@invalid.invalid',
    language_code: 'fin',
    phone_number: '0401234567',
    quarantine_id: null,
    reviewed: '2022-12-20T12:23:52.501Z',
    first_name: 'Max',
    last_name: 'Karenssi',
    ssn: '301079-900U',
    registration_id: 2,
    created: '2022-12-02T10:32:11.888Z',
    exam_date: '2025-03-10',
    id: 1,
    form: {
      email: 'email@invalid.invalid',
      birthdate: '2018-02-01',
      last_name: 'De Ilmoittautuminen',
      first_name: 'Max',
      phone_number: '0401234567'
    },
    state: 'COMPLETED'
  },
  {
    quarantine_lang: 'swe',
    birthdate: '1999-01-12',
    email: 'email@invalid.invalid',
    language_code: 'fin',
    phone_number: '0401234567',
    quarantine_id: null,
    reviewed: '2022-12-20T12:23:52.501Z',
    first_name: 'Max',
    last_name: 'Von Koskull',
    ssn: '120199-999X',
    registration_id: 2,
    created: '2022-12-02T10:32:11.888Z',
    exam_date: '2025-03-10',
    id: 2,
    form: {
      email: 'email@invalid.invalid',
      birthdate: '1999-01-12',
      ssn: '120199-999X',
      last_name: 'De Ilmoittautuminen',
      first_name: 'Max',
      phone_number: '0401234567'
    },
    state: 'COMPLETED'
  }]
}

const quarantineReviews = {
  reviews: [{
    quarantine_lang: 'fin',
    birthdate: '1979-10-30',
    email: 'email@invalid.invalid',
    language_code: 'fin',
    phone_number: '0401234567',
    quarantine_id: 1,
    is_quarantined: false,
    reviewed: '2022-12-20T12:23:52.501Z',
    first_name: 'Max',
    last_name: 'Von Karenssi',
    ssn: '301079-900U',
    registration_id: 2,
    created: '2022-12-02T10:32:11.888Z',
    exam_date: '2025-03-10',
    id: 1,
    form: {
      email: 'email@invalid.invalid',
      birthdate: '1979-10-30',
      last_name: 'De Ilmoittautuminen',
      first_name: 'Max',
      phone_number: '0401234567',
      ssn: '120199-999X'
    },
    state: 'COMPLETED'
  },
  {
    quarantine_lang: 'fin',
    email: 'email@invalid.invalid',
    language_code: 'fin',
    phone_number: '0401234567',
    quarantine_id: 2,
    is_quarantined: true,
    reviewed: '2022-12-20T12:23:52.501Z',
    first_name: 'Max',
    last_name: 'Von Karenssi',
    ssn: '301079-900U',
    registration_id: 3,
    created: '2022-12-02T10:32:11.888Z',
    exam_date: '2025-03-10',
    id: 2,
    form: {
      email: 'email@invalid.invalid',
      birthdate: '1979-10-30',
      ssn: '301079-900U',
      last_name: 'Von Karenssi',
      first_name: 'Max',
      phone_number: '0401234567'
    },
    state: 'SUBMITTED'
  }]
};

const quarantines = {
  quarantines: [{
    language_code: 'fin',
    birthdate: '1979-10-30',
    email: 'email@invalid.invalid',
    phone_number: '0401234567',
    ssn: '301079-900U',
    created: '2022-12-02T10:32:11.888Z',
    start_date: '2023-01-01',
    end_date: '2024-01-01',
    id: 1,
    last_name: 'Syöttöpaine',
    first_name: 'Max',
    diary_number: 'OPH-feikki-123',
  },
  {
    language_code: 'swe',
    birthdate: '1979-10-30',
    email: 'email@invalid.invalid',
    phone_number: '0401234567',
    ssn: '301079-900U',
    created: '2022-12-02T10:32:11.888Z',
    start_date: '2023-01-01',
    end_date: '2023-08-17',
    id: 2,
    last_name: 'Testitapaus',
    first_name: 'Tessa',
    diary_number: 'OPH-feikki-456',
  },
  {
    language_code: 'eng',
    birthdate: '1979-10-30',
    email: 'email@invalid.invalid',
    phone_number: '0401234567',
    ssn: '301079-900U',
    created: '2022-12-02T10:32:11.888Z',
    start_date: '2023-07-01',
    end_date: '2024-06-01',
    id: 3,
    last_name: 'Ankka',
    first_name: 'Aku',
    diary_number: 'OPH-feikki-789',
  },
  {
    language_code: 'eng',
    birthdate: '1979-10-30',
    email: 'email@invalid.invalid',
    phone_number: '0401234567',
    ssn: '301079-900U',
    created: '2022-12-02T10:32:11.888Z',
    start_date: '2023-06-01',
    end_date: '2024-06-01',
    id: 4,
    last_name: 'Aalborg',
    first_name: 'Akvavit',
    diary_number: 'OPH-feikki-999',
  },
  ]
};

const initialOrganizers = [...organizers];

const adminUser = {
  identity: {
    username: 'ykitestaaja',
    oid: '1.2.246.562.24.98107285507',
    organizations: [
      {
        oid: '1.2.246.562.10.00000000001',
        permissions: [{ palvelu: 'YKI', oikeus: 'YLLAPITAJA' }],
      },
    ],
    lang: 'fi',
  },
};

const getNumberBetween = (min, max) =>
  Math.trunc(Math.random() * (max - min) + min);


module.exports = function(app) {
  const getUrl = req => {
    console.log(
      '--> Forward to: ' + process.env.REACT_APP_LOCAL_PROXY + req.originalUrl,
    );
    return process.env.REACT_APP_LOCAL_PROXY + req.originalUrl;
  };

  const resolveCall = (call, req, res) => {
    call
      .then(response => {
        res.send(response.data);
      })
      .catch(err => {
        printError(req, err);
        res.status(404).send(err.response.data);
      });
  };

  const proxyGetCall = (req, res) => {
    resolveCall(axios.get(getUrl(req), req.body), req, res);
  };
  const proxyPostCall = (req, res) => {
    resolveCall(axios.post(getUrl(req), req.body), req, res);
  };

  const proxyPutCall = (req, res) => {
    resolveCall(axios.put(getUrl(req), req.body), req, res);
  };

  const proxyDeleteCall = (req, res) => {
    resolveCall(axios.delete(getUrl(req), req.body), req, res);
  };

  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));

  app.use((req, res, next) => {
    if (
      req.originalUrl.indexOf('/yki/api') === 0 ||
      req.originalUrl.indexOf('/organisaatio-service')
    ) {
      if (!process.env.CI) {
        // eslint-disable-next-line
        console.log(
          '\nTime:',
          getCurrentTime(),
          req.method + ': ' + req.originalUrl,
          '\n',
          JSON.stringify(req.body),
        );
        if (req.query.delay) {
          return setTimeout(
            next,
            parseInt(req.query.delay, 10) || getNumberBetween(500, 1500),
          );
        }
      }
    }
    next();
  });

  app.get('/yki/reset-mocks', (req, res) => {
    examSessions = getExamSessions();
    examDates = getExamDates();
    organizations = findByOids();

    registrations = {
      1: getRegistrations(),
      2: { participants: [] },
      3: { participants: [] },
    };
    organizers = [...initialOrganizers];
    res.send({ success: true });
  });

  app.get('/yki/api/virkailija/quarantine/matches', (req, res) => {
    const mockCall = () => {
      try {
        res.send(quarantineMatches);
      } catch (err) {
        printError(req, err);
        res.status(404).send(err.message);
      }
    };
    useLocalProxy ? proxyGetCall(req, res) : mockCall();
  });

  app.get('/yki/api/virkailija/quarantine/reviews', (req, res) => {
    const mockCall = () => {
      try {
        res.send(quarantineReviews);
      } catch (err) {
        printError(req, err);
        res.status(404).send(err.message);
      }
    };
    useLocalProxy ? proxyGetCall(req, res) : mockCall();
  });

  app.get('/yki/api/virkailija/quarantine', (req, res) => {
    const mockCall = () => {
      try {
        res.send(quarantines);
      } catch (err) {
        printError(req, err);
        res.status(404).send(err.message);
      }
    };
    useLocalProxy ? proxyGetCall(req, res) : mockCall();
  });

  app.post('/yki/api/virkailija/quarantine', (req, res) => {
    const mockCall = () => {
      try {
        res.send({ organizers: organizers });
      } catch (err) {
        printError(req, err);
        res.status(404).send(err.message);
      }
    };
    useLocalProxy ? proxyPostCall(req, res) : mockCall();
  });

  app.put('/yki/api/virkailija/quarantine/:id', (req, res) => {
    const mockCall = () => {
      try {
        res.send({ organizers: organizers });
      } catch (err) {
        printError(req, err);
        res.status(404).send(err.message);
      }
    };
    useLocalProxy ? proxyPutCall(req, res) : mockCall();
  });

  app.delete('/yki/api/virkailija/quarantine/:id', (req, res) => {
    const mockCall = () => {
      try {
        res.send({ organizers: organizers });
      } catch (err) {
        printError(req, err);
        res.status(404).send(err.message);
      }
    };
    useLocalProxy ? proxyDeleteCall(req, res) : mockCall();
  });

  app.put('/yki/api/virkailija/quarantine/:id/registration/:reg_id/set', (req, res) => {
    const mockCall = () => {
      try {
        res.send({ success: true });
      } catch (err) {
        printError(req, err);
        res.status(404).send(err.message);
      }
    };

    useLocalProxy ? proxyPutCall(req, res) : mockCall();
  });

  app.get('/yki/api/virkailija/organizer', (req, res) => {
    const mockCall = () => {
      try {
        res.send({ organizers: organizers });
      } catch (err) {
        printError(req, err);
        res.status(404).send(err.message);
      }
    };

    useLocalProxy ? proxyGetCall(req, res) : mockCall();
  });

  app.post('/yki/api/virkailija/organizer', (req, res) => {
    const mockCall = () => {
      try {
        organizers.push(req.body);
        res.send({ success: true });
      } catch (err) {
        printError(req, err);
        res.status(404).send(err.message);
      }
    };

    useLocalProxy ? proxyPostCall(req, res) : mockCall();
  });

  app.get('/yki/api/virkailija/organizer/:oid/exam-session', (req, res) => {
    const mockCall = () => {
      try {
        res.send(examSessions);
      } catch (err) {
        printError(req, err);
        res.status(404).send(err.message);
      }
    };

    useLocalProxy ? proxyGetCall(req, res) : mockCall();
  });

  app.get(
    '/yki/api/virkailija/organizer/:oid/exam-session/:id/registration',
    (req, res) => {
      const mockCall = () => {
        try {
          const { id } = req.params;
          res.send(registrations[id] || { participants: [] });
        } catch (err) {
          printError(req, err);
          res.status(404).send(err.message);
        }
      };
      useLocalProxy ? proxyGetCall(req, res) : mockCall();
    },
  );

  app.post('/yki/api/virkailija/organizer/:oid/exam-session', (req, res) => {
    const mockCall = () => {
      try {
        const id = getNumberBetween(1000, 100000);
        const examSession = req.body;
        const examDate = examDates.dates.find(
          d => d.exam_date === examSession.session_date,
        );
        const backendData = {
          id: id,
          participants: 0,
          registration_start_date: examDate.registration_start_date,
          registration_end_date: examDate.registration_end_date,
          organizer_oid: req.params.oid,
        };
        examSessions.exam_sessions.push(
          Object.assign(examSession, backendData),
        );
        res.send({ id: id });
      } catch (err) {
        printError(req, err);
        res.status(404).send(err.message);
      }
    };

    useLocalProxy ? proxyPostCall(req, res) : mockCall();
  });

  app.post(
    '/yki/api/virkailija/organizer/:oid/exam-session/:id/post-admission',
    (req, res) => {
      try {
        const postadmission = req.body;
        const requestPostAdmissionId = req.params.id;
        const examSessionIndex = examSessions.exam_sessions.findIndex(
          x => x.id == requestPostAdmissionId,
        );
        const examsSession = examSessions.exam_sessions[examSessionIndex];

        examsSession.post_admission_quota = postadmission.post_admission_quota;
        examsSession.post_admission_start_date =
          postadmission.post_admission_start_date;
        examsSession.post_admission_active =
          postadmission.post_admission_active;

        res.send({ success: true });
      } catch (err) {
        printError(req, err);
        res.status(404).send(err.message);
      }
    },
  );

  app.post(
    '/yki/api/virkailija/organizer/:oid/exam-session/:id/post-admission/activation',
    (req, res) => {
      try {
        const postadmissionstate = req.body.post_admission_active;
        const requestPostAdmissionId = req.params.id;
        const examSessionIndex = examSessions.exam_sessions.findIndex(
          x => x.id == requestPostAdmissionId,
        );
        const examsSession = examSessions.exam_sessions[examSessionIndex];

        examsSession.post_admission_active = postadmissionstate;

        res.send({ success: true });
      } catch (err) {
        printError(req, err);
        res.status(404).send(err.message);
      }
    },
  );

  app.post(
    '/yki/api/virkailija/organizer/:oid/exam-session/:examSessionId/registration/:id/resendConfirmation',
    (req, res) => {
      try {
        res.send({ success: true });
      } catch (err) {
        printError(req, err);
        res.status(404).send(err.message);
      }
    },
  );

  app.put('/yki/api/virkailija/organizer/:oid/exam-session/:id', (req, res) => {
    const mockCall = () => {
      try {
        const { id } = req.params;
        const foundIndex = examSessions.exam_sessions.findIndex(
          x => x.id == id,
        );
        examSessions.exam_sessions[foundIndex] = req.body;
        res.send({ success: true });
      } catch (err) {
        printError(req, err);
        res.status(404).send(err.message);
      }
    };

    useLocalProxy ? proxyPutCall(req, res) : mockCall();
  });

  app.delete(
    '/yki/api/virkailija/organizer/:oid/exam-session/:id',
    (req, res) => {
      const mockCall = () => {
        try {
          const { id } = req.params;
          const foundIndex = examSessions.exam_sessions.findIndex(
            x => x.id == id,
          );
          examSessions.exam_sessions.splice(foundIndex, 1);
          res.send({ success: true });
        } catch (err) {
          printError(req, err);
          res.status(404).send(err.message);
        }
      };

      useLocalProxy ? proxyDeleteCall(req, res) : mockCall();
    },
  );

  app.post(
    '/yki/api/virkailija/organizer/:oid/exam-session/:id/post-admission/activate',
    (req, res) => {
      const mockCall = () => {
        try {
          const { id } = req.params;
          const index = examSessions.exam_sessions.findIndex(x => x.id == id);
          examSessions.exam_sessions[index] = {
            ...examSessions.exam_sessions[index],
            ...req.body,
            post_admission_active: true,
          };
          res.send({ success: true });
        } catch (err) {
          printError(req, err);
          res.status(404).send(err.message);
        }
      };

      useLocalProxy ? proxyPostCall(req, res) : mockCall();
    },
  );

  app.post(
    '/yki/api/virkailija/organizer/:oid/exam-session/:id/post-admission/deactivate',
    (req, res) => {
      const mockCall = () => {
        try {
          const { id } = req.params;
          const index = examSessions.exam_sessions.findIndex(x => x.id == id);
          examSessions.exam_sessions[index] = {
            ...examSessions.exam_sessions[index],
            post_admission_active: false,
          };
          res.send({ success: true });
        } catch (err) {
          printError(req, err);
          res.status(404).send(err.message);
        }
      };
      useLocalProxy ? proxyPostCall(req, res) : mockCall();
    },
  );

  app.delete(
    '/yki/api/virkailija/organizer/:oid/exam-session/:examSessionId/registration/:id',
    (req, res) => {
      try {
        const { id, examSessionId } = req.params;
        const i = registrations[examSessionId].participants.findIndex(
          x => x.registration_id == id,
        );
        const newState = registrations[examSessionId].participants[i].state === 'COMPLETED'
          ? 'PAID_AND_CANCELLED'
          : 'CANCELLED';

        registrations[examSessionId].participants[i].state = newState;
        res.send({ success: true });
      } catch (err) {
        printError(req, err);
        res.status(404).send(err.message);
      }
    },
  );

  app.post(
    '/yki/api/virkailija/organizer/:oid/exam-session/:examSessionId/registration/:id/relocate',
    (req, res) => {
      const mockCall = () => {
        try {
          const { id, examSessionId } = req.params;
          const toId = req.body.to_exam_session_id;
          const foundIndex = registrations[
            examSessionId
          ].participants.findIndex(x => x.registration_id == id);
          const reg = registrations[examSessionId].participants[foundIndex];
          registrations[toId].participants.push(reg);
          registrations[examSessionId].participants.splice(foundIndex, 1);
          res.send({ success: true });
        } catch (err) {
          printError(req, err);
          res.status(404).send(err.message);
        }
      };

      useLocalProxy ? proxyPostCall(req, res) : mockCall();
    },
  );

  app.post(
    '/yki/api/virkailija/organizer/:oid/exam-session/:examSessionId/registration/:id/confirm-payment',
    (req, res) => {
      const mockCall = () => {
        try {
          const { id } = req.params;
          const registration = registrations.participants.find(
            x => x.registration_id == id,
          );
          registration.state = 'COMPLETED';
          res.send({ success: true });
        } catch (err) {
          res.status(404).send(err.message);
        }
      };

      useLocalProxy ? proxyPostCall(req, res) : mockCall();
    },
  );

  // need to proxy here because dev server bug: https://github.com/webpack/webpack-dev-server/issues/1440
  app.post(
    '/organisaatio-service/rest/organisaatio/v3/findbyoids',
    (req, res) => {
      const organisaatioServiceCall = () =>
        axios
          .post(
            'https://virkailija.untuvaopintopolku.fi/organisaatio-service/rest/organisaatio/v4/findbyoids',
            req.body,
          )
          .then(response => {
            res.send(response.data);
          })
          .catch(err => {
            printError(req, err);
            res.status(404).send(err.message);
          });

      const mockCall = () => {
        try {
          res.send(organizations);
        } catch (err) {
          printError(req, err);
          res.status(404).send(err.message);
        }
      };
      useLocalProxy ? organisaatioServiceCall() : mockCall();
    },
  );

  app.put('/yki/api/virkailija/organizer/:oid', (req, res) => {
    try {
      const { oid } = req.params;
      const index = organizers.map(o => o.oid).indexOf(oid);
      organizers[index] = req.body;
      res.send({ success: true });
    } catch (err) {
      printError(req, err);
      res.status(404).send('Organizer not found');
    }
  });

  app.delete('/yki/api/virkailija/organizer/:oid', (req, res) => {
    try {
      const { oid } = req.params;
      const index = organizers.map(o => o.oid).indexOf(oid);
      organizers.splice(index, 1);
      res.send({ success: true });
    } catch (err) {
      printError(req, err);
      res.status(404).send('Organizer not found');
    }
  });

  app.get('/yki/api/virkailija/organizer/:oid/exam-date', (req, res) => {
    const mockCall = () => {
      try {
        const history = req.query.from;
        res.set('Content-Type', 'application/json; charset=utf-8');
        const futureExamDates = history
          ? examDates.dates
          : examDates.dates.filter(d => {
              // return moment(d.registration_end_date).isSameOrAfter(moment());
              return moment(d.exam_date).isSameOrAfter(moment());
            });
        res.send({ dates: futureExamDates });
        // all exam dates
        // res.send({ dates: examDates.dates });
      } catch (err) {
        res.status(404).send(err.message);
      }
    };

    useLocalProxy ? proxyGetCall(req, res) : mockCall();
  });

  app.post('/yki/api/virkailija/organizer/:oid/exam-date', (req, res) => {
    const mockCall = () => {
      try {
        const id = getNumberBetween(100, 1000);
        examDates.dates.push({
          id,
          ...req.body,
        });
        res.send({ success: true });
      } catch (err) {
        printError(req, err);
        res.status(404).send(err.message);
      }
    };
    useLocalProxy ? proxyPostCall(req, res) : mockCall();
  });

  app.put('/yki/api/virkailija/organizer/:oid/exam-date/:id', (req, res) => {
    const mockCall = () => {
      try {
        const { id } = req.params;
        const index = examDates.dates.findIndex(x => x.id == id);
        const { exam_session_count } = examDates.dates[index];

        examDates.dates[index] = {
          ...req.body,
          id,
          exam_session_count,
        };
        res.send({ success: true });
      } catch (err) {
        printError(req, err);
        res.status(404).send(err.message);
      }
    };
    useLocalProxy ? proxyPutCall(req, res) : mockCall();
  });

  app.post(
    '/yki/api/virkailija/organizer/:oid/exam-date/:id/evaluation',
    (req, res) => {
      const mockCall = () => {
        try {
          const { id } = req.params;
          const index = examDates.dates.findIndex(x => x.id == id);
          examDates.dates[index] = {
            ...examDates.dates[index],
            ...req.body,
          };
          res.send({ success: true });
        } catch (err) {
          printError(req, err);
          res.status(404).send(err.message);
        }
      };
      useLocalProxy ? proxyPostCall(req, res) : mockCall();
    },
  );

  app.delete(
    '/yki/api/virkailija/organizer/:oid/exam-date/:id/',
    (req, res) => {
      const mockCall = () => {
        try {
          const { id } = req.params;
          const index = examDates.dates.findIndex(x => x.id == id);
          examDates.dates.splice(index, 1);
          res.send({ success: true });
        } catch (err) {
          printError(req, err);
          res.status(404).send(err.message);
        }
      };
      useLocalProxy ? proxyDeleteCall(req, res) : mockCall();
    },
  );

  app.get('/yki/api/exam-date', (req, res) => {
    const mockCall = () => {
      try {
        res.set('Content-Type', 'application/json; charset=utf-8');
        const futureExamDates = examDates.dates.filter(d => {
          // return moment(d.registration_end_date).isSameOrAfter(moment());
          return moment(d.exam_date).isSameOrAfter(moment());
        });
        res.send({ dates: futureExamDates });
        // all exam dates
        // res.send({ dates: examDates.dates });
      } catch (err) {
        res.status(404).send(err.message);
      }
    };

    useLocalProxy ? proxyGetCall(req, res) : mockCall();
  });

  app.get(
    '/yki/api/virkailija/organizer/:oid/exam-session/history',
    (req, res) => {
      try {
        res.set('Content-Type', 'application/json; charset=utf-8');
        const pastExamDates = examDates.dates.filter(d => {
          // return moment(d.registration_end_date).isSameOrBefore(moment());
          return moment(d.exam_date).isSameOrBefore(moment());
        });
        res.send({ dates: pastExamDates });
      } catch (err) {
        res.status(404).send(err.message);
      }
    },
  );


  app.get('/yki/auth/user', (req, res) => {
    try {
      res.set('Content-Type', 'application/json; charset=utf-8');
      res.send(adminUser);
    } catch (err) {
      printError(req, err);
      res.status(404).send(err.message);
    }
  });

  app.get('/yki/api/exam-session', (req, res) => {
    const mockCall = () => {
      try {
        res.set('Content-Type', 'application/json; charset=utf-8');
        const monthFromNow = moment()
          .add(1, 'months')
          .format('YYYY-MM-DD');
        const twoMonthFromNow = moment()
          .add(2, 'months')
          .format('YYYY-MM-DD');
        const weekInPast = moment()
          .subtract(1, 'weeks')
          .format('YYYY-MM-DD');
        const weekFromNow = moment()
          .add(1, 'weeks')
          .format('YYYY-MM-DD');
        const weekAndOneDayFromNow = moment()
          .add(1, 'weeks')
          .add(1, 'days')
          .format('YYYY-MM-DD');
        const monthMinusThreeDaysPast = moment()
          .add(1, 'months')
          .subtract(3, 'days')
          .format('YYYY-MM-DD');

        allExamSessions.exam_sessions.forEach(es => {
          if (es.session_date === '2019-04-06') {
            es.session_date = monthFromNow;
            es.registration_start_date = weekInPast;
            es.registration_end_date = weekFromNow;
            es.post_admission_start_date = weekAndOneDayFromNow;
            es.post_admission_end_date = monthMinusThreeDaysPast;
          }
          if (es.session_date === '2019-05-26') {
            es.session_date = twoMonthFromNow;
          }
        });
        res.send(allExamSessions);
      } catch (err) {
        res.status(404).send(err.message);
      }
    };

    useLocalProxy ? proxyGetCall(req, res) : mockCall();
  });

  app.get('/yki/api/exam-session/:id', (req, res) => {
    const mockCall = () => {
      try {
        const session = allExamSessions.exam_sessions.find(
          e => e.id === Number(req.params.id),
        );
        res.set('Content-Type', 'application/json; charset=utf-8');
        res.send(session);
      } catch (err) {
        printError(req, err);
        res.status(404).send(err.message);
      }
    };
    useLocalProxy ? proxyGetCall(req, res) : mockCall();
  });

  app.get('/yki/api/code/maatjavaltiot2', (req, res) => {
    const mockCall = () => {
      try {
        res.set('Content-Type', 'application/json; charset=utf-8');
        res.send(countries);
      } catch (err) {
        printError(req, err);
        res.status(404).send(err.message);
      }
    };
    useLocalProxy ? proxyGetCall(req, res) : mockCall();
  });

  app.get('/yki/api/code/sukupuoli', (req, res) => {
    const mockCall = () => {
      try {
        res.set('Content-Type', 'application/json; charset=utf-8');
        res.send(genders);
      } catch (err) {
        printError(req, err);
        res.status(404).send(err.message);
      }
    };
    useLocalProxy ? proxyGetCall(req, res) : mockCall();
  });

  app.get('/yki/api/code/posti/:id', (req, res) => {
    try {
      axios
        .get(
          `https://virkailija.untuvaopintopolku.fi/yki/api/code/posti/${req.params.id}`,
          req.body,
        )
        .then(response => {
          res.send(response.data);
        })
        .catch(err => {
          printError(req, err);
          res.status(404).send(err.message);
        });
    } catch (err) {
      res.status(404).send(err.message);
    }
  });

  app.get('/yki/api/evaluation', (req, res) => {
    const mockCall = () => {
      try {
        res.send(evaluationPeriods);
      } catch (err) {
        printError(req, err);
        res.status(404).send(err.message);
      }
    };
    useLocalProxy ? proxyGetCall(req, res) : mockCall();
  });

  app.get('/yki/api/evaluation/:id', (req, res) => {
    const mockCall = () => {
      try {
        res.send(evaluationPeriods[0]);
      } catch (err) {
        printError(req, err);
        res.status(404).send(err.message);
      }
    };
    useLocalProxy ? proxyGetCall(req, res) : mockCall();
  });

  app.get('/yki/api/payment/v2/report', (req, res) => {
    const mockCall = () => {
      try {
        res.send(paymentsReport);
      } catch (err) {
        printError(req, err);
        res.status(404).send(err.message);
      }
    };
    useLocalProxy ? proxyGetCall(req, res) : mockCall();
  });
};
