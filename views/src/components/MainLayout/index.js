import React from 'react';
import { Layout, Menu, Icon, Avatar, Popover, message, Button } from 'antd';
import './layout.scss';
import { withRouter, NavLink } from 'react-router-dom';
import userService from '../../services/user';
import utils from '../../utils';

const { Header, Sider, Content } = Layout;
const MenuItem = Menu.Item;

class UserMenu extends React.Component {
  render() {
    const menuList = utils.getUserMenuItems();
    const { pathname } = this.props.location;
    const { collapsed } = this.props;
    const selectedMenu =
      pathname !== '/'
        ? menuList.find(_ => pathname.includes(_.linkTo))
        : menuList.find(_ => _.index);
    const selectedMenuKeys = selectedMenu ? [selectedMenu.id] : ['404'];

    return (
      <Menu mode="inline" defaultSelectedKeys={selectedMenuKeys}>
        {menuList.map(item => {
          return (
            <MenuItem key={item.id} className="menu-item">
              <NavLink to={item.linkTo}>
                <Icon type={item.menuIconType} className="icon" />
                {collapsed ? '' : item.menuTitle}
              </NavLink>
            </MenuItem>
          );
        })}
      </Menu>
    );
  }
}
const SideUserMenu = withRouter(UserMenu);

class MainLayout extends React.Component {
  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  logout = () => {
    const hideLoading = message.loading('正在退出登录...', 0);
    userService.logout();
    hideLoading();
    this.props.history.push('/login');
  };

  render() {
    const { collapsed } = this.state;
    const { history } = this.props;
    const user = userService.getLoginUser();
    if (!user) {
      history.push('/login');
      return <div> </div>;
    }
    const { name } = user;
    return (
      <Layout className="main-layout">
        <Sider trigger={null} collapsible collapsed={collapsed} theme="light" width="240">
          <div className="menu-head-wrapper">
            {!collapsed && (
              <a className="menu-title" href="/">
                设备管理系统
              </a>
            )}
          </div>
          <SideUserMenu collapsed={collapsed} />
        </Sider>
        <Layout>
          <Header className="main-header">
            <div className="sep-line" />
            <Icon
              className="trigger"
              type={collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
            <Popover
              content={
                <Button type="link" onClick={this.logout}>
                  退出登录
                </Button>
              }
              trigger="hover"
            >
              <div className="user">
                <div className="user-name">{name}</div>
                <Avatar className="user-avatar">{name.charAt(0) || 'U'}</Avatar>
              </div>
            </Popover>
          </Header>
          <Content className="content">{this.props.children}</Content>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(MainLayout);
