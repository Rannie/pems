import React from 'react';
import './login.scss';
import { Input, Icon, Button, Form, message } from 'antd';
import userService from '../../services/user';

const FormItem = Form.Item;

class LoginForm extends React.Component {
  state = {
    isLoading: false,
  };

  setLoadingState = isLoading => {
    this.setState({
      isLoading,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }

      this.setLoadingState(true);
      const hide = message.loading('正在登录...', 0);
      userService.login(values).then(
        () => {
          this.setLoadingState(false);
          hide();
          message.success('登录成功');
          this.props.history.push('/');
        },
        error => {
          this.setLoadingState(false);
          hide();
          message.error(error.data.message);
        },
      );
    });
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { isLoading } = this.state;
    return (
      <Form style={{ margin: '24px 30px 0px' }} onSubmit={this.handleSubmit}>
        <FormItem>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入用户名' }],
          })(
            <Input
              size="large"
              placeholder="输入用户名"
              prefix={<Icon type="user" style={{ color: 'rgba(0, 0, 0, 0.25)' }} />}
            />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码' }],
          })(
            <Input.Password
              size="large"
              placeholder="输入密码"
              prefix={<Icon type="lock" style={{ color: 'rgba(0, 0, 0, 0.25)' }} />}
            />,
          )}
        </FormItem>
        <Button type="primary" htmlType="submit" size="large" block loading={isLoading}>
          登录
        </Button>
      </Form>
    );
  }
}
const PEMSLoginForm = Form.create({})(LoginForm);

class Login extends React.Component {
  render() {
    return (
      <div className="login-wrapper">
        <div className="login-panel">
          <div className="title">电力设施管理系统</div>
          <div className="divider">
            <div className="line" />
          </div>
          <PEMSLoginForm {...this.props} />
        </div>
      </div>
    );
  }
}

export default Login;
