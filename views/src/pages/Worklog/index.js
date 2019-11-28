import React from 'react';
import WorklogComp from '../../components/Worklog';
import './worklog.scss';

class Worklog extends React.Component {
  render() {
    return (
      <div className="wl-content">
        <div className="title">维修日志</div>
        <WorklogComp />
      </div>
    );
  }
}

export default Worklog;
