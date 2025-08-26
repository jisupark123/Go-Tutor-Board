import axios from 'axios';

// Singleton
class ApiClient {
  static instance: ApiClient;

  private axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    headers: { 'Content-type': 'application/json' },
  });

  constructor() {
    if (ApiClient.instance) {
      return ApiClient.instance;
    }
    ApiClient.instance = this;
    return this;
  }

  get axios() {
    return this.axiosInstance;
  }
}

const apiClient = new ApiClient();
export default apiClient;
