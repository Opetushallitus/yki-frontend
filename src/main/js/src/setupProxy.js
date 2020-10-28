const bodyParser = require('body-parser');
const fs = require('fs');
const axios = require('axios');
const moment = require('moment');
const multer = require('multer');

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

let registrations = {
  1: getRegistrations(),
  2: { participants: [] },
  3: { participants: [] },
};

const countries = JSON.parse(
  fs.readFileSync('./dev/rest/codes/maatjavaltiot2.json'),
);

const genders = JSON.parse(fs.readFileSync('./dev/rest/codes/sukupuoli.json'));

let organizers = [
  {
    oid: '1.2.246.562.10.28646781493',
    agreement_start_date: '2018-01-01',
    agreement_end_date: '2029-01-01',
    contact_name: 'Iida Ikola',
    contact_email: 'iida.ikola@amiedu.fi',
    contact_phone_number: '0101234546',
    attachments: null,
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
    merchant: {
      merchant_id: 13466,
      merchant_secret: '6pKF4jkv97zmqBJ3ZL8gUw5DfT2NMQ',
    },
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
    attachments: null,
  },
];

const initialOrganizers = [...organizers];

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

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 104857600 },
});

let uploadedFile;

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

    registrations = {
      1: getRegistrations(),
      2: { participants: [] },
      3: { participants: [] },
    };
    organizers = [...initialOrganizers];
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
        const { id } = req.params;
        res.send(registrations[id] || { participants: [] });
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
        organizer_oid: req.params.oid,
      };

      examSessions.exam_sessions.push(Object.assign(examSession, backendData));
      res.send({ id: id });
    } catch (err) {
      res.status(404).send(err.message);
    }
  });

  app.post('/yki/api/virkailija/organizer/:oid/exam-session/:id/post-admission', (req, res) => {
    try {
      const postadmission = req.body;
      const requestPostAdmissionId = req.params.id;
      const examSessionIndex = examSessions.exam_sessions.findIndex(x => x.id == requestPostAdmissionId);
      const examsSession = examSessions.exam_sessions[examSessionIndex];

      examsSession.post_admission_quota = postadmission.post_admission_quota;
      examsSession.post_admission_start_date = postadmission.post_admission_start_date;
      examsSession.post_admission_active = postadmission.post_admission_active;

      res.send({ success: true });
    }
    catch (err) {
      res.status(404).send(err.message);
    }
  });

  app.post('/yki/api/virkailija/organizer/:oid/exam-session/:id/post-admission/activation', (req, res) => {
    try {
      const postadmissionstate = req.body.post_admission_active;
      const requestPostAdmissionId = req.params.id;
      const examSessionIndex = examSessions.exam_sessions.findIndex(x => x.id == requestPostAdmissionId);
      const examsSession = examSessions.exam_sessions[examSessionIndex];

      examsSession.post_admission_active = postadmissionstate;

      res.send({ success: true });
    }
    catch (err) {
      res.status(404).send(err.message);
    }
  });

  app.post('/yki/api/virkailija/organizer/:oid/exam-session/:examSessionId/registration/:id/resendConfirmation', (req,res) => {
    try {
      res.send({ success: true });
    }
    catch (err) {
      res.status(404).send(err.message);
    }
  });

  app.post(
    '/yki/api/virkailija/organizer/:oid/file', upload.single('file'), (req, res) => {
      try {
        const { oid } = req.params;
        const index = organizers.map(o => o.oid).indexOf(oid);
        organizers[index].attachments = [
          {
            external_id: 'a0d5dfc2-4045-408e-8ee5-4fd1b74b2757',
            created: '2019-04-04T13:49:21.02436+03:00',
          },
        ];
        uploadedFile = req.file;
        res.send({ success: true });
      } catch (err) {
        res.status(404).send(err.message);
      }
    },
  );

  app.get('/yki/api/virkailija/organizer/:oid/file/:id', (req, res) => {
    try {
      res.set({
        'Content-Disposition':
          'attachment; filename=' + uploadedFile.originalname,
        'Content-Type': uploadedFile.mimetype,
      });
      res.send(uploadedFile.buffer);
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
        const { id, examSessionId } = req.params;
        const foundIndex = registrations[examSessionId].participants.findIndex(
          x => x.registration_id == id,
        );

        registrations[examSessionId].participants.splice(foundIndex, 1);
        res.send({ success: true });
      } catch (err) {
        res.status(404).send(err.message);
      }
    },
  );

  app.post(
    '/yki/api/virkailija/organizer/:oid/exam-session/:examSessionId/registration/:id/relocate',
    (req, res) => {
      try {
        const { id, examSessionId } = req.params;
        const toId = req.body.to_exam_session_id;
        const foundIndex = registrations[examSessionId].participants.findIndex(
          x => x.registration_id == id,
        );
        const reg = registrations[examSessionId].participants[foundIndex];
        registrations[toId].participants.push(reg);
        registrations[examSessionId].participants.splice(foundIndex, 1);
        res.send({ success: true });
      } catch (err) {
        res.status(404).send(err.message);
      }
    },
  );

  app.post(
    '/yki/api/virkailija/organizer/:oid/exam-session/:examSessionId/registration/:id/confirm-payment',
    (req, res) => {
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
      /*
      // all exam dates
      res.send({ dates: examDates.dates });
      */
    } catch (err) {
      res.status(404).send(err.message);
    }
  });

  app.post('/yki/api/exam-date/:id/post-admission-end-date', (req, res) => {
    try {
      const examDateId = Number(req.params.id);
      const newEndDate = req.body.post_admission_end_date;
      const edIndex = examDates.dates.findIndex(e => e.id === examDateId);

      const copyOfEd = examDates.dates.find(e => e.id === examDateId);
      copyOfEd.post_admission_end_date = newEndDate;

      examDates.dates[edIndex] = copyOfEd;
      res.send({ success: true });
    } catch (e) {
      res.status(404).send(e.message)
    }
  });

  app.delete('/yki/api/exam-date/:id/post-admission-end-date', (req, res) => {
    try {
      const examDateId = Number(req.params.id);
      const examDateIndex = examDates.dates.findIndex(ed => ed.id === examDateId);
      const examDate = examDates.dates[examDateIndex];
      examDate.post_admission_end_date = null;

      examDates.dates[examDateIndex] = examDate;
      res.send({ success: true});
    } catch(e) {
      res.status(404).send(e.message);
    }
  })

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
      res.send({ success: true });
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

        // postadmission active
        if(es.session_date === '2039-12-29') {
          const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
          const today = moment().format('YYYY-MM-DD');

          es.session_date = monthFromNow;
          es.registration_start_date = monthMinusThreeDaysPast;
          es.registration_end_date = yesterday;
          es.post_admission_start_date = today;
          es.post_admission_end_date = weekFromNow;
        }
      });
      res.send(allExamSessions);
    } catch (err) {
      res.status(404).send(err.message);
    }
  });

  app.get('/yki/api/exam-session/:id', (req, res) => {
    try {
      const session = allExamSessions.exam_sessions.find(
        e => e.id === Number(req.params.id),
      );
      res.set('Content-Type', 'application/json; charset=utf-8');
      res.send(session);
    } catch (err) {
      res.status(404).send(err.message);
    }
  });

  app.post('/yki/api/exam-session/:id/queue', (req, res) => {
    try {
      res.set('Content-Type', 'application/json; charset=utf-8');
      res.send({ success: true });
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
      axios
        .get(
          `https://virkailija.untuvaopintopolku.fi/yki/api/code/posti/${
            req.params.id
          }`,
          req.body,
        )
        .then(response => {
          res.send(response.data);
        })
        .catch(err => {
          console.log(err);
          res.status(404).send(err.message);
        });
    } catch (err) {
      res.status(404).send(err.message);
    }
  });
};
