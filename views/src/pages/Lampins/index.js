import React from 'react';
import { Table, message, Button, Divider, Modal, Form, Input, DatePicker, Checkbox } from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import * as api from '../../api';
import './lampins.scss';

const kDefaultPageSize = 8;
const dateFormat = 'YYYY/MM/DD';

const FormItem = Form.Item;

class LampinsForm extends React.Component {
  submitForm = callback => {
    this.props.form.validateFields((error, values) => {
      if (error) {
        return;
      }

      callback(values);
    });
  };

  clearForm = () => {
    this.props.form.resetFields();
  };

  render() {
    const { form, editLampins } = this.props;
    const { getFieldDecorator } = form;
    const date = editLampins ? moment(editLampins.date, dateFormat) : null;
    const roadname = editLampins ? editLampins.content : null;
    const resolved = editLampins ? editLampins.resolved : false;
    const record = editLampins ? editLampins.record : null;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };

    return (
      <Form {...formItemLayout}>
        <FormItem label="日期:">
          {getFieldDecorator('date', {
            rules: [{ required: true, message: '请选择日期' }],
            initialValue: date,
          })(<DatePicker locale={locale} />)}
        </FormItem>
        <FormItem label="道路名称:">
          {getFieldDecorator('road_name', {
            rules: [{ required: true, message: '请输入道路名称' }],
            initialValue: roadname,
          })(<Input />)}
        </FormItem>
        <FormItem label="故障记录:">
          {getFieldDecorator('record', {
            rules: [{ required: true, message: '请输入故障记录' }],
            initialValue: record,
          })(<Input />)}
        </FormItem>
        <FormItem label="请勾选">
          {getFieldDecorator('resolved', {
            valuePropName: 'checked',
            initialValue: resolved,
          })(<Checkbox>是否解决</Checkbox>)}
        </FormItem>
      </Form>
    );
  }
}
const LIForm = Form.create({})(LampinsForm);

class Lampins extends React.Component {
  insForm;

  state = {
    data: [],
    pagination: {},
    loading: false,
    showModal: false,
    curIns: null,
  };

  componentDidMount() {
    this.fetchLampinsList({ page_size: kDefaultPageSize, page_index: 1 });
  }

  fetchLampinsList = (params = {}) => {
    this.setState({ loading: true });
    api.lampins.getList({ params }).then(res => {
      const data = res.data.data;
      const { pagination } = this.state;
      pagination.total = data.count;
      pagination.pageSize = kDefaultPageSize;
      this.setState({
        loading: false,
        data: data.lampins,
        pagination,
      });
    });
  };

  handleCreateClick = () => {
    this.setState({ showModal: true });
  };

  handleTableChange = pagination => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });

    const params = { page_size: kDefaultPageSize, page_index: pager.current };
    this.fetchLampinsList(params);
  };

  handleEditClick = record => {
    this.setState({ curIns: record, showModal: true });
  };

  handleDeleteClick = record => {
    Modal.confirm({
      title: '注意',
      content: '你确定要删除这条检查记录吗',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        const hide = message.loading('正在删除', 0);
        api.lampins.delete({ data: { id: record._id } }).then(
          () => {
            hide();
            message.success('删除成功');
            const pager = { ...this.state.pagination };
            pager.current = 1;
            this.setState({
              pagination: pager,
            });

            const params = { page_size: kDefaultPageSize, page_index: 1 };
            this.fetchLampinsList(params);
          },
          err => {
            hide();
            message.error(err.data.message);
          },
        );
      },
    });
  };

  handleModalSubmit = () => {
    const { curIns } = this.state;
    const isAdd = !curIns;
    const msg = isAdd ? '正在添加检查记录' : '正在更新检查记录';
    this.insForm.submitForm(values => {
      const hide = message.loading(msg, 0);
      if (isAdd) {
        api.lampins.create({ data: values }).then(
          () => {
            hide();
            message.success('添加成功');
            this.fetchLampinsList({ page_size: kDefaultPageSize, page_index: 1 });
            this.hideModalAndClear();
          },
          err => {
            hide();
            message.error(err.data.message);
          },
        );
      } else {
        api.lampins.update({ data: { _id: curIns._id, ...values } }).then(
          () => {
            hide();
            message.success('更新成功');
            this.fetchLampinsList({ page_size: kDefaultPageSize, page_index: 1 });
            this.hideModalAndClear();
          },
          err => {
            hide();
            message.error(err.data.message);
          },
        );
      }
    });
  };

  handleModalCancel = () => {
    this.hideModalAndClear();
  };

  hideModalAndClear() {
    this.setState({ curIns: null, showModal: false });
    this.insForm.clearForm();
  }

  render() {
    const { data, pagination, loading, showModal, curIns } = this.state;
    const isAdd = !curIns;
    const title = isAdd ? '添加路灯检查记录' : '编辑路灯检查记录';

    const columns = [
      {
        title: '日期',
        dataIndex: 'date',
        width: '15%',
        render: date => moment(date).format('LL'),
      },
      {
        title: '道路名称',
        dataIndex: 'road_name',
        width: '20%',
      },
      {
        title: '故障记录',
        dataIndex: 'record',
        width: '30%',
      },
      {
        title: '是否解决',
        dataIndex: 'resolved',
        render: resolved => (resolved ? '是' : '否'),
        width: '15%',
      },
      {
        title: '操作',
        key: 'action',
        width: '20%',
        render: record => (
          <div className="action-area">
            <Button
              className="action-button"
              type="link"
              onClick={this.handleEditClick.bind(this, record)}
            >
              编辑
            </Button>
            <Divider type="vertical" />
            <Button
              className="action-button"
              type="link"
              onClick={this.handleDeleteClick.bind(this, record)}
            >
              删除
            </Button>
          </div>
        ),
      },
    ];

    return (
      <div className="lampins-content">
        <div className="title">路灯巡视检查记录</div>
        <div className="oper-area">
          <Button type="primary" onClick={this.handleCreateClick}>
            新增
          </Button>
        </div>
        <Table
          columns={columns}
          rowKey={record => record._id}
          dataSource={data}
          pagination={pagination}
          loading={loading}
          onChange={this.handleTableChange}
        />
        <Modal
          title={title}
          visible={showModal}
          onOk={this.handleModalSubmit}
          onCancel={this.handleModalCancel}
          okText="提交"
          cancelText="取消"
        >
          <LIForm
            editLampins={curIns}
            wrappedComponentRef={ref => {
              this.insForm = ref;
            }}
          />
        </Modal>
      </div>
    );
  }
}

export default Lampins;
