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

const examDates = JSON.parse(
  fs.readFileSync('./dev/rest/examSessions/examDates.json'),
);

const initRegistration = JSON.parse(
  fs.readFileSync('./dev/rest/registration/registrationInit.json'),
);

const initRegistrationEmailAuth = JSON.parse(
  fs.readFileSync('./dev/rest/registration/registrationInitEmailAuth.json'),
);

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

let registrations = getRegistrations();

const countries = JSON.parse(
  fs.readFileSync('./dev/rest/codes/maatjavaltiot2.json'),
);

const genders = JSON.parse(
  fs.readFileSync('./dev/rest/codes/sukupuoli.json'),
);

const postOffice = JSON.parse(
  fs.readFileSync('./dev/rest/codes/posti.json'),
);

const organizers = [
  {
    oid: '1.2.246.562.10.28646781493',
    agreement_start_date: '2018-01-01T00:00:00.000Z',
    agreement_end_date: '2029-01-01T00:00:00.000Z',
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

const paymentFormData = {
  uri: 'https://payment.paytrail.com/e2',
  params: {
    MERCHANT_ID: 13466,
    URL_SUCCESS: 'https://yki.untuvaopintopolku.fi/yki/payment/payment/success',
    AMOUNT: '100.00',
    PARAMS_OUT:
      'ORDER_NUMBER,PAYMENT_ID,AMOUNT,TIMESTAMP,STATUS,PAYMENT_METHOD,SETTLEMENT_REFERENCE_NUMBER,LOCALE',
    URL_CANCEL: 'https://yki.untuvaopintopolku.fi/yki/payment/payment/cancel',
    LOCALE: 'fi_FI',
    AUTHCODE:
      '708C62459471D5AA42381A7284BE4EFFCC73906604CAE92B694F5D393E69B5F6',
    PARAMS_IN:
      'MERCHANT_ID,LOCALE,URL_SUCCESS,URL_CANCEL,URL_NOTIFY,AMOUNT,ORDER_NUMBER,MSG_SETTLEMENT_PAYER,MSG_UI_MERCHANT_PANEL,PARAMS_IN,PARAMS_OUT',
    MSG_SETTLEMENT_PAYER: 'tutkintomaksu_fi',
    URL_NOTIFY: 'https://yki.untuvaopintopolku.fi/yki/payment/payment/notify',
    MSG_UI_MERCHANT_PANEL: 'tutkintomaksu_fi',
    ORDER_NUMBER: 123456,
  },
};

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

const organizerUser = {
  identity: {
    username: 'ykijarjestaja',
    oid: '1.2.246.562.24.62800798482',
    organizations: [
      {
        oid: '1.2.246.562.10.28646781493',
        permissions: [{ palvelu: 'YKI', oikeus: 'JARJESTAJA' }],
      },
    ],
    lang: 'fi',
  },
};

const unauthenticatedUser = {
  identity: null,
};

const getNumberBetween = (min, max) =>
  Math.trunc(Math.random() * (max - min) + min);

module.exports = function(app) {
  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));

  app.use((req, res, next) => {
    if (
      req.originalUrl.indexOf('/yki/api') === 0 ||
      req.originalUrl.indexOf('/organisaatio-service')
    ) {
      if (!process.env.TRAVIS) {
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
    registrations = getRegistrations();
    res.send({ success: true });
  });

  app.get('/yki/api/virkailija/organizer', (req, res) => {
    try {
      res.send({ organizers: organizers });
    } catch (err) {
      res.status(404).send(err.message);
    }
  });

  app.post('/yki/api/virkailija/organizer', (req, res) => {
    try {
      organizers.push(req.body);
      res.send({ success: true });
    } catch (err) {
      res.status(404).send(err.message);
    }
  });

  app.get('/yki/api/virkailija/organizer/:oid/exam-session', (req, res) => {
    try {
      res.send(examSessions);
    } catch (err) {
      console.log(err);
      res.status(404).send(err.message);
    }
  });

  app.get(
    '/yki/api/virkailija/organizer/:oid/exam-session/:id/registration',
    (req, res) => {
      try {
        res.send(registrations);
      } catch (err) {
        console.log(err);
        res.status(404).send(err.message);
      }
    },
  );

  app.post('/yki/api/virkailija/organizer/:oid/exam-session', (req, res) => {
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
      };
      examSessions.exam_sessions.push(Object.assign(examSession, backendData));
      res.send({ id: id });
    } catch (err) {
      res.status(404).send(err.message);
    }
  });

  app.put('/yki/api/virkailija/organizer/:oid/exam-session/:id', (req, res) => {
    try {
      const { id } = req.params;
      const foundIndex = examSessions.exam_sessions.findIndex(x => x.id == id);
      examSessions.exam_sessions[foundIndex] = req.body;
      res.send({ success: true });
    } catch (err) {
      res.status(404).send(err.message);
    }
  });

  app.delete(
    '/yki/api/virkailija/organizer/:oid/exam-session/:id',
    (req, res) => {
      try {
        const { id } = req.params;
        const foundIndex = examSessions.exam_sessions.findIndex(
          x => x.id == id,
        );
        examSessions.exam_sessions.splice(foundIndex, 1);
        res.send({ success: true });
      } catch (err) {
        res.status(404).send(err.message);
      }
    },
  );

  app.delete(
    '/yki/api/virkailija/organizer/:oid/exam-session/:examSessionId/registration/:id',
    (req, res) => {
      try {
        const { id } = req.params;
        const foundIndex = registrations.participants.findIndex(
          x => x.registration_id == id,
        );
        registrations.participants.splice(foundIndex, 1);
        res.send({ success: true });
      } catch (err) {
        res.status(404).send(err.message);
      }
    },
  );

  // need to proxy here because dev server bug: https://github.com/webpack/webpack-dev-server/issues/1440
  app.post(
    '/organisaatio-service/rest/organisaatio/v3/findbyoids',
    (req, res) => {
      axios
        .post(
          'https://virkailija.untuvaopintopolku.fi/organisaatio-service/rest/organisaatio/v4/findbyoids',
          req.body,
        )
        .then(response => {
          res.send(response.data);
        })
        .catch(err => {
          console.log(err);
          res.status(404).send(err.message);
        });
    },
  );

  app.put('/yki/api/virkailija/organizer/:oid', (req, res) => {
    try {
      const { oid } = req.params;
      const index = organizers.map(o => o.oid).indexOf(oid);
      organizers[index] = req.body;
      res.send({ success: true });
    } catch (err) {
      console.log(err);
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
      console.log(err);
      res.status(404).send('Organizer not found');
    }
  });

  app.get('/yki/api/localisation', (req, res) => {
    try {
      const { lang } = req.query;
      const data = fs.readFileSync(
        `./dev/rest/localisation/translations_${lang}.json`,
      );
      res.set('Content-Type', 'application/json; charset=utf-8');
      res.send(data);
    } catch (err) {
      res.status(404).send(err.message);
    }
  });

  app.get('/yki/api/exam-date', (req, res) => {
    try {
      res.set('Content-Type', 'application/json; charset=utf-8');
      const futureExamDates = examDates.dates.filter(d => {
        return moment(d.registration_end_date).isSameOrAfter(moment());
      });
      res.send({ dates: futureExamDates });
    } catch (err) {
      res.status(404).send(err.message);
    }
  });

  app.get('/yki/payment/formdata', (req, res) => {
    try {
      res.set('Content-Type', 'application/json; charset=utf-8');
      res.send(paymentFormData);
    } catch (err) {
      res.status(404).send(err.message);
    }
  });

  app.get('/yki/auth/user', (req, res) => {
    try {
      res.set('Content-Type', 'application/json; charset=utf-8');
      res.send(adminUser);
    } catch (err) {
      res.status(404).send(err.message);
    }
  });

  app.post('/yki/api/login-link', (req, res) => {
    try {
      getNumberBetween(1, 10) <= 5
        ? res.status(500).send('err.message')
        : res.send({ success: true });
    } catch (err) {
      res.status(404).send(err.message);
    }
  });

  app.post('/yki/api/registration/init', (req, res) => {
    try {
      req.body.exam_session_id === 2
        ? res.send(initRegistrationEmailAuth)
        : res.send(initRegistration);
    } catch (err) {
      res.status(404).send(err.message);
    }
  });

  app.get('/yki/api/exam-session', (req, res) => {
    try {
      res.set('Content-Type', 'application/json; charset=utf-8');
      res.send(allExamSessions);
    } catch (err) {
      res.status(404).send(err.message);
    }
  });

  app.post('/yki/api/registration/:id/submit', (req, res) => {
    try {
      res.send({ success: true });
    } catch (err) {
      res.status(404).send(err.message);
    }
  });

  app.get('/yki/api/code/maatjavaltiot2', (req, res) => {
    try {
      res.set('Content-Type', 'application/json; charset=utf-8');
      res.send(countries);
    } catch (err) {
      res.status(404).send(err.message);
    }
  });

  app.get('/yki/api/code/sukupuoli', (req, res) => {
    try {
      res.set('Content-Type', 'application/json; charset=utf-8');
      res.send(genders);
    } catch (err) {
      res.status(404).send(err.message);
    }
  });

  app.get('/yki/api/code/posti/:id', (req, res) => {
    try {
      res.set('Content-Type', 'application/json; charset=utf-8');
      res.send(postOffice);
    } catch (err) {
      res.status(404).send(err.message);
    }
  });

};
