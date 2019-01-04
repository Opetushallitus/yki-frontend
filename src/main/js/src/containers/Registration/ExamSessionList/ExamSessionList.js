import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import PropTypes from 'prop-types';

import classes from './ExamSessionList.module.css';
import { LANGUAGES } from '../../../common/Constants';
import { levelDescription } from '../../../util/util';

class ExamSessionList extends Component {
  state = {
    language: null,
    level: '',
    area: '',
  };

  returnHandler = () => {
    if (!this.state.language) {
      return this.props.onReturn();
    }

    if (!this.state.level) {
      this.setState({ language: null });
    } else {
      this.setState({ level: '' });
    }
  };

  languageSelectHandler = language => this.setState({ language: language });

  levelSelectHandler = level => this.setState({ level: level });

  render() {
    const returnButton = (
      <button
        className={classes.Return}
        onClick={this.returnHandler}
        aria-label="Return"
      >
        &lt; {this.props.t('registration.return')}
      </button>
    );

    const title = (
      <p className={classes.Title}>{this.props.t('registration.title')}</p>
    );

    const languages = (
      <React.Fragment>
        <p className={classes.Instructions}>
          {this.props.t('registration.select.language')}
        </p>
        <div className={classes.Selections}>
          {LANGUAGES.map(l => (
            <span
              key={l.name}
              onClick={() => this.languageSelectHandler(l)}
              className={classes.Selection}
            >
              <p className={classes.SelectionText}>{l.name}</p>
            </span>
          ))}
        </div>
      </React.Fragment>
    );

    const levels = (
      <React.Fragment>
        <p className={classes.LanguageSelection}>
          {this.props.t('registration.selected.language')}:{' '}
          <strong>{this.state.language && this.state.language.name}</strong>
        </p>
        <p>{this.props.t('registration.select.level')}:</p>
        <div className={classes.Selections}>
          {this.state.language &&
            this.state.language.levels.map(lvl => (
              <span
                key={lvl}
                onClick={() => this.levelSelectHandler(lvl)}
                className={classes.Selection}
              >
                <p className={classes.SelectionText}>
                  {this.props.t(levelDescription(lvl))}
                </p>
              </span>
            ))}
        </div>
      </React.Fragment>
    );

    const selection = !this.state.language ? languages : levels;

    return (
      <React.Fragment>
        {returnButton}
        <div className={classes.Content}>
          {title}
          {selection}
        </div>
      </React.Fragment>
    );
  }
}

ExamSessionList.propTypes = {
  onReturn: PropTypes.func.isRequired,
};

export default withNamespaces()(ExamSessionList);
