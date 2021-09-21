#!/usr/bin/env python3

import json
import os
import fnmatch

keys = []

with open('used_i18n_keys_scanned.json') as f:
    j = json.load(f)
    keys.extend(j.keys())

keys.append('common.level.basic')
keys.append('common.level.high')

keys.append('registration.description.read')
keys.append('registration.description.write')
keys.append('registration.description.listen')
keys.append('registration.description.speak')

keys.append('error.age')

keys.append('registration.expired.loginlink')
keys.append('registration.expired.loginlink.info')
keys.append('registration.expired.paymentlink')
keys.append('registration.expired.paymentlink.info')
keys.append('registration.expired.link')
keys.append('registration.expired.link.info')

keys.append('common.price.reeval.first')
keys.append('common.price.reeval.last')
keys.append('common.registration.root')
keys.append('error.examDates.addFailed')
keys.append('error.examDates.fetchFailed')
keys.append('error.examDates.languages.configurationFailed')
keys.append('error.examDates.postAdmission.configurationFailed')
keys.append('error.examDates.deleteFailed')
keys.append('error.examSession.addFailed')
keys.append('error.examSession.fetchFailed')
keys.append('error.examSession.fetchParticipantsFailed')
keys.append('error.examSession.registration.confirmPaymentFailed')
keys.append('error.examSession.registration.relocateExamSessionFailed')
keys.append('error.examSession.updateFailed')
keys.append('error.registration.cancelFailed')
keys.append('error.registrationForm.submitFailed')
keys.append('examSession.paid')
keys.append('examSession.cancelled')
keys.append('examSession.expired')
keys.append('examSession.paidAndCancelled')
keys.append('examSession.notPaid')
keys.append('payment.status.cancel.info1')
keys.append('payment.status.error.info1')
keys.append('payment.status.success.info2')
keys.append('payment.status.error.evaluation')
keys.append('registration.init.error.session.full')
keys.append('registration.init.error.session.closed')
keys.append('registration.init.error.session.multiple')
keys.append('registration.error.form.expired')
keys.append('registration.init.error.generic')

with open("../../src/main/js/src/common/LocalizationKeys.js", "w") as f:
    for key in sorted(keys):
        f.write("export const " + key.replace(".", "_") + " = '" + key + "';\n")


def find_replace(directory, search_term, replacement, file_pattern):
    for path, dirs, files in os.walk(os.path.abspath(directory)):
        for filename in fnmatch.filter(files, file_pattern):
            if filename in ['LocalizationKeys.js']:
                continue
            filepath = os.path.join(path, filename)
            with open(filepath) as f:
                s = f.read()
            s = s.replace(search_term, replacement)
            with open(filepath, "w") as f:
                f.write(s)


for key in keys:
    find_replace('../../src/main/js/src', "'" + key + "'", 'i18nKeys.' + key.replace(".", "_"), '*.js')