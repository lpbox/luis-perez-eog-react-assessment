import React from 'react';
import { ToastContainer } from 'react-toastify';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import 'react-toastify/dist/ReactToastify.css';
import { Grid } from '@material-ui/core';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import Header from './components/Header';
import Wrapper from './components/Wrapper';
import MainContainer from './components/MainContainer';
import MetricsProvider from './contexts/MetricsContext';
import Metrics from './Features/Metrics/Metrics';
import Measurements from './Features/Measurements/Measurements';

const client = new ApolloClient({
  uri: 'https://react.eogresources.com/graphql',
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
      </MetricsProvider>
    </MuiThemeProvider>
  </ApolloProvider>
);

export default App;
