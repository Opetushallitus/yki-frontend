#!/bin/bash

env="$1"
lang="$2"

domain=""

if [ $env == "sade" ]
then
  domain=""
elif [ $env == "pallero" ]
then
  domain="testi"
else
  domain=$env
fi

url="https://virkailija.${domain}opintopolku.fi/yki/api/localisation?lang=${lang}"
dir="../src/main/js/dev/rest/localisation/environment"
path="$dir/${env}_${lang}.json"

mkdir -p $dir
curl -H "Accept: application/json" $url | node <<< "var o = $(cat); var ord = {}; Object.keys(o).sort().forEach(function(key) {ord[key] = o[key];}); console.log(JSON.stringify(ord, null, 2));"  > $path
