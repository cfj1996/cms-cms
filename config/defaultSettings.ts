import { Settings as LayoutSettings } from '@ant-design/pro-layout';
import packageConfig from '../package.json';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: packageConfig.description,
  pwa: false,
  logo: '/logo.png',
  iconfontUrl: '',
};

export default Settings;
