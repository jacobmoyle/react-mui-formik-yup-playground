import { red, orange, blue, grey } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: blue[700],
    },
    secondary: {
      main: orange[700],
    },
    error: {
      main: red["A400"],
    },
    background: {
      default: grey[50],
    },
  },
});

export default theme;
