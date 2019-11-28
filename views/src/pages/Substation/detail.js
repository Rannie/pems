import React from 'react';
import { Row, Col, Tabs } from 'antd';
import Voltage from '../../components/Voltage';
import Lowvol from '../../components/Lowvol';
import Transformer from '../../components/Transformer';
import Worklog from '../../components/Worklog';
import './substation.scss';

const { TabPane } = Tabs;

class SubstationDetail extends React.Component {
  render() {
    const { location } = this.props;
    const substation = location.state;

    const appearStyle = substation.appear_pic ? { maxHeight: '320px' } : { display: 'none' };
    const locationStyle = substation.location_pic ? { maxHeight: '320px' } : { display: 'none' };

    return (
      <div className="sub-detail-content">
        <div className="title">{substation.name}</div>
        <div className="tab-area">
          <Tabs defaultActiveKey="1" animated={false}>
            <TabPane tab="详情" key="1">
              <div className="detail-wrapper">
                <div className="row-normal">
                  <Row gutter={16}>
                    <Col span={4}>
                      <div className="col-normal">变电所名称:</div>
                    </Col>
                    <Col span={8}>
                      <div className="col-normal">{substation.name}</div>
                    </Col>
                    <Col span={4}>
                      <div className="col-normal">上级电源:</div>
                    </Col>
                    <Col span={8}>
                      <div className="col-normal">{substation.superior}</div>
                    </Col>
                  </Row>
                </div>
                <div className="row-normal">
                  <Row gutter={16}>
                    <Col span={4}>
                      <div className="col-normal">用户:</div>
                    </Col>
                    <Col span={8}>
                      <div className="col-normal">{substation.user_comp || ''}</div>
                    </Col>
                    <Col span={4}>
                      <div className="col-normal">联系人:</div>
                    </Col>
                    <Col span={8}>
                      <div className="col-normal">{substation.contact_info || ''}</div>
                    </Col>
                  </Row>
                </div>
                <div className="row-normal">
                  <Row gutter={16}>
                    <Col span={4}>
                      <div className="col-normal">计量表号:</div>
                    </Col>
                    <Col span={8}>
                      <div className="col-normal">{substation.number || ''}</div>
                    </Col>
                    <Col span={4}>
                      <div className="col-normal">区域:</div>
                    </Col>
                    <Col span={8}>
                      <div className="col-normal">{substation.area}</div>
                    </Col>
                  </Row>
                </div>
                <div className="row-pic">
                  <Row gutter={16}>
                    <Col span={12}>
                      <div className="col-pic">
                        <div className="col-pic-label">外观图：</div>
                        <img src={substation.appear_pic} alt="appear" style={appearStyle} />
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="col-pic">
                        <div className="col-pic-label">变电所地理位置：</div>
                        <img src={substation.location_pic} alt="location" style={locationStyle} />
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </TabPane>
            <TabPane tab="高压室" key="2">
              <Voltage substation={substation} />
            </TabPane>
            <TabPane tab="低压室" key="3">
              <Lowvol substation={substation} />
            </TabPane>
            <TabPane tab="变压器室" key="4">
              <Transformer substation={substation} />
            </TabPane>
            <TabPane tab="维修日志" key="5">
              <Worklog substation={substation} />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default SubstationDetail;
