import React, { Component } from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';

import { LANGUAGES } from '../../common/Constants';
import { firstCharToUpper } from '../../util/util';

class LanguageSelect extends Component {
  state = {
    languages: [],
  };

  componentDidMount() {
    const languages = [];
    for (const lang in LANGUAGES) {
      for (const level in lang.levels) {
        const lName = lang.name + ' / ' + firstCharToUpper(level);
        languages.push({
          value: lName,
          label: lName,
          code: lang.code,
          level: level,
        });
      }
    }

    this.setState({ languages: languages });
  }

  render() {
    return (
      <Select
        isMulti
        name="colors"
        options={this.state.languages}
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={value => this.props.onChange(value)}
      />
    );
  }
}

LanguageSelect.propTypes = {
  onChange: PropTypes.func,
};

export default LanguageSelect;
