let plugins = [
  '-lunr',
  '-sharing',
  '-search',
  '-favicon',
  'code',
  'expandable-chapters',
  'theme-lou',
  'back-to-top-button',
  'search-pro',
];
if (process.env.NODE_ENV == 'dev') plugins.push('livereload');

module.exports = {
  title: 'Site Reliability Engineer Knowledge Base',
  author: 'Simon Liu',
  lang: 'zh-cn',
  description: '开源技术博客',
  plugins,
  pluginsConfig: {
    code: {
      copyButtons: false,
    },
    'theme-lou': {
      // color: '#2096FF', // 主题色
      color: '#FF8920', // 主题色
      favicon: 'assets/favicon.ico',
      logo: 'assets/logo.png',
      copyrightLogo: 'assets/copyright.png',
      // autoNumber: 3, // 自动给标题添加编号(如1.1.1)
      forbidCopy: false, // 页面是否禁止复制
      'search-placeholder': '众里寻他千百度', // 搜索框文本
      'hide-elements': ['.summary .gitbook-link'], // 需要隐藏的标签
      copyright: {
        author: 'Simon Liu', // 底部版权展示的作者名
      },
    },
  },
  variables: {
    themeLou: {
      // 顶部导航栏配置
      nav: [
        {
          target: '_blank', // 跳转方式: 打开新页面
          url: 'https://github.com/iuskye', // 跳转页面
          name: 'GitHub', // 导航名称
        },
        {
          target: '_blank', // 跳转方式: 打开新页面
          url: 'https://gitee.com/iuskye', // 跳转页面
          name: 'Gitee', // 导航名称
        },
        {
          target: '_blank', // 跳转方式: 打开新页面
          url: 'https://www.iuskye.com', // 跳转页面
          name: '爱吃桔子的程序羊', // 导航名称
        },
      ],
      // 底部打赏配置
      footer: {
        donate: {
          button: '赞赏', // 打赏按钮
          avatar:
            'https://oss.iuskye.com/admin/touxiang.jpg', // 头像地址
          nickname: 'Simon Liu', // 显示打赏昵称
          message: '随意打赏，但不要超过一顿早餐钱！', // 打赏消息文本
          text: '『 赠人玫瑰，手有余香 』',
          wxpay:
            'https://oss.iuskye.com/admin/wechatpay.jpeg', // 微信收款码
          alipay:
            'https://oss.iuskye.com/admin/alipay.jpeg', // 支付宝收款码
        },
        copyright: true, // 显示版权
      },
    },
  },
};
