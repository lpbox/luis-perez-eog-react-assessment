import React, { FC, useContext } from 'react';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import { MetricsContext } from '../../contexts/MetricsContext';
import Checkbox from '../../components/Checkbox';

const useStyles = makeStyles({
  formControl: {
    width: '100%',
  },
});

const Metrics: FC = () => {
  const { metrics, selectedMetrics, selectMetrics } = useContext(MetricsContext);
  const classes = useStyles();

  const handleChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    selectMetrics(e.target.value as string[]);
  };

  return (
    <FormControl className={classes.formControl}>
      <InputLabel id='metrics-select-label'>Metrics</InputLabel>
      <Select
        labelId='metrics-select-label'
        multiple
        value={selectedMetrics}
        onChange={handleChange}
        input={<Input />}
        renderValue={(selected) => (selected as string[]).join(', ')}
      >
        {metrics.map(metric => (
          <MenuItem key={metric} value={metric}>
            <Checkbox
              checked={selectedMetrics.includes(metric)}
            />
            <ListItemText>{metric}</ListItemText>
          </MenuItem>
        ))}
      </Select>
    </FormControl>

  );
};

export default Metrics;
