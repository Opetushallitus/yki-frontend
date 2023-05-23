import React from 'react';
import { withTranslation } from 'react-i18next';

import PropTypes from "prop-types";
import HeadlineContainer from "../../HeadlineContainer/HeadlineContainer";
import YkiImage2 from "../../../assets/images/ophYki_image2.png";

export const ReEvaluationSuccessHeadline = props => {

  return (
    <HeadlineContainer
      headlineTitle={props.t('registration.reeval.success.title')}
      headlineContent={null}
      headlineImage={YkiImage2}
    />
  );
}

ReEvaluationSuccessHeadline.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation()(ReEvaluationSuccessHeadline);
