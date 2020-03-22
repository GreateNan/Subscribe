const cloud = require('wx-server-sdk');

exports.main = async (event, context) => {
  cloud.init();
  const db = cloud.database();

  try {
    // 从云开发数据库中查询等待发送的消息列表
    const _ = db.command
    const message = await db
      .collection('message')
      // 查询条件这里做了简化，只查找了状态为未发送的消息
      // 在真正的生产环境，可以根据开课日期等条件筛选应该发送哪些消息
      .where({
       done: false,
        startTime: _.lt(Date.parse(new Date()))
      })
      .get();
    console.log(message, Date.parse(new Date()))
    // 循环消息列表
    const sendPromises = message.data.map(async message => {
      try {
        // 发送订阅消息
        await cloud.openapi.subscribeMessage.send({
          touser: message.touser,
          page: message.page,
          data: message.data,
          templateId: message.templateId,
        });
        // 发送成功后将消息的状态改为已发送
        console.log(" 发送成功后将消息的状态改为已发送")
        return db
          .collection('message')
          .doc(message._id)
          .update({
            data: {
              done: true,
            },
          });
      } catch (e) {
        return e;
      }
    });

    return Promise.all(sendPromises);
  } catch (err) {
    console.log(err);
    return err;
  }
};