import React, { FC, useContext, useEffect } from 'react';
import { groupBy } from 'lodash';
import { gql, useLazyQuery } from '@apollo/client';
import LinearProgress from '@material-ui/core/LinearProgress';
import { toast } from 'react-toastify';
import {
  Legend,
  Line,
  LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import moment from 'moment';
import { MetricsContext } from '../../contexts/MetricsContext';

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

type MeasurementDataItem = {
  metric: string;
  at: string;
  value: number;
  unit: string;
};

type MeasurementData = {
  metric: string;
  measurements?: MeasurementDataItem[];
};

type MeasurementDataResponse = {
  getMultipleMeasurements: MeasurementData[];
};

const Charts: FC = () => {
  const startTime = new Date().getTime() - 60 * 60 * 1000;
  const { selectedMetrics } = useContext(MetricsContext);
  const [getMeasurements, {
    loading, error, data,
  }] = useLazyQuery<MeasurementDataResponse>(query);

  useEffect(() => {
    getMeasurements({
      variables: {
        input: selectedMetrics.map(
          metric => ({ metricName: metric, after: startTime }),
        ),
      },
    });
  }, [selectedMetrics.length]);

  if (loading) return <LinearProgress />;
  if (error) {
    toast.error('Failed to load measurements history data.');
    return null;
  }
  if (!data) return null;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const psiMeasurements = (data?.getMultipleMeasurements || []).filter(
    measurement => measurement.measurements?.[0]?.unit === 'PSI',
  );

  const psiMeasurementsGrouped = Object.entries(groupBy(
    psiMeasurements.map(
      group => (group.measurements || []).map(
        measurement => ({
          metric: measurement.metric,
          at: measurement.at,
          value: measurement.value,
        }),
      ),
    ).reduce(
      (accum, group) => [...accum, ...group],
      [],
    ),
    'at',
  )).map(([key, items]) => ({
    at: parseInt(key, 10),
    ...items.reduce((accum, item) => ({
      ...accum,
      [item.metric]: item.value,
    }), {}),
  }));

  return (
    <>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={psiMeasurementsGrouped}
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
            tickFormatter={timeOffset => moment(timeOffset).format('hh:mm A')}
            label={{
              value: 'Time Offset',
              position: 'bottom',
              offset: 0,
            }}
            scale="band"
          />
          <YAxis label="PSI" type="number" tickCount={4} />
          {psiMeasurements.map((psiMeasurement, index) => (
            <Line
              type="monotone"
              dataKey={psiMeasurement.metric}
              stroke={chartColors[index]}
              dot={false}
            />
          ))}
          <Tooltip
            labelFormatter={timeOffset => moment(timeOffset).format('hh:mm A')}
          />
          <Legend verticalAlign='top' />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};
export default Charts;
