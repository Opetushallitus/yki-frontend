import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { MOBILE_VIEW } from '../../common/Constants';
import classes from './PriceContainer.module.css';

const PriceContainer = props => {
  const { t } = useTranslation();
  const { elements } = props;

  const state = useSelector(state => state);
  const onMobileSV = state.yki.ykiLanguage === 'sv' && MOBILE_VIEW;
  const onMobileEN = state.yki.ykiLanguage === 'en' && MOBILE_VIEW;
  const childLength = elements.length;
  const threePerRow = childLength % 3 === 0;

  return (
    <div className={classes.PriceContainer} data-cy="price-container">
      <h2 style={{ textAlign: 'center' }}>{t('common.priceList')}</h2>
      <div
        className={
          onMobileSV || onMobileEN ? classes.PriceBoxSV : classes.PriceBox
        }
        style={{
          gridTemplateColumns: MOBILE_VIEW
            ? threePerRow
              ? '30% 5% 30% 5% 30%'
              : '45% 10% 45%'
            : null,
        }}
      >
        {elements.map((el, i) => {
          const lastInRow = !MOBILE_VIEW
            ? false
            : threePerRow
            ? (i + 1) % 3 === 0
            : (i + 1) % 2 === 0;
          const inLastRow = threePerRow
            ? i === childLength - 1 ||
              i === childLength - 2 ||
              i === childLength - 3
            : i === childLength - 1 || i === childLength - 2;

          return (
            <React.Fragment key={`${el.key}-${el.title}`}>
              <div
                data-cy={`price-element-${el.key}`}
                className={classes.MobilePriceBox}
                style={{
                  borderBottom:
                    !inLastRow && MOBILE_VIEW
                      ? '1px solid hsla(0, 0%, 86%, 1)'
                      : null,
                }}
              >
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
              {i + 1 !== childLength && !lastInRow && <hr />}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default PriceContainer;
