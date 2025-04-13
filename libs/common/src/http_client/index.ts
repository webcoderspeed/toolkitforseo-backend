import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';

@Injectable()
export class HttpClient {
  constructor(
    private readonly _baseUrl: string,
    private readonly defaultOptions: AxiosRequestConfig = {},
  ) {}

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>('get', url, config);
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request<T>('post', url, config, data);
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request<T>('put', url, config, data);
  }

  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request<T>('patch', url, config, data);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>('delete', url, config);
  }

  private async request<T>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    url: string,
    config?: AxiosRequestConfig,
    data?: any,
  ): Promise<T> {
    try {
      const mergedConfig: AxiosRequestConfig = {
        ...this.defaultOptions,
        ...config,
        url: `${this._baseUrl}${url}`,
        method: method,
        data: data,
      };

      const axiosResponse: AxiosResponse<T> =
        await axios.request<T>(mergedConfig);
      return axiosResponse.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          throw new HttpException(
            {
              message: error.response.data,
              status: error.response.status,
              headers: error.response.headers,
            },
            error.response.status,
          );
        } else if (error.request) {
          throw new HttpException(
            {
              message: 'No response received from the server.',
              status: HttpStatus.INTERNAL_SERVER_ERROR,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        } else {
          throw new HttpException(
            {
              message: error.message,
              status: HttpStatus.INTERNAL_SERVER_ERROR,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      } else {
        throw new HttpException(
          {
            message: error.message,
            status: HttpStatus.INTERNAL_SERVER_ERROR,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
