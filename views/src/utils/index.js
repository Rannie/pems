import { Base64 } from 'js-base64';

export default class Utils {
  static saveUser(user) {
    localStorage.setItem('pems_user', JSON.stringify(user));
  }

  static getUser() {
    const user = localStorage.getItem('pems_user');
    return user ? JSON.parse(user) : null;
  }

  static removeUser() {
    localStorage.removeItem('pems_user');
  }

  static getUserIndexPath() {
    return '/substation';
  }

  static getUserMenuItems() {
    return [
      {
        id: 'substation',
        linkTo: '/substation',
        index: true,
        menuIconType: 'retweet',
        menuTitle: '变电所',
      },
      {
        id: 'transbox',
        linkTo: '/transbox',
        index: false,
        menuIconType: 'code-sandbox',
        menuTitle: '箱变',
      },
      {
        id: 'lampins',
        linkTo: '/lampins',
        index: false,
        menuIconType: 'bulb',
        menuTitle: '路灯',
      },
      {
        id: 'worklog',
        linkTo: '/worklog',
        index: false,
        menuIconType: 'file-text',
        menuTitle: '日志',
      },
    ];
  }

  static getAreaList() {
    return ['全部', '北疆 110kv 站', '北港 110kv 站', '国际物流 35kv 站', '国际物流 3#kb 站'];
  }

  static generateEncodeName(imgName) {
    const source = `${this.getUser().name}-${imgName}-${new Date().getTime()}`;
    return Base64.encode(source);
  }
}
