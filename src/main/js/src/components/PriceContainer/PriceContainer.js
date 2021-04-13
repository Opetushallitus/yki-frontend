import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { MOBILE_VIEW } from '../../common/Constants';
import { levelTranslations } from '../../util/util';
import classes from './PriceContainer.module.css';

const PriceContainer = props => {
  const { t } = useTranslation();
  const { elements } = props;

  const state = useSelector(state => state);
  const onMobileSV = state.yki.ykiLanguage === 'sv' && MOBILE_VIEW;
  const onMobileEN = state.yki.ykiLanguage === 'en' && MOBILE_VIEW;
  const childLength = elements.length;

  return (
    <div className={classes.PriceContainer}>
      <h2>{t('common.priceList')}</h2>
      <div
        className={
          onMobileSV || onMobileEN ? classes.PriceBoxSV : classes.PriceBox
        }
      >
        {elements.map((el, i) => {
          return (
            <>
              <div className={classes.MobilePriceBox}>
                <p>{t(el.title)}</p>
                <div
                  className={onMobileEN ? classes.PriceTagEN : classes.PriceTag}
                >
                  <div className={classes.Price}>{el.price}</div>
                  <div className={classes.Currency}>{'€'}</div>
                </div>
                {el.extraText && (
                  <p style={{ margin: '0px' }}>{t(el.extraText)}</p>
                )}
              </div>
              {i + 1 !== childLength && <hr />}
            </>
          );
        })}
      </div>
    </div>
  );
};

export default PriceContainer;
