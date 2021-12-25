const express = require('express');
const shell = require('shelljs');
const app = express();

app.get('/apiHook', function (req, res) {
  console.log('请求1');
  console.log('req1', req.headers);
  res.send('hello world');
});
app.post('/apiHook', function (req, res) {
  console.log('请求2');
  if (req.headers['x-gitlab-event'] === 'Push Hook') {
    console.log('git 提交');
    if (shell.exec('sh ./push.sh').code !== 0) {
      console.log('打包完成');
      shell.exit(1);
    }
  }
  res.send({
    status: 200,
  });
});
app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:${3000}`);
});
