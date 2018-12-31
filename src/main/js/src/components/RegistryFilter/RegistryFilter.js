import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';

import classes from './RegistryFilter.module.css';
import { levelDescription } from '../../util/util';
import {
  filterByNameOrLocation,
  filterByLanguage,
  filterByLevel,
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

  levelSelectHandler = event => {
    this.setState({ level: event.target.value });
  };

  notFiltering = () =>
    this.state.input === '' &&
    this.state.language === '' &&
    this.state.level === '';

  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevState.input !== this.state.input ||
      prevState.language !== this.state.language ||
      prevState.level !== this.state.level
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
          filtered = filterByLevel(filtered, this.state.level);
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
          classes.Select,
          this.state.language === '' ? classes.Placeholder : classes.Selected,
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

    const levelSelect = (
      <select
        value={this.state.level}
        className={[
          classes.Select,
          this.state.level === '' ? classes.Placeholder : classes.Selected,
        ].join(' ')}
        onChange={this.levelSelectHandler}
        data-cy="level-filter"
      >
        <option value="">
          {this.props.t('registry.search.levelSelectPlaceholder')}
        </option>
        {LANGUAGES[0].levels.map(l => (
          <option key={l} value={l}>
            {levelDescription(l)}
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
        {levelSelect}
      </div>
    );
  }
}

export default withNamespaces()(RegistryFilter);
