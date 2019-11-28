import React from 'react';
import { Table, Button, Select, Divider, Modal, message } from 'antd';
import * as api from '../../api';
import './transbox.scss';
import utils from '../../utils';

const kPageSize = 8;
const areaList = utils.getAreaList();

const { Option } = Select;

class Transbox extends React.Component {
  state = {
    data: [],
    pagination: {},
    loading: false,
    area: areaList[0],
  };

  componentDidMount() {
    this.fetchList({ page_size: kPageSize, page_index: 1 });
  }

  fetchList = (params = {}) => {
    this.setState({ loading: true });
    api.transbox
      .getList({
        params,
      })
      .then(res => {
        const data = res.data.data;
        const { pagination } = this.state;
        pagination.total = data.count;
        pagination.pageSize = kPageSize;
        const transboxs = data.transboxs;
        this.checkResolveAndNotify(transboxs);
        this.setState({
          loading: false,
          data: transboxs,
          pagination,
        });
      });
  };

  checkResolveAndNotify = transboxs => {
    transboxs.forEach(item => {
      let UnresolvedButNotify = false;
      let UnresolvedNotNotify = false;
      for (let i = 0; i < item.worklogs.length; i += 1) {
        const worklog = item.worklogs[i];
        if (!worklog.resolved) {
          if (worklog.notify_user) {
            UnresolvedButNotify = true;
          } else {
            UnresolvedNotNotify = true;
          }
        }
      }
      item.unresolvedButNotify = UnresolvedButNotify;
      item.unresolvedNotNotify = UnresolvedNotNotify;
    });
  };

  handleTableChange = pagination => {
    const pager = { ...this.state.pagination };
    const area = this.state.area;
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });

    const params = { page_size: kPageSize, page_index: pager.current };
    if (area && area !== areaList[0]) {
      params.fil_area = area;
    }
    this.fetchList(params);
  };

  handleSelectChange = value => {
    this.setState({ area: value });
  };

  handleQueryClick = () => {
    const { pagination, area } = this.state;
    const page = pagination.current;
    const params = { page_size: kPageSize, page_index: page };
    if (area && area !== areaList[0]) {
      params.fil_area = area;
    }
    this.fetchList(params);
  };

  handleCreateClick = () => {
    const { history } = this.props;
    history.push('/transbox/edit');
  };

  handleSubstationClick = item => {
    const { history } = this.props;
    history.push({ pathname: '/transbox/detail', state: item });
  };

  handleEditClick = (record, event) => {
    event.stopPropagation();
    const { history } = this.props;
    history.push({ pathname: '/transbox/edit', state: record });
  };

  handleDeleteClick = (record, event) => {
    event.stopPropagation();
    Modal.confirm({
      title: '注意',
      content: `你确定要删除 ${record.name} 这个变电箱吗?`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        api.transbox.delete({ data: { id: record._id } }).then(
          () => {
            message.success('删除成功');
            const pager = { ...this.state.pagination };
            const area = this.state.area;
            pager.current = 1;
            this.setState({
              pagination: pager,
            });

            const params = { page_size: kPageSize, page_index: 1 };
            if (area && area !== areaList[0]) {
              params.fil_area = area;
            }
            this.fetchList(params);
          },
          err => {
            message.error(err.data.message);
          },
        );
      },
    });
  };

  render() {
    const { data, pagination, loading, area } = this.state;
    const columns = [
      {
        title: '箱变名称',
        dataIndex: 'name',
        width: '20%',
        render: (name, record) => {
          let appendStyle;
          if (record.unresolvedButNotify) {
            appendStyle = { color: '#fbc02d' };
          }
          if (record.unresolvedNotNotify) {
            appendStyle = { color: '#ef5350 ' };
          }
          return <div style={appendStyle}>{name}</div>;
        },
      },
      {
        title: '上级电源',
        dataIndex: 'superior',
        width: '20%',
      },
      {
        title: '区域',
        dataIndex: 'area',
        width: '20%',
      },
      {
        title: '联系方式',
        dataIndex: 'contact_info',
        width: '20%',
      },
      {
        title: '操作',
        key: 'action',
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
      <div className="transbox-list-content">
        <div className="title">箱变列表</div>
        <div className="filter-area">
          <div className="filter-title">区域查询:</div>
          <Select defaultValue={area} style={{ width: 200 }} onChange={this.handleSelectChange}>
            {utils.getAreaList().map(areaName => {
              return (
                <Option value={areaName} key={areaName}>
                  {areaName}
                </Option>
              );
            })}
          </Select>
          <Button className="query-button" type="primary" onClick={this.handleQueryClick}>
            查询
          </Button>
          <Button className="add-button" type="primary" onClick={this.handleCreateClick}>
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
          onRow={record => {
            return {
              onClick: this.handleSubstationClick.bind(this, record),
            };
          }}
        />
      </div>
    );
  }
}

export default Transbox;
