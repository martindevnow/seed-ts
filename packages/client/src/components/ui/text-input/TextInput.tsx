import React from 'react';

import classes from './TextInput.module.scss';

export const TextInput = ({ children }: any) => {
  return (
    <>
      <label className={classes.Label}>{children}</label>
      <input type="text" className={classes.TextInput}></input>
    </>
  );
};
