import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';

import axios from '../../../axios';
import classes from './AgreementPdf.module.css';

const agreementPdf = props => {
  const maxSize = 104857600;

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
      <div className={classes.UploadPdf} {...getRootProps()}>
        <input {...getInputProps()} />
        <button className={classes.UploadButton}>Lisää pdf</button>
      </div>
      {props.attachmentId && (
        <div className={classes.DownloadPdf}>
          <a
            href={`/yki/api/virkailija/organizer/${props.oid}/file/${
              props.attachmentId
            }`}
            className={classes.PdfLink}
            download
          >
            Lataa pdf
          </a>
        </div>
      )}
      {(apiError || fileRejected) && (
        <div className={classes.ErrorMessage}>
          Sopimuksen lisääminen epäonnistui
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
