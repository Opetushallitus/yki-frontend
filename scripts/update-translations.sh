#!/bin/bash
curl -X GET https://virkailija.untuvaopintopolku.fi/yki/api/localisation?lang=fi | node <<< "var o = $(cat); console.log(JSON.stringify(o, null, 2));"  > ../src/main/js/dev/rest/localisation/translations_fi.json
curl -X GET https://virkailija.untuvaopintopolku.fi/yki/api/localisation?lang=sv | node <<< "var o = $(cat); console.log(JSON.stringify(o, null, 2));"  > ../src/main/js/dev/rest/localisation/translations_sv.json
curl -X GET https://virkailija.untuvaopintopolku.fi/yki/api/localisation?lang=en | node <<< "var o = $(cat); console.log(JSON.stringify(o, null, 2));"  > ../src/main/js/dev/rest/localisation/translations_en.json


