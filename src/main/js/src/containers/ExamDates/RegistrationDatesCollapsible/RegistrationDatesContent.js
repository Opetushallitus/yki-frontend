import React, {useState} from 'react';
import classes from './RegistrationDatesCollapsible.module.css';
import {useTranslation} from "react-i18next";
import ControlledCheckbox from "../../../components/UI/Checkbox/ControlledCheckbox";
import RegistrationPeriod from "../util/RegistrationPeriod";
import editIcon from "../../../assets/svg/edit.svg";
import {languageToString} from "../../../util/util";
import Modal from "../../../components/UI/Modal/Modal";
import AddOrEditExamDate from "../ExamDateModalContent/AddOrEditExamDate";

const RegistrationDatesContent = ({content, onIndexSelect}) => {

  const initializeCheckboxes = content.reduce(
    (items, item) => ({
      ...items,
      [item.id]: false
    }), {}
  );

  // states
  const [checkboxes, setCheckboxes] = useState(initializeCheckboxes);
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedValues] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const {t} = useTranslation();

  const selectAllCheckboxes = isSelected => {
    Object.keys(checkboxes).forEach(checkbox => {
      setCheckboxes(prev => ({
        ...prev,
        [checkbox]: isSelected
      }));
    });
  };

  const onSelectAllCheckboxesChange = () => {
    if (selectedDates.length < 1) {
      setSelectedDates([...content]);
      selectAllCheckboxes(true);
    } else {
      setSelectedDates([]);
      selectAllCheckboxes(false);
    }
  }

  const isAllChecked = Object.values(checkboxes).every(value => value === true);

  const level = t('common.level.all');

  const language = (lang) => {
    return lang.languages.map(l => {
      return languageToString(l.language_code).toLowerCase();
    })
      .join(', ');
  };

  //individual checkbox change
  const handleCheckboxChange = item => {
    const selectedCheckbox = selectedValues;
    const selectedExamDates = selectedDates;
    const stateCheckboxes = checkboxes;
    const result = selectedCheckbox.find(element => element.id === item);

    if (selectedExamDates.length <= 1) {
      setSelectedDates([...selectedExamDates, result]);
      setCheckboxes({
        ...stateCheckboxes,
        [item]: !stateCheckboxes[item]
      });
    }
    if (selectedExamDates.includes(result)) {
      setSelectedDates(selectedExamDates.filter(removable => removable !== result));
      setCheckboxes({
        ...stateCheckboxes,
        [item]: !stateCheckboxes[item]
      });
    }
  }

  const closeAddOrEditExamDateModal = () => setShowModal(false);

  //TODO: handle onUpdate
  const addNewExamDateModal = (
    <>
      {showModal ? (
        <Modal smallModal show={showModal} modalClosed={closeAddOrEditExamDateModal}>
          <AddOrEditExamDate
            examDates={selectedDates}
            onUpdate={closeAddOrEditExamDateModal}
            onIndexSelect={onIndexSelect}
          />
        </Modal>
      ) : null}
    </>
  );

  return (
    <div className={classes.ContentContainer}>
      <>
        <div className={classes.ActionButtons}>
          <button
            className={classes.AdditionButton}
            onClick={() => setShowModal(!showModal)}
          >
            {t('examDates.addNew.confirm')}
          </button>
          <button
            className={classes.DeleteButton}
            onClick={() => console.log('deleted')}
          >
            {t('examDates.delete.selected')}
          </button>
        </div>
      </>
      <div className={classes.Grid}>
        <ControlledCheckbox
          onChange={() => onSelectAllCheckboxesChange()}
          checked={isAllChecked}
        />
        <h4>{t('common.registationPeriod')}</h4>
        <h4>{t('common.language')}</h4>
        <h4>{t('common.level')}</h4>
        <h4>{t('common.edit')}</h4>
      </div>
      <hr className={classes.GridDivider}/>
      <>
        {content.map((item, i) => {
          const {id} = item;
          return (
            <div key={i} className={classes.Grid}>
              <ControlledCheckbox
                onChange={() => handleCheckboxChange(id)}
                name={id}
                checked={checkboxes[id]}
              />
              <p><RegistrationPeriod withoutText period={[item]}/></p>
              <p>{language(item)}</p>
              <p>{level}</p>
              <button
                className={classes.EditButton}
                onClick={() => console.log('editing')}
              >
                <img src={editIcon} alt={'edit-icon'}/>
              </button>
            </div>
          )
        })}
      </>
      {addNewExamDateModal}
    </div>
  );
}

export default RegistrationDatesContent;