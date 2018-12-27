import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';

import classes from './RegistryFilter.module.css';
import {
  filterByNameOrLocation,
  filterByLanguage,
} from '../../util/registryUtil';
import { LANGUAGES } from '../../common/Constants';

class RegistryFilter extends Component {
  state = {
    input: '',
    language: '',
    level: '',
  };

  inputChangeHandler = event => {
    this.setState({ input: event.target.value });
  };

  languageSelectHandler = event => {
    this.setState({ language: event.target.value });
  };

  notFiltering = () =>
    this.state.input === '' &&
    this.state.language === '' &&
    this.state.level === '';

  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevState.input !== this.state.input ||
      prevState.language !== this.state.language
    ) {
      if (this.notFiltering()) {
        this.props.onChange(false, []);
      } else {
        let filtered = [...this.props.registry];

        if (this.state.input !== '') {
          filtered = filterByNameOrLocation(filtered, this.state.input);
        }

        if (this.state.language !== '') {
          filtered = filterByLanguage(filtered, this.state.language);
        }

        if (this.state.level !== '') {
          // filtered = filterByLevel(filtered, this.state.level);
        }
        this.props.onChange(true, filtered);
      }
    }
  };

  render() {
    const languageSelect = (
      <select
        value={this.state.language}
        className={[
          classes.Language,
          this.state.language === ''
            ? classes.Placeholder
            : classes.LanguageSelected,
        ].join(' ')}
        onChange={this.languageSelectHandler}
        data-cy="language-filter"
      >
        <option value="">
          {this.props.t('registry.search.languageSelectPlaceholder')}
        </option>
        {LANGUAGES.map(l => (
          <option key={l.code} value={l.code}>
            {l.name}
          </option>
        ))}
      </select>
    );

    return (
      <div className={classes.Filter}>
        <input
          type="search"
          placeholder={this.props.t('registry.search.placeholder')}
          onChange={this.inputChangeHandler}
        />
        {languageSelect}
      </div>
    );
  }
}

export default withNamespaces()(RegistryFilter);
