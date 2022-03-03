import React, {
  createContext, FC, useContext, useEffect, useState,
} from 'react';
import { gql, useSubscription } from '@apollo/client';
import { toast } from 'react-toastify';
import { MetricsContext } from './MetricsContext';

const query = gql`
  subscription NewMeasurement {
    newMeasurement {
      metric
      at
      value
      unit
    }
  }
`;

type MeasurementsContextProps = {
  measurements: {
    [key: string]: NewMeasurement
  }
};

export const MeasurementsContext = createContext<MeasurementsContextProps>({ measurements: {} });

type NewMeasurement = {
  metric: string;
  at: string;
  value: number;
  unit: string;
};

type MeasurementsResponse = {
  newMeasurement: NewMeasurement;
};

const MeasurementsProvider: FC<{ children: JSX.Element | JSX.Element[] }> = ({ children }) => {
  const [measurements, setMeasurements] = useState({});
  const { selectedMetrics } = useContext(MetricsContext);
  const { data, error } = useSubscription<MeasurementsResponse>(query);

  useEffect(() => {
    if (data?.newMeasurement?.metric && selectedMetrics.includes(data.newMeasurement.metric)) {
      setMeasurements({
        ...measurements,
        [data.newMeasurement.metric]: data.newMeasurement,
      });
    }
  }, [data?.newMeasurement?.metric]);

  useEffect(() => {
    if (error) {
      toast('Socket error. Connecting again.');
    }
  }, [error]);

  return (
    <MeasurementsContext.Provider value={{ measurements }}>
      {children}
    </MeasurementsContext.Provider>
  );
};
export default MeasurementsProvider;
