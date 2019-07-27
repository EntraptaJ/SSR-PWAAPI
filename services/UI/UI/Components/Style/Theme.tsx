// UI/UI/Components/Style/Theme.tsx
import { createStyles, makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { useTheme as useMUITheme } from '@material-ui/styles';
import red from '@material-ui/core/colors/red';

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#18ffff',
      dark: '#482565'
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#eee',
    },
  },
});


export const useTheme = () => {

}