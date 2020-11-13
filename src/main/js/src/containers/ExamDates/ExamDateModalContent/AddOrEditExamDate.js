import React, {useState} from 'react';
import {withTranslation} from 'react-i18next';
import PropTypes from "prop-types";
import DatePicker from '../../../components/UI/DatePicker/DatePicker';
import RegistrationDatesSelector from "../RegistrationPeriodSelector/RegistrationPeriodSelector";
import {languageToString, levelTranslations} from "../../../util/util";
import {LANGUAGES} from "../../../common/Constants";
import closeSign from '../../../assets/svg/close-sign.svg';
import classes from './AddOrEditExamDate.module.css';
import ToggleSwitch from "../../../components/UI/ToggleSwitch/ToggleSwitch";
import moment from "moment";

const AddOrEditExamDate = (props) => {
    const {examDates, examModal, onIndexSelect, onUpdate, t} = props;
    const currentDate = new Date();

    const initializeLanguageArray = () => {
        let languageArray = [];
        if (examDates.languages && examDates.languages.length > 0) {
            examDates.languages.map((item) => {
                let language = languageToString(item.language_code);
                //TODO: add correct level when provided from backend
                let level = t(levelTranslations.PERUS)
                return languageArray.push({language, level});
            });
            return languageArray;
        } else return [];
    }

    // useState
    const [languageAndLevel, setLanguageAndLevel] = useState(initializeLanguageArray);
    const [level, setLevel] = useState(t(levelTranslations.PERUS));
    const [language, setLanguage] = useState(LANGUAGES[0].name);
    const [disabled, setDisabled] = useState(true);

    // language levels
    const PERUS = t(levelTranslations.PERUS);
    const KESKI = t(levelTranslations.KESKI);
    const YLIN = t(levelTranslations.YLIN);

    const handleRemoveLanguage = item => {
        const temp = [...languageAndLevel];
        temp.splice(item, 1);
        setLanguageAndLevel(temp);
    }

    const languagesList = (
        <>
            {languageAndLevel.map((item, i) => {
                return (
                    <span key={i}>
          <img src={closeSign} alt={'delete'} onClick={() => handleRemoveLanguage(i)}/>
          <p style={{marginLeft: '10px'}}>{item.language}, {item.level}</p>
         </span>
                )
            })}
        </>
    );

    //TODO handle onChange
    const examTimeGrid = (
        <div className={classes.TimeGrid}>
            <div>
                <label>{t('examDates.choose.registrationTime')}</label>
                <RegistrationDatesSelector registrationPeriods={examDates} onIndexSelect={onIndexSelect}
                                           stateItem={''}/>
            </div>
            <div>
                <label>{t('examDates.choose.examDate')}</label>
                <div className={classes.DatePickerWrapper}>
                    <DatePicker options={{defaultDate: currentDate}} onChange={() => console.log('selected new date')}/>
                </div>
            </div>
        </div>
    );

    // TODO: new localizations to be added!
    const registrationTimeGrid = (
        <div className={classes.TimeGrid}>
            <div>
                <label>{t('examDates.choose.registrationTime')}</label>
                <div className={classes.DatePickerWrapper}>
                    <DatePicker options={{defaultDate: currentDate}} onChange={() => console.log('selected new date')}/>
                </div>
            </div>
            <div>
                <label>{t('examDates.choose.registrationTime')}</label>
                <div className={classes.DatePickerWrapper}>
                    <DatePicker options={{defaultDate: currentDate}} onChange={() => console.log('selected new date')}/>
                </div>
            </div>
        </div>
    );

    const languageAndLevelGrid = (
        <div className={classes.LanguageAndLevelGrid}>
            <div>
                <label>{t('examDates.choose.examLanguage')}</label>
                <select
                    className={classes.ExamLevels} defaultValue={language}
                    onChange={e => setLanguage(e.target.value)}
                >
                    {LANGUAGES.map((lang) => {
                        return <option key={lang.code} value={lang.name}>{lang.name}</option>
                    })}
                </select>
            </div>
            <div>
                <label>{t('registration.select.level')}</label>
                <select className={classes.ExamLevels} defaultValue={level} onChange={e => setLevel(e.target.value)}>
                    <option value={PERUS}>{PERUS}</option>
                    <option value={KESKI}>{KESKI}</option>
                    <option value={YLIN}>{YLIN}</option>
                </select>
            </div>
            <div>
                <button
                    className={classes.LanguageAddition}
                    onClick={() => setLanguageAndLevel(prev => [...prev, {language, level}])}
                >
                    {t('examDates.addNew.addLanguage')}
                </button>
            </div>
        </div>
    );

    const postAdmissionToggle = (
        <>
            <label>{'Järjestäjien jälki-ilmoittautuminen'}</label>
            <div className={classes.PostAdmissionContainer}>
                <div className={classes.Toggle}>
                    <ToggleSwitch onChange={() => setDisabled(!disabled)}/>
                    <p>{'Ei avattu'}</p>
                </div>
                <p className={classes.Label}>Päivämäärät</p>
                <div className={disabled ? classes.DisabledPicker : classes.DatePickerWrapper}>
                    <DatePicker disabled={disabled} options={{defaultDate: currentDate}} onChange={() => console.log('changed')}/>
                </div>
                <div className={disabled ? classes.DisabledPicker : classes.DatePickerWrapper}>
                    {console.log('is disabled: ', disabled)}
                    <DatePicker
                        id="postAdmissionEnd"
                        disabled={disabled}
                        options={{
                            defaultDate: examDates.post_admission_end_date,
                            // value: values.postAdmissionEnd,
                            minDate: moment(examDates.registration_end_date).add(1, 'days').format('YYYY MM DD'),
                            maxDate: moment(examDates.exam_date).add(-1, 'days').format('YYYY MM DD')
                        }}
                        onChange={d =>
                            console.log(
                                'postAdmissionEnd: ',
                                moment(d[0]).format('YYYY-MM-DD'),
                            )
                        }
                        locale={props.i18n.language}
                        tabIndex="1"
                    />
                </div>
            </div>
        </>
    );

    const editView = () => (
        <div>
            <h3 style={{marginBlockStart: '0'}}>Muokkaa aikaa</h3>
            <div className={classes.Form}>
                <div className={classes.EditViewTop}>
                    <div>
                        <label>{t('examDates.choose.examDate')}</label>
                        <div className={classes.DatePickerWrapper}>
                            <DatePicker options={{defaultDate: currentDate}}
                                        onChange={() => console.log('selected new date')}/>
                        </div>
                    </div>
                    <div>
                        {postAdmissionToggle}
                    </div>
                </div>
                {languageAndLevelGrid}
                <div className={classes.AddedLanguages}>
                    {languagesList}
                </div>
            </div>
            <button
                className={classes.AdditionButton}
                onClick={() => onUpdate()}
            >
                {t('examDates.addNew.confirm')}
            </button>
        </div>
    );

    //TODO: move into form and add validation : Formik & yup
    const createView = () => (
        <>
            <h3 style={{marginBlockStart: '0'}}>{t('examDates.addNew.examDate')}</h3>
            <div className={classes.Form}>
                <>
                    {examModal ? <>{examTimeGrid}</> : <>{registrationTimeGrid}</>}
                </>
                {languageAndLevelGrid}
                <div className={classes.AddedLanguages}>
                    {languagesList}
                </div>
            </div>
            <button
                className={classes.AdditionButton}
                onClick={() => onUpdate()}
            >
                {t('examDates.addNew.confirm')}
            </button>
        </>
    );

    return (
        examDates.length === 1 ? editView() : createView()
    );
}

// TODO: add connection to redux when backend is ready
AddOrEditExamDate.propTypes = {
    examDates: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]).isRequired,
    examModal: PropTypes.bool,
    onUpdate: PropTypes.func.isRequired
}

export default withTranslation()(AddOrEditExamDate);
