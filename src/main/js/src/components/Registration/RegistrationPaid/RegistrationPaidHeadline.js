import React from "react";
import { withTranslation } from "react-i18next";

import PropTypes from "prop-types";
import HeadlineContainer from "../../HeadlineContainer/HeadlineContainer";
import ExamDetailsCard from "../ExamDetailsPage/ExamDetailsCard/ExamDetailsCard";
import YkiImage2 from "../../../assets/images/ophYki_image2.png";

export const RegistrationPaidHeadline = props => {

  return (
    <HeadlineContainer
      headlineTitle={props.t('registration.paid.title')}
      headlineContent={
        <ExamDetailsCard
          isFull={false}
          exam={props.examSession}
          showExam={true}
        />
      }
      headlineImage={YkiImage2}
    />
  );
}

RegistrationPaidHeadline.propTypes = {
  examSession: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(RegistrationPaidHeadline);