/*
 * Aliyun EMAS serverless
 */
module.exports = async (ctx) => {
  /* secret SECRET, remove before check in into git */
  // const appid = 'Your wechat AppID';
  // const secret = 'Your wechat AppSecret';
  const appid = '';
  const secret = '';
  const res = await ctx.httpclient.request('https://api.weixin.qq.com/sns/jscode2session?appid=' +
    appid + '&secret=' + secret + '&js_code=' + ctx.args.code + '&grant_type=authorization_code',
    {
      method: 'GET',
      dataType: 'json'
    });
  // ctx.logger.info('res: %j', res);
  return (res.status === 200 ? res.data : '');
}

/* tencent cloud version */
/*
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}
*/