import Checkbox from '@material-ui/core/Checkbox';
import { withStyles, Theme } from '@material-ui/core/styles';

const checkboxStyles = (theme: Theme) => ({
  checked: {
    '& svg': {
      color: theme.palette.primary.main,
    },
  },
});
export default withStyles(checkboxStyles)(Checkbox);
