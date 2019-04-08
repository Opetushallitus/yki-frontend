import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';

import axios from '../../../axios';
import classes from './AgreementPdf.module.css';

const agreementPdf = props => {
  const maxSize = 104857600;

  const [t] = useTranslation();
  const [apiError, setApiError] = useState(false);

  const onFileSelect = useCallback(acceptedFiles => {
    if (acceptedFiles.size) {
      const formData = new FormData();
      formData.append('file', acceptedFiles[0]);
      axios
        .post(`/yki/api/virkailija/organizer/${props.oid}/file`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then(() => {
          setApiError(false);
        })
        .catch(() => {
          setApiError(true);
        });
    }
  }, []);

  const { getRootProps, getInputProps, rejectedFiles } = useDropzone({
    noDrag: true,
    onDrop: onFileSelect,
    accept: 'application/pdf',
    minSize: 0,
    maxSize: maxSize,
  });

  const fileRejected = rejectedFiles.length > 0;

  return (
    <div className={classes.AgreementPdf}>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <button className={classes.UploadButton}>
          {t('registryItem.agreement.addPdf')}
        </button>
      </div>
      {(apiError || fileRejected) && (
        <div className={classes.ErrorMessage}>
          {t('registryItem.agreement.addPdfFailed')}
        </div>
      )}
    </div>
  );
};

agreementPdf.propTypes = {
  oid: PropTypes.string.isRequired,
  attachmentId: PropTypes.string,
};

export default agreementPdf;
