#!/bin/bash
set -ev
npm i --prefix src/main/js/
if [ "${TRAVIS_EVENT_TYPE}" = "cron" ]; then
  npm run e2e-test --prefix src/main/js/
fi
if [ "${TRAVIS_EVENT_TYPE}" != "cron" ]; then
  npm test --prefix src/main/js/
  ./mvnw clean package
  mv target/yki-frontend-*.jar $DOCKER_BUILD_DIR/artifact/${ARTIFACT_NAME}.jar
  cp -vr src/main/resources/* $DOCKER_BUILD_DIR/config/
  export BASE_IMAGE="baseimage-fatjar:latest-master"
  ./ci-tools/common/pull-image.sh
  ./ci-tools/build/build-fatjar.sh $ARTIFACT_NAME
fi