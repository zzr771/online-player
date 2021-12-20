import axios from "axios"

// 添加一个请求url的统一开头, 供代理服务器识别
const BASE_URL = "/netease-api"
// 参数url必须以斜线开头如: /song
export default function ajax(url, data = {}, type = "GET") {
  return new Promise((resolve, reject) => {
    let promise
    if (type === "GET") {
      // 如果请求参数不为空
      if (!data) {
      } else {
      }
      //拼接get请求参数
      let dataStr = ""
      Object.keys(data).forEach((key) => {
        dataStr += key + "=" + data[key] + "&"
      })

      // 如果没有请求参数
      if (dataStr === "") {
        url = BASE_URL + url
      } else {
        // 去除最后一个&, 并拼接到url后面
        dataStr = dataStr.slice(0, -1)
        url = BASE_URL + url + "?" + dataStr
      }

      // 发送请求,并把返回的promise对象保存在变量中
      promise = axios.get(url)
    } else if (type === "POST") {
      url = BASE_URL + url
      promise = axios.post(url, data)
    }

    promise
      .then((response) => {
        // 把返回结果中的data当作成功值传递出去,这样使用数据时就减少了一层数据结构
        resolve(response.data)
      })
      .catch((err) => {
        console.log(err)
      })
  })
}
