Helper scripts to refactor used localisation keys from inline values to constants.

`used_i18n_keys_scanned.json` contains localisation keys which scanner found as used keys.

`generate_localisation_keys_and_replace.py` reads keys from `used_i18n_keys_scanned.json` and adds those which were not 
found by scanner. It then writes those as constants to `LocalizationKeys.js`, then replaces all strings as references to 
`LocalizationKeys.js` constants. It does not add imports.

`find_keys_not_migrated_to_constants.py` runs checks on the code. It first prints all strings which are not moved to 
`LocalizationKeys.js` by searching all the keys in `translations_fi.json`, then prints all files 
where `LocalizationKeys.js` is not imported, or imported without usage. Fix printed problems by adding missing key 
to `generate_localisation_keys_and_replace.py`, add/remove imports as necessary, or fix code.

`LocalizationKeys.js` has some lines commented out, those constants are unused because their usage is commented out.

TODO `RegistrationForm.js` needs some work.