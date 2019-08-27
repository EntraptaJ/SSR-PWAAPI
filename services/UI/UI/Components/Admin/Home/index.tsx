// UI/UI/Components/Admin/Home/index.tsx
import React from 'react';
import { Section } from 'UI/Components/Layout/Section';
import { useStyles } from './styles';

export function AdminHome(): React.ReactElement {
  const classes = useStyles();

  return (
    <>
      <Section
        background='secondary'
        title={{ title: 'Administration', message: 'This is the administration portal' }}
        className={classes.topSection}
      />
    </>
  );
}
