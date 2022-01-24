/**
 * @name: home
 * @user: cfj
 * @date: 2022/1/24 16:52
 */
import { PageContainer } from '@ant-design/pro-layout';
import config from '../../package.json';

const Home = function () {
  return (
    <PageContainer>
      <p>欢迎来到{config.description}</p>
    </PageContainer>
  );
};

export default Home;
