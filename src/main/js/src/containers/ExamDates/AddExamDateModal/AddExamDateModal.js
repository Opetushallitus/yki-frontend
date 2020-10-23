import React from 'react';
import {withTranslation} from 'react-i18next';
import DatePicker from '../../../components/UI/DatePicker/DatePicker';

import classes from './AddExamDateModal.module.css';
import ExamRegistrationDatesSelector from "../RegistrationDateSelector/ExamRegistrationDateSelector";
import {levelTranslations} from "../../../util/util";
import {LANGUAGES} from "../../../common/Constants";

const AddExamDateModal = (props) => {
    const t = props.t;
    const currentDate = new Date();

    //TODO: move into form and add validation : Formik & yup
    return (
        <div className={classes.Form}>
            <h3>{t('examDates.addNew.examDate')}</h3>
            <label>{t('examDates.choose.registrationTime')}</label>
            <ExamRegistrationDatesSelector examDates={props.examDates}/>
              <label>{t('examDates.choose.examDate')}</label>
            <div className={classes.DatePickerWrapper}>
                <DatePicker options={{defaultDate: currentDate}} onChange={() => console.log('selected new date')}/>
            </div>
            <label>{t('examDates.choose.examLanguage')}</label>
            <select className={classes.ExamLevels}>
                {LANGUAGES.map((lang) => {
                    return <option key={lang.code}>{lang.name}</option>
                })}
            </select>
            <label>{t('registration.select.level')}</label>
            <select className={classes.ExamLevels}>
                <option>{t(levelTranslations.PERUS)}</option>
                <option>{t(levelTranslations.KESKI)}</option>
                <option>{t(levelTranslations.YLIN)}</option>
            </select>
            <button
                className={classes.AdditionButton}
                onClick={() => this.showAddNewExamDateModalHandler()}
            >
              {t('examDates.addNew.confirm')}
            </button>
        </div>
    )
}

// TODO: add connection to redux when backend is ready

export default withTranslation()(AddExamDateModal);
