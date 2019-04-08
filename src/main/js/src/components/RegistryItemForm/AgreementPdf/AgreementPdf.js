import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';

import axios from '../../../axios';

const agreementPdf = props => {
  const maxSize = 104857600;

  const onFileSelect = useCallback(acceptedFiles => {
    console.log('acceptedFiles', acceptedFiles);
    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);

    axios
      .post(`/yki/api/virkailija/organizer/${props.oid}/file`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(response => {
        console.log('response', response);
      })
      .catch(error => {
        console.log('error', error);
      });
  }, []);

  const { getRootProps, getInputProps, rejectedFiles } = useDropzone({
    noDrag: true,
    onDrop: onFileSelect,
    accept: 'application/pdf',
    minSize: 0,
    maxSize: maxSize,
  });

  const fileRejected = rejectedFiles.length > 0;
  const fileTooLarge = fileRejected > 0 && rejectedFiles[0].size > maxSize;
  console.log('isFileTooLarge', fileTooLarge);

  const loadFile = () => {
    axios
      .get(`/yki/api/virkailija/organizer/${props.oid}/file/${props.attachmentId}`)
      .then(response => {
        console.log('response', response);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.download = "file.pdf";
        link.href = url;
        document.body.appendChild(link);
        link.click();
        link.remove();
    
        // needed for edge compatibility
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 100);
      })
      .catch(error => {
        console.log('error', error);
      });
  };

  return (
    <div>
      <h3>Sopimus</h3>
      <p
        onClick={loadFile}
      >
        Lataa sopimus
      </p>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Lisää sopimus</p>
      </div>
    </div>
  );
};

agreementPdf.propTypes = {
  oid: PropTypes.string.isRequired,
  attachmentId: PropTypes.string,
};

export default agreementPdf;
