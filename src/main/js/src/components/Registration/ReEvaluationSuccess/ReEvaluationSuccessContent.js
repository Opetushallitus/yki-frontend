import React from 'react';
import { withTranslation } from 'react-i18next';

import PropTypes from "prop-types";

export const ReEvaluationSuccessContent = props => {

  return (
    <p data-cy="payment-status-text">
      {props.t('payment.status.success.evaluation')}
    </p>
  );
}

ReEvaluationSuccessContent.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation()(ReEvaluationSuccessContent);
