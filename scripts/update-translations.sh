#!/bin/bash
curl -X GET https://virkailija.opintopolku.fi/yki/api/localisation?lang=fi | node <<< "var o = $(cat); var ord = {}; Object.keys(o).sort().forEach(function(key) {ord[key] = o[key];}); console.log(JSON.stringify(ord, null, 2));"  > ../src/main/js/dev/rest/localisation/translations_fi.json
curl -X GET https://virkailija.opintopolku.fi/yki/api/localisation?lang=sv | node <<< "var o = $(cat); var ord = {}; Object.keys(o).sort().forEach(function(key) {ord[key] = o[key];}); console.log(JSON.stringify(ord, null, 2));"  > ../src/main/js/dev/rest/localisation/translations_sv.json
curl -X GET https://virkailija.opintopolku.fi/yki/api/localisation?lang=en | node <<< "var o = $(cat); var ord = {}; Object.keys(o).sort().forEach(function(key) {ord[key] = o[key];}); console.log(JSON.stringify(ord, null, 2));"  > ../src/main/js/dev/rest/localisation/translations_en.json


