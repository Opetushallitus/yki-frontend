import React from 'react';
import { Route } from 'react-router-dom';
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";

const RegistrationLayout = ({ children }) => (
    <>
      <Header />
      {children}
      <Footer />
    </>
);

const RegistrationRoute = ({component: Component, ...rest}) => {
  return (
      <Route {...rest} render={matchProps => (
          <RegistrationLayout>
            <Component {...matchProps} />
          </RegistrationLayout>
      )} />
  )
};

export default RegistrationRoute;