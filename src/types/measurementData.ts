import { MeasurementDataItem } from './measurementDataItem';

export type MeasurementData = {
  metric: string;
  measurements?: MeasurementDataItem[];
};
