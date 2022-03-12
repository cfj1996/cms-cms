/**
 * @name: home
 * @user: cfj
 * @date: 2022/1/24 16:52
 */
import { PageContainer } from '@ant-design/pro-layout';
import config from '../../package.json';
import Dialog from '@/components/Dialog';
let i = 0;
function open(title: any) {
  i++;
  Dialog.open({
    title: title + '-' + i,
    content: (
      <button onClick={() => open(title)}>
        打开{title} -{i}
      </button>
    ),
  });
}

setTimeout(() => {
  Dialog.closeAll();
}, 3000);
const Home = function () {
  return (
    <PageContainer>
      <p onClick={() => open(1)}>欢迎来到{config.description}</p>
    </PageContainer>
  );
};

export default Home;
