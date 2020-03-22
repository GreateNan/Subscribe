// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
//传递的参数可通过event.xxx得到
exports.main = async (event, context) => {
  if (event.orderarr) {
    try {
     
      return await db.collection(event.name).where(event.rule).orderBy(event.orderarr.ruleItem, event.orderarr.orderFuc).get({
      })
      // db.collection(setName).where(selectConditionSet).get({
      //   success: callBack
      // })
    } catch (e) {
      console.error(e)
    }
  }else{
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

}
