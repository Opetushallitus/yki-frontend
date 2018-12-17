import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';

import classes from './RegistryFilter.module.css';
import { filterByNameOrLocation } from '../../util/registryUtil';

class RegistryFilter extends Component {
  state = {
    input: '',
    language: '',
    level: '',
  };

  inputChangeHandler = event => {
    this.setState({ input: event.target.value });
  };

  notFiltering = () =>
    this.state.input === '' &&
    this.state.language === '' &&
    this.state.level === '';

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.input !== this.state.input) {
      if (this.notFiltering()) {
        this.props.onChange(false, []);
      } else {
        let filtered = [...this.props.registry];

        if (this.state.input !== '') {
          filtered = filterByNameOrLocation(filtered, this.state.input);
        }

        if (this.state.language !== '') {
          // filtered = filterByLanguage(filtered, this.state.language);
        }

        if (this.state.level !== '') {
          // filtered = filterByLevel(filtered, this.state.level);
        }
        this.props.onChange(true, filtered);
      }
    }
  };

  render() {
    return (
      <div className={classes.Filter}>
        <input
          type="search"
          placeholder={this.props.t('registry.search.placeholder')}
          onChange={this.inputChangeHandler}
        />
      </div>
    );
  }
}

export default withNamespaces()(RegistryFilter);
