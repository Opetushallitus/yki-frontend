import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';

class Init extends Component {
  componentDidMount() {
    this.props.onFetchUser();
  }

  render() {
    return this.props.loading ? <Spinner /> : this.props.children;
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.user,
    loading: state.user.loading,
    error: state.user.error,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchUser: () => dispatch(actions.fetchUser()),
  };
};

Init.propTypes = {
  children: PropTypes.any.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Init);
