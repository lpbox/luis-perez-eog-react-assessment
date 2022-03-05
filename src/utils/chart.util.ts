import { groupBy } from 'lodash';
import { MeasurementData } from '../types/measurementData';
import { MeasurementChartDataItem } from '../types/measurementChartDataItem';

export const groupChartsByUnit = (measurements: MeasurementData[]) => groupBy(
  measurements,
  (measurement) => measurement.measurements?.[0].unit,
);

export const listMetricsGroupedByUnit = (
  measurements: MeasurementData[],
) => measurements.reduce(
  (accum: { [key: string]: string[] }, measurement) => {
    const unit = measurement.measurements?.[0].unit as string;
    return {
      ...accum,
      [unit]: [...(accum[unit] || []), measurement.metric],
    };
  }, {},
);

export const formatChartGroups = (chartGroups: {
  [key: string]: MeasurementData[]
}): MeasurementChartDataItem[][] => Object.entries(
  chartGroups,
).reduce((accum: MeasurementChartDataItem[][], [unit, groups]) => {
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

  const spreadChartData: MeasurementChartDataItem[] = Object.entries(
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
    } as MeasurementChartDataItem),
  );

  return [...accum, spreadChartData];
}, []);
