import React from 'react';
import { connect } from 'react-redux';

import globe from '../../assets/svg/globe.svg';
import { MOBILE_WIDTH, TABLET_WIDTH } from '../../common/Constants';
import i18n from '../../i18n';
import * as actions from '../../store/actions';
import { capitalize } from '../../util/util';
import classes from './LanguageSelect.module.css';

const texts = { fi: 'suomeksi', sv: 'på svenska', en: 'in english' };
const languages = ['fi', 'sv', 'en'];

class LanguageSelect extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ykiLanguage: props.ykiLanguage,
      windowWidth: props.windowWidth,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.windowWidth !== this.props.windowWidth) {
      this.setState({ windowWidth: this.props.windowWidth });
    }
  }

  changeLanguage = lang => {
    document.documentElement.lang = lang;
    i18n.changeLanguage(lang);
  };

  handleLanguageChange = e => {
    const mobileOrTablet =
      this.state.windowWidth < MOBILE_WIDTH ||
      this.state.windowWidth < TABLET_WIDTH;
    if (mobileOrTablet) {
      this.props.setCollapsibleOpen(!this.props.isOpen);
    }

    const selected = e.target.value;
    this.props.onYkiLanguageChange(selected);
    i18n.changeLanguage(selected);
  };

  languageSelector = () => (
    <select
      name="language"
      className={classes.LanguageSelect}
      onChange={e => this.handleLanguageChange(e)}
      data-cy={'language-select'}
      defaultValue={this.state.ykiLanguage}
      aria-label={i18n.t('common.aria.changeLanguage')}
    >
      {languages.map(lang => (
        <option
          key={`SELECTOR-${lang}`}
          lang={lang}
          value={lang}
          className={classes.LanguageSelect}
        >
          {texts[lang]}
        </option>
      ))}
    </select>
  );

  languageLinks = () => (
    <div className={classes.MobileMenuItems}>
      {languages.map(lang => (
        <div key={`LINK-${lang}`}>
          <button
            className={
              this.state.ykiLanguage === lang
                ? classes.LanguageItemActive
                : classes.LanguageItem
            }
            value={lang}
            onClick={e => this.handleLanguageChange(e)}
          >
            {capitalize(texts[lang])}
          </button>
        </div>
      ))}
    </div>
  );

  render() {
    const mobileOrTablet =
      this.state.windowWidth < MOBILE_WIDTH ||
      this.state.windowWidth < TABLET_WIDTH;

    return (
      <>
        {mobileOrTablet ? (
          <>{this.languageLinks()}</>
        ) : (
          <div className={classes.SelectorContainer}>
            <img src={globe} aria-disabled alt={'globe-icon'} />
            {this.languageSelector()}
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    ykiLanguage: state.yki.ykiLanguage,
    windowWidth: state.yki.windowWidth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onYkiLanguageChange: ykiLanguage =>
      dispatch(actions.changeYKILanguage(ykiLanguage)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LanguageSelect);
