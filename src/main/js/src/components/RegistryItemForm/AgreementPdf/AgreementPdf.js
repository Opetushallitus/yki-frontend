import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';

import axios from '../../../axios';
import classes from './AgreementPdf.module.css';

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
        .catch(() => {
          setSuccess(false);
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
      {(success === false || fileRejected) && (
        <p className={classes.ErrorMessage}>
          {t('registryItem.agreement.addPdfFailed')}
        </p>
      )}
      {success && (
        <p className={classes.SuccessMessage}>
          {t('registryItem.agreement.addPdfSuccess')}
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
