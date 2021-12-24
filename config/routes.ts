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
        name: 'NFT系列',
        path: 'nftType',
        component: './nft/nftType',
      },
      {
        name: 'NFT作品',
        path: 'nftSeries',
        component: './nft/nftSeries',
      },
      {
        name: '热点关键词',
        path: 'keyword',
        component: './nft/keyword',
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
      { exact: true, redirect: '/nftOrder/ProfileOutlined' },
    ],
  },
  {
    path: '/',
    redirect: '/account',
  },
  {
    component: './404',
  },
];
