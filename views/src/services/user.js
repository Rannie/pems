import md5 from 'crypto-js/md5';
import utils from '../utils';
import * as api from '../api';

class UserService {
  static SharedInstance() {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  constructor() {
    this.currentUser = utils.getUser();
  }

  getLoginUser() {
    return this.currentUser;
  }

  hasLogin() {
    return this.currentUser !== undefined && this.currentUser !== null;
  }

  login(values) {
    const config = {
      data: {
        name: values.name,
        password: md5(values.password).toString(),
      },
    };

    return new Promise((resolve, reject) => {
      api.user.login(config).then(
        res => {
          this.currentUser = res.data.data;
          utils.saveUser(this.currentUser);
          resolve();
        },
        error => {
          reject(error);
        },
      );
    });
  }

  logout() {
    this.currentUser = null;
    utils.removeUser();
  }
}

export default UserService.SharedInstance();
