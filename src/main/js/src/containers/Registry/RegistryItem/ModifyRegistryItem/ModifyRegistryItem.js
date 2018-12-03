import React, { Component } from 'react';

import classes from './ModifyRegistryItem.module.css';

class ModifyRegistryItem extends Component {
  render() {
    console.log(this.props.item);
    return (
      <div className={classes.Content}>
        <h1>{this.props.item.name}</h1>
      </div>
    );
  }
}

export default ModifyRegistryItem;
