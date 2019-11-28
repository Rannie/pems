import React from 'react';
import { Table, message, Button, Divider, Modal, Form, Input } from 'antd';
import * as api from '../../api';
import './transformer.scss';

const kDefaultPageSize = 8;
const FormItem = Form.Item;

class TransForm extends React.Component {
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
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const editTransformer = this.props.editTransformer || {};

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

    return (
      <Form {...formItemLayout}>
        <FormItem label="变压器编号:">
          {getFieldDecorator('serial_number', {
            rules: [{ required: true, message: '请输入变压器编号' }],
            initialValue: editTransformer.serial_number || '',
          })(<Input />)}
        </FormItem>
        <FormItem label="变压器型号:">
          {getFieldDecorator('model', { initialValue: editTransformer.model })(<Input />)}
        </FormItem>
      </Form>
    );
  }
}
const TraForm = Form.create({})(TransForm);

class Transformer extends React.Component {
  traForm;

  state = {
    data: [],
    pagination: {},
    loading: false,
    showModal: false,
    curTrans: null,
  };

  componentDidMount() {
    this.fetchTransList({ page_size: kDefaultPageSize, page_index: 1 });
  }

  fetchTransList = (params = {}) => {
    const { substation, transbox } = this.props;
    if (substation) {
      params.subId = substation._id;
    }
    if (transbox) {
      params.transId = transbox._id;
    }

    this.setState({ loading: true });
    api.transformer.getList({ params }).then(res => {
      const data = res.data.data;
      const { pagination } = this.state;
      pagination.total = data.count;
      pagination.pageSize = kDefaultPageSize;
      this.setState({
        loading: false,
        data: data.transformers,
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
    this.fetchTransList(params);
  };

  handleEditClick = record => {
    this.setState({ curTrans: record, showModal: true });
  };

  handleDeleteClick = record => {
    Modal.confirm({
      title: '注意',
      content: '你确定要删除这个变压器吗',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        const hide = message.loading('正在删除', 0);
        api.transformer.delete({ data: { id: record._id } }).then(
          () => {
            hide();
            message.success('删除成功');
            const pager = { ...this.state.pagination };
            pager.current = 1;
            this.setState({
              pagination: pager,
            });

            const params = { page_size: kDefaultPageSize, page_index: 1 };
            this.fetchTransList(params);
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
    const { curTrans } = this.state;
    const isAdd = !curTrans;
    const msg = isAdd ? '正在添加变压器' : '正在更新变压器';
    this.traForm.submitForm(values => {
      const hide = message.loading(msg, 0);
      if (isAdd) {
        let data;
        if (substation) {
          data = { subId: substation._id, ...values };
        }
        if (transbox) {
          data = { transId: transbox._id, ...values };
        }

        api.transformer.create({ data }).then(
          () => {
            hide();
            message.success('添加成功');
            this.fetchTransList({ page_size: kDefaultPageSize, page_index: 1 });
            this.hideModalAndClear();
          },
          err => {
            hide();
            message.error(err.data.message);
          },
        );
      } else {
        api.transformer.update({ data: { _id: curTrans._id, ...values } }).then(
          () => {
            hide();
            message.success('更新成功');
            this.fetchTransList({ page_size: kDefaultPageSize, page_index: 1 });
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
    this.setState({ curTrans: null, showModal: false });
    this.traForm.clearForm();
  }

  render() {
    const { data, pagination, loading, showModal, curTrans } = this.state;
    const isAdd = !curTrans;
    const title = isAdd ? '添加变压器' : '编辑变压器';

    const columns = [
      {
        title: '变压器编号',
        dataIndex: 'serial_number',
        width: '30%',
      },
      {
        title: '变压器型号',
        dataIndex: 'model',
        width: '40%',
      },
      {
        title: '操作',
        key: 'action',
        width: '30%',
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
      <div className="trans-content">
        <div className="oper-area">
          <Button type="primary" onClick={this.handleCreateClick}>
            新增
          </Button>
          <Modal
            title={title}
            visible={showModal}
            onOk={this.handleModalSubmit}
            onCancel={this.handleModalCancel}
            okText="提交"
            cancelText="取消"
          >
            <TraForm
              editTransformer={curTrans}
              wrappedComponentRef={ref => {
                this.traForm = ref;
              }}
            />
          </Modal>
        </div>
        <Table
          columns={columns}
          rowKey={record => record._id}
          dataSource={data}
          pagination={pagination}
          loading={loading}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default Transformer;
