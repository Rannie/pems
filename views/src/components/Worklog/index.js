import React from 'react';
import { Table, message, Button, Divider, Modal, Form, Input, DatePicker, Checkbox } from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import * as api from '../../api';
import './worklog.scss';

const kDefaultPageSize = 8;
const dateFormat = 'YYYY/MM/DD';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

class WorklogForm extends React.Component {
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
    const { form, editWorklog } = this.props;
    const { getFieldDecorator } = form;
    const date = editWorklog ? moment(editWorklog.date, dateFormat) : null;
    const content = editWorklog ? editWorklog.content : null;
    const resolved = editWorklog ? editWorklog.resolved : false;
    const notify_user = editWorklog ? editWorklog.notify_user : false;

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
        <FormItem label="维修内容和故障隐患:">
          {getFieldDecorator('content', {
            rules: [{ required: true, message: '请输入维修内容和故障隐患' }],
            initialValue: content,
          })(<TextArea />)}
        </FormItem>
        <FormItem label="请勾选">
          {getFieldDecorator('resolved', {
            valuePropName: 'checked',
            initialValue: resolved,
          })(<Checkbox>是否解决</Checkbox>)}
        </FormItem>
        <FormItem label="请勾选">
          {getFieldDecorator('notify_user', {
            valuePropName: 'checked',
            initialValue: notify_user,
          })(<Checkbox>是否通知用户</Checkbox>)}
        </FormItem>
      </Form>
    );
  }
}
const WLForm = Form.create({})(WorklogForm);

class Worklog extends React.Component {
  logForm;

  state = {
    data: [],
    pagination: {},
    loading: false,
    showModal: false,
    curLog: null,
  };

  componentDidMount() {
    this.fetchWorklogList({ page_size: kDefaultPageSize, page_index: 1 });
  }

  fetchWorklogList = (params = {}) => {
    const { substation, transbox } = this.props;
    if (substation) {
      params.subId = substation._id;
    }
    if (transbox) {
      params.transId = transbox._id;
    }
    this.setState({ loading: true });
    api.worklog.getList({ params }).then(res => {
      const data = res.data.data;
      const { pagination } = this.state;
      pagination.total = data.count;
      pagination.pageSize = kDefaultPageSize;
      this.setState({
        loading: false,
        data: data.worklogs,
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
    this.fetchWorklogList(params);
  };

  handleEditClick = record => {
    this.setState({ curLog: record, showModal: true });
  };

  handleDeleteClick = record => {
    Modal.confirm({
      title: '注意',
      content: '你确定要删除这条日志吗',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        const hide = message.loading('正在删除', 0);
        api.worklog.delete({ data: { id: record._id } }).then(
          () => {
            hide();
            message.success('删除成功');
            const pager = { ...this.state.pagination };
            pager.current = 1;
            this.setState({
              pagination: pager,
            });

            const params = { page_size: kDefaultPageSize, page_index: 1 };
            this.fetchWorklogList(params);
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
    const { substation, transbox } = this.props;
    const { curLog } = this.state;
    const isAdd = !curLog;
    const msg = isAdd ? '正在添加日志' : '正在更新日志';
    this.logForm.submitForm(values => {
      const hide = message.loading(msg, 0);
      if (isAdd) {
        let data;
        if (substation) {
          data = { subId: substation._id, ...values };
        }
        if (transbox) {
          data = { transId: transbox._id, ...values };
        }

        api.worklog.create({ data }).then(
          () => {
            hide();
            message.success('添加成功');
            this.fetchWorklogList({ page_size: kDefaultPageSize, page_index: 1 });
            this.hideModalAndClear();
          },
          err => {
            hide();
            message.error(err.data.message);
          },
        );
      } else {
        api.worklog.update({ data: { _id: curLog._id, ...values } }).then(
          () => {
            hide();
            message.success('更新成功');
            this.fetchWorklogList({ page_size: kDefaultPageSize, page_index: 1 });
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
    this.setState({ curLog: null, showModal: false });
    this.logForm.clearForm();
  }

  render() {
    const { data, pagination, loading, showModal, curLog } = this.state;
    const { substation, transbox } = this.props;
    const isAdd = !curLog;
    const title = isAdd ? '添加日志' : '编辑日志';
    const addAreaStyle = substation || transbox ? { display: 'block' } : { display: 'none' };

    const columns = [
      {
        title: '变电所/箱变名称',
        width: '15%',
        render: record => {
          if (record.substation) {
            return <div>{record.substation.name}</div>;
          }
          if (record.transbox) {
            return <div>{record.transbox.name}</div>;
          }
          return <div />;
        },
      },
      {
        title: '日期',
        dataIndex: 'date',
        width: '15%',
        render: date => moment(date).format('LL'),
      },
      {
        title: '维修内容和故障隐患',
        dataIndex: 'content',
        width: '30%',
      },
      {
        title: '解决',
        dataIndex: 'resolved',
        render: resolved => (resolved ? '是' : '否'),
        width: '10%',
      },
      {
        title: '通知用户',
        dataIndex: 'notify_user',
        render: notify_user => (notify_user ? '是' : '否'),
        width: '10%',
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
      <div className="worklog-content">
        <div className="oper-area" style={addAreaStyle}>
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
          <WLForm
            editWorklog={curLog}
            wrappedComponentRef={ref => {
              this.logForm = ref;
            }}
          />
        </Modal>
      </div>
    );
  }
}

export default Worklog;
