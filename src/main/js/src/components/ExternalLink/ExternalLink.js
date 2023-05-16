import React from "react";
import { useTranslation } from "react-i18next";
import classes from "./ExternalLink.module.css";

export const ExternalLink = ({ label, url, ...rest }) => {
  const { t } = useTranslation();

  return (
    <div className={classes.ExternalLinkIcon}>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('common.newTab')}
        {...rest}
      >
        {label}
        <img
          src={require('../../assets/svg/external-link.svg')}
          alt={t('common.newTab')}
        />
      </a>
    </div>
  );
};
