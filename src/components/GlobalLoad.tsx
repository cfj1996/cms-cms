/**
 * @name: globalLoad
 * @user: cfj
 * @date: 2021/12/19 15:47
 */
import React from 'react';
import ReactDOM from 'react-dom';
import styles from './load.less';
import { PageLoading } from '@ant-design/pro-layout';
import type { SpinProps } from 'antd';

let id = 0;
class GlobalLoad extends React.Component<SpinProps> {
  static open(options?: SpinProps) {
    id++;
    const div = document.createElement('div');
    div.setAttribute('id', `load-${id}`);
    ReactDOM.render(<GlobalLoad {...options} />, div);
    document.body.appendChild(div);
    return id as React.Key;
  }
  static close(id: React.Key) {
    const dom = document.getElementById(`load-${id}`);
    if (dom) {
      document.body.removeChild(dom);
    }
  }
  render() {
    return (
      <div className={styles.globalLoading}>
        <div className={styles.load}>
          <PageLoading {...this.props} />
        </div>
      </div>
    );
  }
}
export default GlobalLoad;
