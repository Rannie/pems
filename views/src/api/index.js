import axios from 'axios';
import { message } from 'antd';
import utils from '../utils';
import constants from '../constants';

const instance = axios.create({
  baseURL: `${process.env.SERVICE_URL}/api/pems`,
  timeout: 10000,
});

instance.interceptors.request.use(
  config => {
    const user = utils.getUser();
    if (user) {
      const token = user.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => Promise.reject(error),
);

instance.interceptors.response.use(
  res => {
    const body = res.data;
    if (body.success === false) {
      if (body.code === 10001) {
        message.error('参数异常');
      }
      return Promise.reject(res);
    }
    return res;
  },
  error => {
    const res = error.response;
    if (res && res.status === 401 && /authentication/i.test(res.data.error)) {
      message.info('登录信息已过期，请重新登录');
      utils.removeUser();
      // react-redux dispatch
      window.location.href = constants.HOME_URL;
    } else if (res && res.data && res.data.error) {
      message.error(res.data.error);
    }
    return error;
  },
);

const createAPI = (url, method, config) => {
  config = config || {};
  return instance({
    url,
    method,
    ...config,
  });
};

const user = {
  login: config => createAPI('/login', 'post', config),
};

const substation = {
  getList: config => createAPI('/substation/list', 'get', config),
  create: config => createAPI('/substation/create', 'post', config),
  delete: config => createAPI('/substation/delete', 'post', config),
  update: config => createAPI('/substation/update', 'post', config),
};

const voltage = {
  getList: config => createAPI('/voltage/list', 'get', config),
  create: config => createAPI('/voltage/create', 'post', config),
  update: config => createAPI('/voltage/update', 'post', config),
  delete: config => createAPI('/voltage/delete', 'post', config),
};

const lowvol = {
  getList: config => createAPI('/lowvol/list', 'get', config),
  create: config => createAPI('/lowvol/create', 'post', config),
  update: config => createAPI('/lowvol/update', 'post', config),
  delete: config => createAPI('/lowvol/delete', 'post', config),
};

const transformer = {
  getList: config => createAPI('/transformer/list', 'get', config),
  create: config => createAPI('/transformer/create', 'post', config),
  update: config => createAPI('/transformer/update', 'post', config),
  delete: config => createAPI('/transformer/delete', 'post', config),
};

const worklog = {
  getList: config => createAPI('/worklog/list', 'get', config),
  create: config => createAPI('/worklog/create', 'post', config),
  update: config => createAPI('/worklog/update', 'post', config),
  delete: config => createAPI('/worklog/delete', 'post', config),
};

const lampins = {
  getList: config => createAPI('/lampins/list', 'get', config),
  create: config => createAPI('/lampins/create', 'post', config),
  update: config => createAPI('/lampins/update', 'post', config),
  delete: config => createAPI('/lampins/delete', 'post', config),
};

const transbox = {
  getList: config => createAPI('/transbox/list', 'get', config),
  create: config => createAPI('/transbox/create', 'post', config),
  update: config => createAPI('/transbox/update', 'post', config),
  delete: config => createAPI('/transbox/delete', 'post', config),
};

export { user, substation, voltage, lowvol, transformer, worklog, lampins, transbox };
