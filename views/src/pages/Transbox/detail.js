import React from 'react';
import { Row, Col, Tabs } from 'antd';
import Voltage from '../../components/Voltage';
import Lowvol from '../../components/Lowvol';
import Transformer from '../../components/Transformer';
import Worklog from '../../components/Worklog';
import './transbox.scss';

const { TabPane } = Tabs;

class TransboxDetail extends React.Component {
  render() {
    const { location } = this.props;
    const transbox = location.state;

    const appearStyle = transbox.appear_pic ? { maxHeight: '320px' } : { display: 'none' };
    const locationStyle = transbox.location_pic ? { maxHeight: '320px' } : { display: 'none' };

    return (
      <div className="trans-detail-content">
        <div className="title">{transbox.name}</div>
        <div className="tab-area">
          <Tabs defaultActiveKey="1" animated={false}>
            <TabPane tab="详情" key="1">
              <div className="detail-wrapper">
                <div className="row-normal">
                  <Row gutter={16}>
                    <Col span={4}>
                      <div className="col-normal">箱变名称:</div>
                    </Col>
                    <Col span={8}>
                      <div className="col-normal">{transbox.name}</div>
                    </Col>
                    <Col span={4}>
                      <div className="col-normal">上级电源:</div>
                    </Col>
                    <Col span={8}>
                      <div className="col-normal">{transbox.superior}</div>
                    </Col>
                  </Row>
                </div>
                <div className="row-normal">
                  <Row gutter={16}>
                    <Col span={4}>
                      <div className="col-normal">用户:</div>
                    </Col>
                    <Col span={8}>
                      <div className="col-normal">{transbox.user_comp || ''}</div>
                    </Col>
                    <Col span={4}>
                      <div className="col-normal">联系人:</div>
                    </Col>
                    <Col span={8}>
                      <div className="col-normal">{transbox.contact_info || ''}</div>
                    </Col>
                  </Row>
                </div>
                <div className="row-normal">
                  <Row gutter={16}>
                    <Col span={4}>
                      <div className="col-normal">区域:</div>
                    </Col>
                    <Col span={8}>
                      <div className="col-normal">{transbox.area}</div>
                    </Col>
                  </Row>
                </div>
                <div className="row-pic">
                  <Row gutter={16}>
                    <Col span={12}>
                      <div className="col-pic">
                        <div className="col-pic-label">外观图：</div>
                        <img src={transbox.appear_pic} alt="appear" style={appearStyle} />
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="col-pic">
                        <div className="col-pic-label">变电所地理位置：</div>
                        <img src={transbox.location_pic} alt="location" style={locationStyle} />
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </TabPane>
            <TabPane tab="高压室" key="2">
              <Voltage transbox={transbox} />
            </TabPane>
            <TabPane tab="低压室" key="3">
              <Lowvol transbox={transbox} />
            </TabPane>
            <TabPane tab="变压器室" key="4">
              <Transformer transbox={transbox} />
            </TabPane>
            <TabPane tab="维修日志" key="5">
              <Worklog transbox={transbox} />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default TransboxDetail;
