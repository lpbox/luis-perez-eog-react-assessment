import React, { FC, useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import { MetricsContext } from '../../contexts/MetricsContext';
import CardHeader from '../../components/CardHeader';

const Measurements: FC = () => {
  const { metrics } = useContext(MetricsContext);

  return (
    <Grid container spacing={2}>
      {metrics.map(metric => (
        <Grid key={metric} item xs={12} sm={6} md={3}>
          <Card>
            <CardHeader title={metric} />
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
export default Measurements;
