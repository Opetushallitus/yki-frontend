import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from "prop-types";
import { LANGUAGES } from "../../../common/Constants";
import classes from '../ExamDateModalContent/AddOrEditExamDate.module.css';
import { levelTranslations } from "../../../util/util";

const LanguageLevelSelector = (props) => {
	const { t, languages, setLanguages, initialLanguageCode, modify } = props;
	const [newLanguageField, setNewLanguageField] = useState(false);
	const [level_code, setLevel] = useState('PERUS');
	const [language_code, setLanguage] = useState(initialLanguageCode);

	const handleAddNewLanguage = () => {
		setNewLanguageField(!newLanguageField);
		setLanguages(prev => [...prev, { language_code, level_code }]);
		setLanguage(LANGUAGES[0].code);
		setLevel('PERUS');
	}
	const handleRemoveLanguage = item => {
		const temp = [...languages];
		temp.splice(item, 1);
		setLanguages(temp);
	}

	const handleEdit = (key, value, original) => {
		original[key] = value;
	}

	// 1st ternary = edit OR add new language
	// 2nd ternary = adding language on edit OR adding language on new language modal
	// 3rd ternary = addition button or link button
	return (
		<>
			{modify ?
				<>
					<label>{t('examDates.choose.examLanguage')}</label>
					<label>{t('registration.select.level')}</label>
					<span />
					<>
						{languages.map((date, i) => {
							return (
								<React.Fragment key={date.language_code + i}>
									<div>
										<>
											<select
												className={classes.ExamLevels}
												defaultValue={date.language_code || language_code}
												onChange={e => handleEdit('language_code', e.target.value, date)}
											>
												{LANGUAGES.map((lang) => {
													return <option key={lang.code} value={lang.code}>{lang.name}</option>
												})}
											</select>
										</>
									</div>
									<div key={date.level_code}>
										<>
											<select
												className={classes.ExamLevels}
												defaultValue={date.level_code || level_code}
												onChange={e => handleEdit('level_code', e.target.value, date)}
											>
												<option value={'PERUS'}>{t(levelTranslations.PERUS)}</option>
												<option value={'KESKI'}>{t(levelTranslations.KESKI)}</option>
												<option value={'YLIN'}>{t(levelTranslations.YLIN)}</option>
											</select>
										</>
									</div>
									<div>
										<button
											type='button'
											value={i}
											className={`${classes.LanguageButton} ${classes.RemoveLanguageButton}`}
											onClick={() => handleRemoveLanguage(i)}
										>
											{t('examDates.languages.delete')}
										</button>
									</div>
								</React.Fragment>
							)
						})}
					</>
				</>
				:
				<>
					<div>
						<label>{t('examDates.choose.examLanguage')}</label>
						<>
							<select
								className={classes.ExamLevels}
								value={language_code}
								onChange={e => setLanguage(e.target.value)}
							>
								{LANGUAGES.map((lang) => {
									return <option key={lang.code} value={lang.code}>{lang.name}</option>
								})}
							</select>
						</>
					</div>
					<div>
						<label>{t('registration.select.level')}</label>
						<>
							<select
								className={classes.ExamLevels}
								value={level_code}
								onChange={e => setLevel(e.target.value)}
							>
								<option value={'PERUS'}>{t(levelTranslations.PERUS)}</option>
								<option value={'KESKI'}>{t(levelTranslations.KESKI)}</option>
								<option value={'YLIN'}>{t(levelTranslations.YLIN)}</option>
							</select>
						</>
					</div>
				</>
			}
			{modify ?
				<>
					{(newLanguageField === false) ?
						<div>
							<button
								type='button'
								className={classes.AddNewLanguages}
								onClick={() => setNewLanguageField(!newLanguageField)}
							>
								{t('examDates.languages.add')}
							</button>
						</div>
						:
						<div className={classes.LanguageAndLevelGrid}>
							<div>
								<select
									className={classes.ExamLevels}
									value={language_code}
									onChange={e => setLanguage(e.target.value)}
								>
									{LANGUAGES.map((lang) => {
										return <option key={lang.code} value={lang.code}>{lang.name}</option>
									})}
								</select>
							</div>
							<div>
								<select
									className={classes.ExamLevels}
									value={level_code}
									onChange={e => setLevel(e.target.value)}
								>
									<option value={'PERUS'}>{t(levelTranslations.PERUS)}</option>
									<option value={'KESKI'}>{t(levelTranslations.KESKI)}</option>
									<option value={'YLIN'}>{t(levelTranslations.YLIN)}</option>
								</select>
							</div>
							<div>
								<button
									type='button'
									style={{ marginTop: '4px' }}
									className={`${classes.LanguageButton} ${classes.LanguageAdditionButton}`}
									onClick={() => handleAddNewLanguage()}
								>
									{t('examDates.addNew.addLanguage')}
								</button>
							</div>
						</div>
					}
				</>
				:
				<div>
					<button
						type='button'
						className={`${classes.LanguageButton} ${classes.LanguageAdditionButton}`}
						onClick={() => handleAddNewLanguage()}
					>
						{t('examDates.addNew.addLanguage')}
					</button>
				</div>
			}
		</>
	);
}


LanguageLevelSelector.propTypes = {
	initialLanguageCode: PropTypes.string,
	languages: PropTypes.arrayOf(PropTypes.shape({
		level_code: PropTypes.string,
		language_code: PropTypes.string
	})),
	setLanguages: PropTypes.func,
	modify: PropTypes.bool
}

export default withTranslation()(LanguageLevelSelector);
