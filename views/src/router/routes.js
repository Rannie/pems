import Login from '../pages/Login';
import Substation from '../pages/Substation';
import Transbox from '../pages/Transbox';
import Lampins from '../pages/Lampins';
import Worklog from '../pages/Worklog';
import NotFound from '../pages/NotFound';
import EditSubstation from '../pages/Substation/edit';
import SubstationDetail from '../pages/Substation/detail';
import EditTransbox from '../pages/Transbox/edit';
import TransboxDetail from '../pages/Transbox/detail';

export const unAuthRoutes = [
  {
    id: 'login',
    path: '/login',
    component: Login,
    exact: true,
  },
];

export const userRoutes = [
  {
    id: 'entry',
    path: '/',
    exact: true,
  },
  {
    id: 'substation',
    path: '/substation',
    component: Substation,
    exact: true,
  },
  {
    id: 'edit-substation',
    path: '/substation/edit',
    component: EditSubstation,
    exact: true,
  },
  {
    id: 'detail-substation',
    path: '/substation/detail',
    component: SubstationDetail,
    exact: true,
  },
  {
    id: 'transbox',
    path: '/transbox',
    component: Transbox,
    exact: true,
  },
  {
    id: 'edit-transbox',
    path: '/transbox/edit',
    component: EditTransbox,
    exact: true,
  },
  {
    id: 'detail-transbox',
    path: '/transbox/detail',
    component: TransboxDetail,
    exact: true,
  },
  {
    id: 'lampins',
    path: '/lampins',
    component: Lampins,
    exact: true,
  },
  {
    id: 'worklog',
    path: '/worklog',
    component: Worklog,
    exact: true,
  },
  {
    id: '404',
    path: '/404',
    component: NotFound,
    exact: true,
  },
  {
    id: '*',
    path: '*',
    redirectToPath: '/404',
  },
];
