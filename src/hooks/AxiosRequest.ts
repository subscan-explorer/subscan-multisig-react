import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

type Result<T> = {
  code: number;
  message: string;
  data: T;
};

export class Request {
  instance: AxiosInstance;
  baseConfig: AxiosRequestConfig = { timeout: 30000 };

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(Object.assign(this.baseConfig, config));

    this.instance.interceptors.request.use(
      (inConfig) => {
        const token = localStorage.getItem('token') as string;
        const organizationId = localStorage.getItem('organization:id') as string;

        if (token) {
          inConfig.headers!.Authorization = `Bearer ${token}`;
        }

        if (organizationId) {
          inConfig.headers!['OPEN-PLATFORM-ORGANIZATION'] = organizationId;
        }

        return inConfig;
      },
      (err: any) => {
        // error alert
        return Promise.reject(err);
      }
    );

    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        return res;
      },
      (err: any) => {
        let message = '';
        switch (err.response.status) {
          // eslint-disable-next-line no-magic-numbers
          case 401:
            message = 'request auth error (401)';
            break;
          default:
            message = `request error (${err.response.status})!`;
        }
        console.info('axios error:', message);
        /// global error alert
        return Promise.reject(err.response);
      }
    );
  }

  public request(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.request(config);
  }

  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<Result<T>>> {
    return this.instance.get(url, config);
  }

  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<Result<T>>> {
    return this.instance.post(url, data, config);
  }

  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<Result<T>>> {
    return this.instance.put(url, data, config);
  }

  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<Result<T>>> {
    return this.instance.delete(url, config);
  }
}

export default new Request({});
