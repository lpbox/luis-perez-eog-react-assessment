import { gql, useLazyQuery } from '@apollo/client';
import LinearProgress from '@material-ui/core/LinearProgress';
import moment from 'moment';
import React, { FC, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { makeStyles } from '@material-ui/core/styles';
import { MetricsContext } from '../../contexts/MetricsContext';
import { MeasurementData } from '../../types/measurementData';
import { formatChartGroups, groupChartsByUnit, listMetricsGroupedByUnit } from '../../utils/chart.util';

const query = gql`
  query ($input: [MeasurementQuery]) {
    getMultipleMeasurements(input: $input) {
      metric
      measurements {
        metric
        at
        value
        unit
      }
    }
  }
`;

const chartColors = [
  '#E69F00',
  '#56B4E9',
  '#009E73',
  '#F0E442',
  '#0072B2',
  '#D55E00',
  '#CC79A7',
  '#000000',
];

type MeasurementDataResponse = {
  getMultipleMeasurements: MeasurementData[];
};

const useStyles = makeStyles({
  container: {
    marginBottom: 24,
  },
});

const Charts: FC = () => {
  const classes = useStyles();
  const startTime = new Date().getTime() - 60 * 60 * 1000;
  const { selectedMetrics } = useContext(MetricsContext);
  const [getMeasurements, { loading, error, data }] = useLazyQuery<MeasurementDataResponse>(query);

  useEffect(() => {
    getMeasurements({
      variables: {
        input: selectedMetrics.map((metric) => ({
          metricName: metric,
          after: startTime,
        })),
      },
    });
  }, [selectedMetrics.length]);

  if (loading) return <LinearProgress />;
  if (error) {
    toast.error('Failed to load measurements history data.');
    return null;
  }
  if (!data) return null;

  const measurementsWithData = (data?.getMultipleMeasurements || []).filter(
    measurement => (measurement.measurements?.length || 0) > 0,
  );

  const chartGroups = groupChartsByUnit(measurementsWithData);

  const metricsGroupedByUnit = listMetricsGroupedByUnit(measurementsWithData);

  const chartGroupsFormatted = formatChartGroups(chartGroups);

  return (
    <>
      {chartGroupsFormatted.map(chartGroup => (
        <ResponsiveContainer
          key={chartGroup[0].unit}
          width="100%"
          height={400}
          className={classes.container}
        >
          <LineChart
            data={chartGroup}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 10,
            }}
          >
            <XAxis
              dataKey="at"
              tickCount={4}
              minTickGap={160}
              tickFormatter={(timeOffset) => moment(timeOffset).format('hh:mm A')}
              label={{
                value: 'Time Offset',
                position: 'bottom',
                offset: 0,
              }}
              scale="band"
            />
            <YAxis
              label={chartGroup[0].unit.toUpperCase()}
              type="number"
              tickCount={4}
            />
            {metricsGroupedByUnit[chartGroup[0].unit].map((metric, index) => (
              <Line
                key={metric}
                type="monotone"
                dataKey={metric}
                stroke={chartColors[index]}
                dot={false}
              />
            ))}
            <Tooltip
              labelFormatter={(timeOffset) => moment(timeOffset).format('hh:mm A')}
            />
            <Legend verticalAlign="top" />
          </LineChart>
        </ResponsiveContainer>
      ))}
    </>
  );
};
export default Charts;
