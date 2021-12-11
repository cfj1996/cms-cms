import { Request, Response } from 'express';
import { mock, Random } from 'mockjs';

const USERNAME = 'admin';
const PASSWORD = '123456';
const LOGS: string[] = [];
function createToken() {
  return mock('@guid') + '&' + (new Date().getTime() + 10000 * 1000);
}

export function parsingToken(token: string) {
  const time = token.split('&')?.[1];
  const now = new Date().getTime();
  return !!(time && Number(time) > now);
}

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 登录获取token
  'POST /api/login': (req: Request, res: Response) => {
    const { password, username } = req.body;
    if (password === PASSWORD && username === USERNAME) {
      const token = createToken();
      LOGS.push(token);
      res.send({
        status: 200,
        success: true,
        data: token,
      });
    } else {
      res.send({
        status: 400,
        message: '用户密码错误',
      });
    }
  },
  // 登出
  'GET /api/logout': (req: Request, res: Response) => {
    const token = req.headers.token;
    console.log('token', token);
    const index = LOGS.indexOf(<string>token);
    if (index > -1) {
      LOGS.splice(index, 1);
    }
    res.send({
      status: 200,
      success: true,
      data: true,
    });
  },
  // 获取登录用户信息
  'GET /api/user/getInfo': (req: Request, res: Response) => {
    const token = req.headers.token as string;
    if (token && parsingToken(token)) {
      res.send({
        status: 200,
        success: true,
        data: {
          username: Random.name(),
          id: mock('@guid'),
          createdTime: new Date().getTime(),
          avatar: Random.image('200x200'),
        },
      });
    } else {
      res.status(403).send({
        status: 403,
        message: '登录过期',
      });
    }
  },
};
