#!/usr/bin/env python3

import fnmatch
import json
import os

migrated_keys = []

with open("../../src/main/js/src/common/LocalizationKeys.js") as f:
    for line in f:
        if line.startswith("export const "):
            migrated_keys.append(line.split("=")[1].split("'")[1])

unmigrated_keys = []
server_keys = []
with open("../../src/main/js/dev/rest/localisation/translations_fi.json") as f:
    j = json.load(f)
    for key in j.keys():
        server_keys.append(key)
        if key not in migrated_keys:
            unmigrated_keys.append(key)


def find(directory, search_term, file_pattern, ignored_files):
    found = []
    for path, dirs, files in os.walk(os.path.abspath(directory)):
        for filename in fnmatch.filter(files, file_pattern):
            if filename in ignored_files:
                continue
            filepath = os.path.join(path, filename)
            with open(filepath) as f:
                s = f.read()
            if search_term in s:
                found.append(filepath)
    return found

for key in unmigrated_keys:
    files_with_unmigrated = find("../../src/main/js/src", key, "*.js", ['LocalizationKeys.js'])
    for fname in files_with_unmigrated:
        print("Key found as string in a file", key, fname)

files_with_import = find("../../src/main/js/src", "import * as i18nKeys from ", "*.js", ['LocalizationKeys.js'])
files_with_i18nKeys = find("../../src/main/js/src", "i18nKeys.", "*.js", ['LocalizationKeys.js'])

for i in files_with_i18nKeys:
    if i not in files_with_import:
        print("Import missing", i)

for i in files_with_import:
    if i not in files_with_i18nKeys:
        print("Unused import", i)

# This prints also keys which backend uses, so be cautious when looking at these
for i in server_keys:
    if i not in migrated_keys:
        print("Server key unused", i)
