import React from 'react';
import { Input, Select, Button, Form, message, Upload, Icon } from 'antd';
import './substation.scss';
import * as api from '../../api';
import utils from '../../utils';
import uploader from '../../utils/uploader';

const FormItem = Form.Item;
const Option = Select.Option;

class SubForm extends React.Component {
  constructor(props) {
    super(props);
    let appearUrl;
    let locationUrl;
    const substation = props.location.state;
    if (substation) {
      appearUrl = substation.appear_pic;
      locationUrl = substation.location_pic;
    }

    this.state = {
      isLoading: false,
      appearUrl,
      appearLoading: false,
      locationUrl,
      locationLoading: false,
      isAdd: !substation,
      substation: substation || {},
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    const { history } = this.props;
    const { isAdd, substation, appearUrl, locationUrl } = this.state;
    this.props.form.validateFields((error, values) => {
      if (error) {
        return;
      }

      values.appear_pic = appearUrl;
      values.location_pic = locationUrl;

      this.setState({ isLoading: true });
      const msg = isAdd ? '正在添加变电站...' : '正在更新变电站...';
      const hide = message.loading(msg, 0);
      if (isAdd) {
        api.substation.create({ data: values }).then(
          () => {
            hide();
            this.setState({ isLoading: false });
            const sucMsg = '添加成功';
            message.success(sucMsg);
            history.goBack();
          },
          () => {
            hide();
            this.setState({ isLoading: false });
          },
        );
      } else {
        api.substation.update({ data: { _id: substation._id, ...values } }).then(
          () => {
            hide();
            this.setState({ isLoading: false });
            const sucMsg = '更新成功';
            message.success(sucMsg);
            history.goBack();
          },
          () => {
            hide();
            this.setState({ isLoading: false });
          },
        );
      }
    });
  };

  handleAppearBeforeUpload = img => {
    this.setState({ appearLoading: true });
    uploader.multipartUpload(utils.generateEncodeName(img.name), img).then(
      res => {
        message.success('上传成功');
        const url = res.res.requestUrls[0];
        const list = url.split('?');
        const imgUrl = list[0];
        this.setState({ appearLoading: false, appearUrl: imgUrl });
      },
      () => {
        message.error('上传失败');
        this.setState({ appearLoading: false });
      },
    );
    return false;
  };

  handleLocationBeforeUpload = img => {
    this.setState({ appearLoading: true });
    uploader.multipartUpload(utils.generateEncodeName(img.name), img).then(
      res => {
        message.success('上传成功');
        const url = res.res.requestUrls[0];
        const list = url.split('?');
        const imgUrl = list[0];
        this.setState({ locationLoading: false, locationUrl: imgUrl });
      },
      () => {
        message.error('上传失败');
        this.setState({ locationLoading: false });
      },
    );
    return false;
  };

  handleAppearRemove = () => {
    this.setState({ appearUrl: null });
  };

  handleLocationRemove = () => {
    this.setState({ locationUrl: null });
  };

  render() {
    const {
      isLoading,
      isAdd,
      substation,
      appearLoading,
      appearUrl,
      locationLoading,
      locationUrl,
    } = this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const areaList = utils.getAreaList();
    areaList.shift();

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 15,
          offset: 5,
        },
      },
    };

    const uploadButton = loading => (
      <div>
        <Icon type={loading ? 'loading' : 'plus'} />
        <div>点击上传</div>
      </div>
    );

    const title = isAdd ? '添加变电所' : '编辑变电所';

    return (
      <div>
        <div className="form-title">{title}</div>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <FormItem label="变电所名称: ">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入变电所名称' }],
              initialValue: substation.name,
            })(<Input />)}
          </FormItem>
          <FormItem label="上级电源: ">
            {getFieldDecorator('superior', {
              rules: [{ required: true, message: '请输入上级电源' }],
              initialValue: substation.superior,
            })(<Input />)}
          </FormItem>
          <FormItem label="区域: ">
            {getFieldDecorator('area', {
              rules: [{ required: true, message: '请选择区域' }],
              initialValue: substation.area,
            })(
              <Select style={{ width: 200 }}>
                {areaList.map(areaName => {
                  return (
                    <Option value={areaName} key={areaName}>
                      {areaName}
                    </Option>
                  );
                })}
              </Select>,
            )}
          </FormItem>
          <FormItem label="用户: ">
            {getFieldDecorator('user_comp', { initialValue: substation.user_comp })(<Input />)}
          </FormItem>
          <FormItem label="联系人: ">
            {getFieldDecorator('contact_info', { initialValue: substation.contact_info })(
              <Input />,
            )}
          </FormItem>
          <FormItem label="计量表号: ">
            {getFieldDecorator('number', { initialValue: substation.number })(<Input />)}
          </FormItem>
          <FormItem label="外观图: ">
            <Upload
              accept="image/*"
              listType="picture-card"
              showUploadList={false}
              beforeUpload={this.handleAppearBeforeUpload}
            >
              {appearUrl ? (
                <img src={appearUrl} alt="appear" style={{ width: '100%' }} />
              ) : (
                uploadButton(appearLoading)
              )}
            </Upload>
            {appearUrl ? (
              <Button type="link" className="remove-button" onClick={this.handleAppearRemove}>
                删除图片 x
              </Button>
            ) : (
              <div />
            )}
          </FormItem>
          <FormItem label="变电所地理位置: ">
            <Upload
              accept="image/*"
              listType="picture-card"
              showUploadList={false}
              beforeUpload={this.handleLocationBeforeUpload}
            >
              {locationUrl ? (
                <img src={locationUrl} alt="location" style={{ width: '100%' }} />
              ) : (
                uploadButton(locationLoading)
              )}
            </Upload>
            {locationUrl ? (
              <Button type="link" className="remove-button" onClick={this.handleLocationRemove}>
                删除图片 x
              </Button>
            ) : (
              <div />
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button
              className="form-button"
              type="primary"
              htmlType="submit"
              block
              loading={isLoading}
            >
              提交
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
const EditSubForm = Form.create({})(SubForm);

class EditSubstation extends React.Component {
  render() {
    return (
      <div className="add-form-content">
        <EditSubForm isAdd {...this.props} />
      </div>
    );
  }
}

export default EditSubstation;
