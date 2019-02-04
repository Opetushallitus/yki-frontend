import React, { Component } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import PropTypes from 'prop-types';
import axios from '../../axios';

export class NationalitySelect extends Component {
  state = {
    nationalities: [],
    error: false,
  };

  componentDidMount() {
    axios
      .get(
        '/koodisto-service/rest/json/maatjavaltiot2/koodi?onlyValidKoodis=true',
      )
      .then(({ data }) => {
        this.setState({ nationalities: data });
      })
      .catch(err => {
        this.setState({ error: true });
      });
  }

  render() {
    const nationalityOptions = state.nationalities.map(n => {
      const name = n.metadata.find(m => {
        m.kieli === this.props.lng.toUpperCase();
      });
      return (
        <option value={n.koodiArvo} key={n.koodiArvo}>
          {name}
        </option>
      );
    });

    return (
      <Field
        component="select"
        name="nationality"
        className={this.props.className}
        data-cy="select-nationality"
      >
        {nationalityOptions}
      </Field>
    );
  }
}

NationalitySelect.propTypes = {
  className: PropTypes.string.isRequired,
};

export default withNamespaces()(NationalitySelect);
