// UI/UI/Components/Layout/AppBar/styles.tsx
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
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
