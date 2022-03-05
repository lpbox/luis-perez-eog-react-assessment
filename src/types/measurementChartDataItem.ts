import { MeasurementChartDataItemValue } from './measurmentChartDataItemValue';

export type MeasurementChartDataItem = MeasurementChartDataItemValue & {
  at: number;
  unit: string;
};
