import React, { createContext, FC, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import LinearProgress from '@material-ui/core/LinearProgress';

const query = gql`
  query {
    getMetrics
  }
`;

type MetricsResponse = {
  getMetrics: string[];
};

type MetricsContextProps = {
  loading: boolean;
  metrics: string[];
  selectedMetrics: string[];
  selectMetrics: (metrics: string[]) => void;
};

export const MetricsContext = createContext<MetricsContextProps>({
  loading: false, metrics: [], selectedMetrics: [], selectMetrics: () => {},
});

const MetricsProvider: FC<{
  children: JSX.Element | JSX.Element[];
}> = ({
  children,
}) => {
  const { loading, data } = useQuery<MetricsResponse>(query);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);

  if (loading) return <LinearProgress />;

  return (
    <MetricsContext.Provider
      value={{
        loading,
        metrics: data?.getMetrics || [],
        selectedMetrics,
        selectMetrics: setSelectedMetrics,
      }}
    >
      {children}
    </MetricsContext.Provider>
  );
};

export default MetricsProvider;
