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
    name: '账户管理',
    path: '/account',
    icon: 'UsergroupAddOutlined',
    component: './Account',
  },
  {
    path: '/nft',
    name: 'NFT管理',
    icon: 'PayCircleOutlined',
    routes: [
      {
        name: 'NFT类型',
        path: 'nftType',
        component: './nft/nftType',
      },
      {
        name: 'NFT系列',
        path: 'nftSeries',
        component: './nft/nftSeries',
      },
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
    ],
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: '我的表格',
    icon: 'table',
    path: '/list',
    component: './TableList',
  },
  {
    path: '/',
    redirect: '/account',
  },
  {
    component: './404',
  },
];
