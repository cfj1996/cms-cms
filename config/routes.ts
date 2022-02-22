export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: '主页',
    path: '/home',
    icon: 'HomeOutlined',
    component: './home',
  },
  {
    name: '系统管理',
    path: '/system',
    icon: 'UsergroupAddOutlined',
    access: 'admin',
    routes: [
      {
        name: '账户管理',
        path: 'account',
        component: './Account',
      },
      {
        name: '操作日志',
        path: 'logs',
        component: './logs',
      },
      { exact: true, redirect: '/system/account' },
    ],
  },
  {
    path: '/nft',
    name: '藏品管理',
    icon: 'PayCircleOutlined',
    routes: [
      {
        name: '藏品系列',
        path: 'nftType',
        component: './nft/nftType',
      },
      {
        name: '藏品库',
        path: 'nftSeries',
        component: './nft/nftSeries',
      },
      {
        name: '热点关键词',
        path: 'keyword',
        component: './nft/keyword',
      },
      {
        name: '发行方管理',
        path: 'issuer',
        component: './nft/issuer',
      },
      { exact: true, redirect: '/nft/nftType' },
    ],
  },
  {
    name: '审核管理',
    path: '/review',
    icon: 'FileDoneOutlined',
    routes: [
      {
        name: '内容审核',
        path: 'contentReview',
        component: './review/contentReview',
      },
      { exact: true, redirect: '/review/contentReview' },
    ],
  },
  {
    name: '用户管理',
    path: '/users',
    icon: 'TeamOutlined',
    routes: [
      {
        name: '平台用户',
        path: 'platformUsers',
        component: './platformUser',
      },
      { exact: true, redirect: '/users/platformUsers' },
    ],
  },
  {
    name: '订单管理',
    path: '/order',
    icon: 'ProfileOutlined',
    routes: [
      {
        name: 'nft订单',
        path: 'nftOrder',
        component: './order',
      },
      { exact: true, redirect: '/order/nftOrder' },
    ],
  },
  {
    name: '前台配置',
    path: '/front',
    icon: 'AppstoreOutlined',
    routes: [
      {
        name: 'banner管理',
        path: 'banner',
        component: './banner',
      },
      {
        name: '活动管理',
        path: 'activity',
        component: './activity',
      },
      {
        name: '盲盒管理',
        path: 'blindBox',
        component: './blindBox',
      },
      { exact: true, redirect: '/front/banner' },
    ],
  },
  {
    path: '/',
    redirect: '/home',
  },
  {
    component: './404',
  },
];
