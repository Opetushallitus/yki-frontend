#!/bin/bash

function get_domain {
  env=$1

  if [ $env == "sade" ]
  then
    printf "opintopolku.fi"
  elif [ $env == "pallero" ]
  then
    printf "testiopintopolku.fi"
  else
    printf "${env}opintopolku.fi"
  fi
}

# Fetches translation files from server
# * param1: <env>    Environment name
# * param2: <domain> Domain name where the translation files can be downloaded
# * param3: <lang>   Language
# * param4: <dir>    Directory where all translation files are stored 
function fetch_localisations {
  env=$1
  domain=$2
  lang=$3
  dir=$4
  path="$dir/environment/${env}_${lang}.json"
  url="https://virkailija.${domain}/yki/api/localisation?lang=${lang}"

  # Download Translations
  printf "\nDownloading $lang translations from environment $env ... \n"
  curl -H "Accept: application/json" $url | jq --sort-keys > $path
  # Show differences
  show_diffs $path $env $lang $dir
}

# Shows differences between local and server translation files
# * param1: <path> Path of downloaded translation files
# * param2: <env>  Environment name
# * param3: <lang> Language
# * param4: <dir>  Directory where all translation files are stored 
function show_diffs {
  local_dir="${4}/translations_${3}.json"
  local_diffs=$(diff --context=0 --ignore-all-spac ${1} ${local_dir})
  printf "\n\nChecking differences between ${3} translations in ${2} environment... \n"
  if [ "${local_diffs}" != "" ] 
  then
    printf "${local_diffs}"
  else
    printf "No differences found between ${3} language translations in ${2} environment!\n\n"
  fi
}

env="$1"

if [ -z $env ]
then
  env="untuva"
fi

domain=$(get_domain $env)

dir="../src/main/js/dev/rest/localisation"
mkdir -p "$dir/environment/"

for lang in "en" "fi" "sv"
do
  fetch_localisations $env $domain $lang $dir
done
