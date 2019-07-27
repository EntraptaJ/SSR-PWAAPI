// UI/UI/Components/Layout/AppBar/index.tsx
import React, { useMemo } from 'react';
import { useConfig } from 'UI/Components/Providers/ConfigProvider';
import TopAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { SessionActions } from 'UI/Components/Providers/SessionProvider/SessionActions';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1
    },
    toolbar: theme.mixins.toolbar
  })
);

function AppBar(): React.ReactElement {
  const { appName } = useConfig();
  const classes = useStyles();

  return useMemo(
    () => (
      <>
        <TopAppBar position='fixed' color='primary'>
          <Toolbar>
            <div id='navActions'>
              <></>
            </div>
            <Typography variant='h6' className={classes.title}>
              {appName}
            </Typography>
            <SessionActions />
          </Toolbar>
        </TopAppBar>
        <div className={classes.toolbar} />
      </>
    ),
    []
  );
}

export default AppBar;
