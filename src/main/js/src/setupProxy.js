const proxy = require('http-proxy-middleware');
const bodyParser = require('body-parser');
const fs = require('fs');
const axios = require('axios');

const getCurrentTime = () => {
  const tzoffset = new Date().getTimezoneOffset() * 60000;
  const localISOTime = new Date(Date.now() - tzoffset)
    .toISOString()
    .slice(0, -1);
  return localISOTime;
};

const organizers = [
  {
    oid: '1.2.246.562.10.28646781493',
    agreement_start_date: '2018-01-01T00:00:00.000Z',
    agreement_end_date: '2019-01-01T00:00:00.000Z',
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

const getNumberBetween = (min, max) => Math.random() * (max - min) + min;

module.exports = function(app) {
  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));

  app.use((req, res, next) => {
    if (
      req.originalUrl.indexOf('/yki/api') === 0 ||
      req.originalUrl.indexOf('/organisaatio-service')
    ) {
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
    next();
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

  // app.get('/organisaatio-service/rest/organisaatio/v4/:oid', (req, res) => {
  //   try {
  //     const { oid } = req.params;
  //     const data = fs.readFileSync(`./dev/rest/organization/findbyoid.json`);
  //     // res.status(404).send('err.message');
  //     res.send(data);
  //   } catch (err) {
  //     console.log(err);
  //     res.status(404).send(err.message);
  //   }
  // });

  app.get('/yki/api/virkailija/organizer/:oid/exam-session', (req, res) => {
    try {
      const { oid } = req.params;
      const data = fs.readFileSync(`./dev/rest/examSessions/examSessions.json`);
      res.send(data);
    } catch (err) {
      console.log(err);
      res.status(404).send(err.message);
    }
  });

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
      const data = fs.readFileSync(`./dev/rest/localisation/translations_${lang}.json`);
      res.set('Content-Type', 'application/json; charset=utf-8');
      res.send(data);
    } catch (err) {
      res.status(404).send(err.message);
    }
  });
};
