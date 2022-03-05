import { gql, useLazyQuery } from '@apollo/client';
import LinearProgress from '@material-ui/core/LinearProgress';
import { groupBy } from 'lodash';
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

type MeasurmentChartDataItemValue = {
  [key: string]: number;
};

type MeasurmentChartDataItem = MeasurmentChartDataItemValue & {
  at: number;
  unit: string;
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const psiMeasurements = (data?.getMultipleMeasurements || []).filter(
    (measurement) => measurement.measurements?.[0]?.unit === 'PSI',
  );

  const measurementsWithData = (data?.getMultipleMeasurements || []).filter(
    measurement => (measurement.measurements?.length || 0) > 0,
  );

  const chartGroups = groupBy(
    data?.getMultipleMeasurements || [],
    (measurement) => measurement.measurements?.[0].unit,
  );

  const metricsGroupedByUnit = measurementsWithData.reduce(
    (accum: { [key: string]: string[] }, measurement) => {
      const unit = measurement.measurements?.[0].unit as string;
      return {
        ...accum,
        [unit]: [...(accum[unit] || []), measurement.metric],
      };
    }, {},
  );

  const chartGroupsFormatted: MeasurmentChartDataItem[][] = Object.entries(
    chartGroups,
  ).reduce((accum: MeasurmentChartDataItem[][], [unit, groups]) => {
    const chartData = groupBy(
      groups
        .map((group) => (group.measurements || []).map((measurement) => ({
          metric: measurement.metric,
          at: measurement.at,
          value: measurement.value,
        })))
        .reduce((groupAccum, group) => [...groupAccum, ...group], []),
      'at',
    );

    const spreadChartData: MeasurmentChartDataItem[] = Object.entries(
      chartData,
    ).map(
      ([key, items]) => ({
        at: parseInt(key, 10),
        ...items.reduce(
          (chartDataAccum, item) => ({
            ...chartDataAccum,
            [item.metric]: item.value,
            unit,
          }),
          {},
        ),
      } as MeasurmentChartDataItem),
    );

    return [...accum, spreadChartData];
  }, []);

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
