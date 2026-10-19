import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// 轻量可复用的 Token 获取方法，可按需替换为实际项目的获取逻辑
function getAuthToken(): string | null {
  try {
    return localStorage.getItem("token");
  } catch (_) {
    return null;
  }
}

// 基础响应类型：不假设后端返回结构，交由调用方通过泛型指定
export type HttpResponse<T = any> = T;

// 创建 Axios 实例
const http: AxiosInstance = axios.create({
  baseURL: "https://blitzo.xyz",
  timeout: 15 * 1000,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json; charset=utf-8",
  },
  withCredentials: false,
});

// 请求拦截器：注入 Authorization、可按需扩展公共参数
http.interceptors.request.use(
  (config) => {
    // const token = getAuthToken();
    // if (token) {
    //   config.headers = config.headers || {};
    //   (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器：统一透出 data，保留错误信息
http.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    // 这里可以按需处理错误上报/提示
    return Promise.reject(error);
  }
);

// 通用请求方法
export async function request<T = any>(config: AxiosRequestConfig): Promise<HttpResponse<T>> {
  return http.request<any, T>(config);
}

// 便捷方法：GET
export async function get<T = any>(url: string, config?: AxiosRequestConfig): Promise<HttpResponse<T>> {
  return request<T>({ ...config, url, method: "GET" });
}

// 便捷方法：POST
export async function post<T = any>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<HttpResponse<T>> {
  return request<T>({ ...config, url, data, method: "POST" });
}

// 便捷方法：PUT
export async function put<T = any>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<HttpResponse<T>> {
  return request<T>({ ...config, url, data, method: "PUT" });
}

// 便捷方法：DELETE
export async function del<T = any>(url: string, config?: AxiosRequestConfig): Promise<HttpResponse<T>> {
  return request<T>({ ...config, url, method: "DELETE" });
}

// 导出实例以便在特殊场景（如取消请求、自定义拦截）中直接使用
export { http };

// 可选：允许在运行时更新基础配置
export function setBaseURL(baseURL: string) {
  http.defaults.baseURL = baseURL;
}

export function setCommonHeader(key: string, value: string) {
  http.defaults.headers.common[key] = value;
}
