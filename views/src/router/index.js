import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { unAuthRoutes, userRoutes } from './routes';
import MainLayout from '../components/MainLayout';
import userService from '../services/user';
import Utils from '../utils';

const routeGuard = routerConfig => (
  <Route
    key={routerConfig.id}
    path={routerConfig.path}
    exact={routerConfig.exact}
    render={props => {
      const hasLogin = userService.hasLogin();
      const { pathname } = props.location;

      if (!hasLogin) {
        if (pathname !== '/login') {
          return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
        } else {
          return <routerConfig.component {...props} route={routerConfig} />;
        }
      }

      if (routerConfig.redirectToPath) {
        return (
          <Redirect
            to={{ pathname: routerConfig.redirectToPath, state: { from: props.location } }}
          />
        );
      }

      const indexPath = Utils.getUserIndexPath();
      if (pathname === '/login' || pathname === '/') {
        return <Redirect to={{ pathname: indexPath, state: { from: props.location } }} />;
      }

      return <routerConfig.component {...props} route={routerConfig} />;
    }}
  />
);

class AppRouter extends React.Component {
  render() {
    return (
      <Switch>
        {unAuthRoutes.map(routerConfig => routeGuard(routerConfig))}
        <MainLayout>
          <Switch>{userRoutes.map(routerConfig => routeGuard(routerConfig))}</Switch>
        </MainLayout>
      </Switch>
    );
  }
}

export default AppRouter;
