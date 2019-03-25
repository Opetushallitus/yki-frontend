import React from 'react';
import PropTypes from 'prop-types';
import XLSX from 'xlsx';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

import { DATE_FORMAT } from '../../../../common/Constants';
import classes from './ListExport.module.css';

const defaultCol = { wch: 12 };
const columns = [
  defaultCol,
  defaultCol,
  defaultCol,
  defaultCol,
  defaultCol,
  defaultCol,
  { wch: 24 },
  { wch: 16 },
  { wch: 20 },
  defaultCol,
  defaultCol,
  defaultCol,
  { wch: 14 },
  defaultCol,
  { wch: 24 },
];

export const listExport = props => {
  const { t } = useTranslation();

  const toArrayBuffer = s => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);

    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  };

  const download = (url, type) => {
    const link = document.createElement('a');
    link.download = `osallistujat_${moment().format(DATE_FORMAT)}.${type}`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    link.remove();

    // needed for edge compatibility
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);
  };

  const stateToText = {
    COMPLETED: 'Maksanut',
    SUBMITTED: 'Ei maksanut',
    CANCELLED: 'Peruttu',
    PAID_AND_CANCELLED: 'Maksanut ja peruttu',
  };

  const exportToExcel = participants => {
    const data = participants.map(p => {
      return {
        etunimi: p.form.first_name,
        sukunimi: p.form.last_name,
        tila: stateToText[p.state],
        hetu: p.form.ssn,
        syntymaaika: p.form.birthdate,
        sukupuoli: p.form.gender ? (p.form.gender === '1' ? 'M' : 'N') : null,
        email: p.form.email,
        puhelin: p.form.phone_number,
        katuosoite: p.form.street_address,
        tehtavakieli: p.form.exam_lang,
        todistuskieli: p.form.certificate_lang,
        postinumero: p.form.zip,
        postitoimipaikka: p.form.post_office,
        kansalaisuus: p.form.nationality_desc ? p.form.nationality_desc : null,
        maksunumero: p.order_number ? p.order_number : null,
      };
    });
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    worksheet['!cols'] = columns;
    const sheetName = 'osallistujat';
    workbook.SheetNames.push(sheetName);
    workbook.Sheets[sheetName] = worksheet;

    const workbookOut = XLSX.write(workbook, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary',
    });

    let url = window.URL.createObjectURL(
      new Blob([toArrayBuffer(workbookOut)], {
        type: 'application/octet-stream',
      }),
    );
    download(url, 'xlsx');
  };

  return (
    <button
      className={classes.Button}
      onClick={() => exportToExcel(props.participants)}
      data-cy="button-export-to-excel"
    >
      {t('examSession.downloadExcel')}
    </button>
  );
};

listExport.propTypes = {
  participants: PropTypes.array.isRequired,
};

export default listExport;
