/**
 * @name: TypographyItem
 * @user: cfj
 * @date: 2021/12/12 3:21
 */
import React from 'react';
import { Typography } from 'antd';
import styles from './TypographyItem.less';

interface IProps {
  label: React.ReactNode;
  value: React.ReactNode;
}
const TypographyItem = function (props: IProps) {
  const { label, value } = props;
  return (
    <div className={styles.container}>
      <Typography.Text className={styles.label} strong>
        {label}
      </Typography.Text>
      <Typography className={styles.value}>{value || '--'}</Typography>
    </div>
  );
};

export default TypographyItem;
