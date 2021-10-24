import axios from "axios";
import { findIndex } from "lodash";
axios.defaults.headers.post["Content-Type"] = "application/json; charset=utf-8";
axios.defaults.headers.patch["Content-Type"] =
  "application/json; charset=utf-8";

const config = {
  baseURL:  process.env.VUE_APP_API_URL,
  timeout: 120 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};
const pending = new Map();
const excludeUrl = [""]; // 需要排除的接口地址可以放里面
//  qs.stringify(config.params), qs.stringify(config.data)
const addPending = (config) => {
  const isInExcludeUrl =
    findIndex(excludeUrl, (o) => {
      return o.search(config.url) >= 0;
    }) >= 0;
  if (isInExcludeUrl) {
    return;
  }
  const url = [config.method, config.url].join("&");
  console.log(url);
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken((cancel) => {
      if (!pending.has(url)) {
        // 如果 pending 中不存在当前请求，则添加进去
        pending.set(url, cancel);
      }
    });
};
/**
 * 移除请求
 * @param {Object} config
 */
//  qs.stringify(config.params), qs.stringify(config.data)
const removePending = (config) => {
  const url = [config.method, config.url].join("&");
  if (pending.has(url)) {
    // 如果在 pending 中存在当前请求标识，需要取消当前请求，并且移除
    const cancel = pending.get(url);
    cancel(url);
    pending.delete(url);
  }
};
/**
 * 清空 pending 中的请求（在路由跳转时调用）
 */
const clearPending = () => {
  for (const [url, cancel] of pending) {
    cancel(url);
  }
  pending.clear();
};
const _axios = axios.create(config);

_axios.interceptors.request.use(
  (cfg) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.authToken) {
      cfg.headers.common["X-Auth-Token"] = user.authToken;
    }
    removePending(cfg); // 在请求开始前，对之前的请求做检查取消操作
    addPending(cfg); // 将当前请求添加到 pending 中
    return cfg;
  },
  (err) => {
    return Promise.reject(err);
  }
);

const $axios = _axios;
const api = _axios;
const $axiosAll = axios.all;
const $axiosSpread = axios.spread;
const $CancelToken = axios.CancelToken;
export { $axios, $axiosAll, $axiosSpread, $CancelToken, clearPending, api };
