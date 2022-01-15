import axios from "axios"

import store from "@/store/index"

const BASE_URL = "https://netease-cloud-music-api-ten-gamma.vercel.app"
// const BASE_URL = "/netease-api"

/* 参数url必须以斜线开头如: /song

  参数loadingCount用来控制在请求过程中是否要显示loading图标, 值为0, 不显示; 大于0, 需要显示
  如果一个请求不需要显示Loading图标, 那么该参数不用传
  如果一个请求需要显示loading, 那么loadingCount为1. 
  对于"discovery"页面的4个请求, 必须全部完成才隐藏loading. loadingCount为0.25, 每完成一个,vuex中的showLoadingCount值
    加0.25, 当showLoadingCount值变为1时, 隐藏Loading
*/
export default function ajax(url, data = {}, loadingCount = 0, type = "GET") {
  return new Promise((resolve, reject) => {
    // 如果需要显示Loading图标
    if (loadingCount > 0) {
      store.commit("global/showLoading")
    }

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
      url = BASE_URL + url + "?time=" + Date.now()
      promise = axios.post(url, data)
    }

    promise
      .then((response) => {
        // 把返回结果中的data当作成功值传递出去,这样使用数据时就减少了一层数据结构
        resolve(response.data)

        // 隐藏loading
        hideLoading(loadingCount)
      })
      .catch((err) => {
        if (err.response) {
          store.commit("global/setreqErrMsg", { msg: err.response.data.msg })
        }
        hideLoading(loadingCount)
      })
  })
}

function hideLoading(loadingCount) {
  if (loadingCount > 0) {
    store.commit("global/hideLoading", { value: loadingCount })
  }
}
