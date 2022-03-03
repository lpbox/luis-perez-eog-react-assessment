import React from 'react';
import { ToastContainer } from 'react-toastify';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import 'react-toastify/dist/ReactToastify.css';
import { Grid } from '@material-ui/core';
import {
  ApolloClient, ApolloProvider, HttpLink, InMemoryCache, split,
} from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import Header from './components/Header';
import Wrapper from './components/Wrapper';
import MainContainer from './components/MainContainer';
import MetricsProvider from './contexts/MetricsContext';
import Metrics from './Features/Metrics/Metrics';
import Measurements from './Features/Measurements/Measurements';
import MeasurementsProvider from './contexts/MeasurementsContext';

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition'
      && definition.operation === 'subscription'
    );
  },
  new WebSocketLink(new SubscriptionClient(
    'wss://react.eogresources.com/graphql',
    {
      reconnect: true,
    },
  )),
  new HttpLink({
    uri: 'https://react.eogresources.com/graphql',
  }),
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

const theme = createTheme({
  palette: {
    primary: {
      main: 'rgb(39,49,66)',
    },
    secondary: {
      main: 'rgb(197,208,222)',
    },
    background: {
      default: 'rgb(226,231,238)',
    },
  },
});

const App = () => (
  <ApolloProvider client={client}>
    <MuiThemeProvider theme={theme}>
      <MetricsProvider>
        <MeasurementsProvider>
          <CssBaseline />
          <Wrapper>
            <Header />
            <MainContainer>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                  <Metrics />
                </Grid>
                <Grid item xs={12}>
                  <Measurements />
                </Grid>
                <Grid item xs={12}>
                  <div>Graph</div>
                </Grid>
              </Grid>
            </MainContainer>
            <ToastContainer />
          </Wrapper>
        </MeasurementsProvider>
      </MetricsProvider>
    </MuiThemeProvider>
  </ApolloProvider>
);

export default App;
