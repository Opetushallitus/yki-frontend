#!/bin/bash

function get_domain {
  env=$1

  if [ $env == "sade" ]
  then
    echo "opintopolku.fi"
  elif [ $env == "pallero" ]
  then
    echo "testiopintopolku.fi"
  else
    echo "${env}opintopolku.fi"
  fi
}

function fetch_localisations {
  env=$1
  domain=$2
  lang=$3
  dir=$4

  url="https://virkailija.${domain}/yki/api/localisation?lang=${lang}"

  path="$dir/${env}_${lang}.json"

  curl -H "Accept: application/json" $url | node <<< "var o = $(cat); var ord = {}; Object.keys(o).sort().forEach(function(key) {ord[key] = o[key];}); console.log(JSON.stringify(ord, null, 2));"  > $path
}

env="$1"

if [ -z $env ]
then
  env="untuva"
fi

domain=$(get_domain $env)

dir="../src/main/js/dev/rest/localisation/environment"
mkdir -p $dir

for lang in "en" "fi" "sv"
do
  fetch_localisations $env $domain $lang $dir
done
