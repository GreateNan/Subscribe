// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  // 发送订阅消息
  await cloud.openapi.subscribeMessage.send({
    touser: event.touser,
    page: event.page,
    data: event.data,
    templateId: event.templateId,
  });

}