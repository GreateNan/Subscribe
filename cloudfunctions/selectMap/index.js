// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
//传递的参数可通过event.xxx得到
exports.main = async (event, context) => {
  try {
    return await db.collection(event.name).where(event.rule).get({
    })
    // db.collection(setName).where(selectConditionSet).get({
    //   success: callBack
    // })
  } catch (e) {
    console.error(e)
  }
}
