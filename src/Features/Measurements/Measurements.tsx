import React, { FC, useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { MetricsContext } from '../../contexts/MetricsContext';
import CardHeader from '../../components/CardHeader';
import { MeasurementsContext } from '../../contexts/MeasurementsContext';

const Measurements: FC = () => {
  const { selectedMetrics } = useContext(MetricsContext);
  const { measurements } = useContext(MeasurementsContext);

  return (
    <Grid container spacing={2}>
      {selectedMetrics.map(metric => (
        <Grid key={metric} item xs={12} sm={6} md={3}>
          <Card>
            <CardHeader title={metric} />
            <CardContent>
              <Typography variant="h4">
                {measurements[metric]?.value || 0} {measurements[metric]?.unit}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
export default Measurements;
