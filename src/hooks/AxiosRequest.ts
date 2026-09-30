import axios from 'axios';
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

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
      // eslint-disable-next-line complexity
      (inConfig) => {
        const token = localStorage.getItem('token') as string;
        const organizationId = localStorage.getItem('organization:id') as string;

        if (token) {
          inConfig.headers!.Authorization = `Bearer ${token}`;
        }

        if (organizationId) {
          inConfig.headers!['OPEN-PLATFORM-ORGANIZATION'] = organizationId;
        }

        try {
          const storage = JSON.parse(localStorage.getItem('multisig') || '{}');
          if (storage.subscanApiKey) {
            inConfig.headers!['X-API-Key'] = storage.subscanApiKey;
          }
        } catch {
          // ignore storage parse errors
        }

        return inConfig;
      },
      (err: AxiosError) => {
        // error alert
        return Promise.reject(err);
      }
    );

    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        return res;
      },
      (err: AxiosError) => {
        let message = '';
        switch (err.response?.status) {
          // eslint-disable-next-line no-magic-numbers
          case 401:
            message = 'request auth error (401)';
            break;
          default:
            message = `request error (${err.response?.status})!`;
        }
        console.info('axios error:', message);
        /// global error alert
        return Promise.reject(err);
      }
    );
  }

  public request(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.request(config);
  }

  public get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<Result<T>>> {
    return this.instance.get(url, config);
  }

  public post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<Result<T>>> {
    return this.instance.post(url, data, config);
  }

  public put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<Result<T>>> {
    return this.instance.put(url, data, config);
  }

  public delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<Result<T>>> {
    return this.instance.delete(url, config);
  }
}

export default new Request({});
