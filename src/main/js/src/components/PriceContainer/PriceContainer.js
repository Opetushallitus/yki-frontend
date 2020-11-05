import React from 'react';
import {levelTranslations} from '../../util/util';
import {useTranslation} from "react-i18next";

import classes from './PriceContainer.module.css';
import {useSelector} from "react-redux";
import {MOBILE_VIEW} from "../../common/Constants";

const PriceContainer = () => {
    const {t} = useTranslation();

    const state = useSelector(state => state);
    const onMobileSV = (state.yki.ykiLanguage === 'sv' && MOBILE_VIEW);
    const onMobileEN = (state.yki.ykiLanguage === 'en' && MOBILE_VIEW);

    return (
        <div className={classes.PriceContainer}>
            <h2>{t('common.priceList')}</h2>
             <div className={onMobileSV || onMobileEN ? classes.PriceBoxSV : classes.PriceBox}>
                <div className={classes.MobilePriceBox}>
                    <p>{t(levelTranslations.PERUS)}</p>
                    <div className={onMobileEN ?  classes.PriceTagEN : classes.PriceTag}>
                        <div className={classes.Price}>100</div>
                        <div className={classes.Currency}>{'€'}</div>
                    </div>
                </div>
                <hr/>
                <div className={classes.MobilePriceBox}>
                    <p>{t(levelTranslations.KESKI)}</p>
                    <div className={classes.PriceTag}>
                        <div className={classes.Price}>123</div>
                        <div className={classes.Currency}>{'€'}</div>
                    </div>
                </div>
                <hr/>
                <div className={classes.MobilePriceBox}>
                    <p>{t(levelTranslations.YLIN)}</p>
                    <div className={classes.PriceTag}>
                        <div className={classes.Price}>160</div>
                        <div className={classes.Currency}>{'€'}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PriceContainer;