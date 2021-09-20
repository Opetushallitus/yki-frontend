import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import Dropzone from 'react-dropzone';
import { useTranslation } from 'react-i18next';

import axios from '../../../axios';
import classes from './AgreementPdf.module.css';
import * as i18nKeys from "../../../common/LocalizationKeys";

const agreementPdf = props => {
  const maxSize = 104857600;

  const [t] = useTranslation();
  const [success, setSuccess] = useState(null);

  const onFileSelect = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      const formData = new FormData();
      formData.append('file', acceptedFiles[0]);

      setSuccess(null);
      axios
        .post(`/yki/api/virkailija/organizer/${props.oid}/file`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then(() => {
          setSuccess(true);
        })
        .catch(e => {
          console.log(e);
          setSuccess(false);
        });
    }
  }, []);

  return (
    <div className={classes.AgreementPdf}>
      <Dropzone
        accept="application/pdf"
        minSize={0}
        maxSize={maxSize}
        noDrag={true}
        onDropAccepted={acceptedFiles => {
          onFileSelect(acceptedFiles);
        }}
        onDropRejected={() => setSuccess(false)}
      >
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p className={classes.UploadButton}>
              {t(i18nKeys.registryItem_agreement_addPdf)}
            </p>
          </div>
        )}
      </Dropzone>

      {success === false && (
        <p className={classes.ErrorMessage}>
          {t(i18nKeys.registryItem_agreement_addPdfFailed)}
        </p>
      )}
      {success && (
        <p className={classes.SuccessMessage}>
          {t(i18nKeys.registryItem_agreement_addPdfSuccess)}
        </p>
      )}
    </div>
  );
};

agreementPdf.propTypes = {
  oid: PropTypes.string.isRequired,
  attachmentId: PropTypes.string,
};

export default agreementPdf;
