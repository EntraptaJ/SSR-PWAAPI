// UI/UI/Components/Style/Theme.tsx
import red from '@material-ui/core/colors/red';
import { createMuiTheme }  from '@material-ui/core/styles';

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#18ffff'
    },
    secondary: {
      main: '#19857b'
    },
    error: {
      main: red.A400
    },
    background: {
      default: '#eee'
    }
  },
  overrides: {
    MuiDrawer: {
      modal: {
        // @ts-ignore
        zIndex: `1200 !important` as number
      }
    }
  }
});
