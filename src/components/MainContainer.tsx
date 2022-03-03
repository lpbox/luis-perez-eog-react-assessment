import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';

const useStyles = makeStyles({
  wrapper: {
    paddingTop: 24,
  },
});

type MainContainerProps = {
  children: JSX.Element | JSX.Element[]
};

const MainContainer: React.FC<MainContainerProps> = ({ children }) => {
  const classes = useStyles();

  return (
    <Container className={classes.wrapper}>{children}</Container>
  );
};

export default MainContainer;
