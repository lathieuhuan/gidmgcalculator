import { StandardResponse } from "../types";

export class BaseService {
  async fetchData<T>(url: string): StandardResponse<T> {
    return await fetch(url)
      .then((res) => res.json())
      .catch((err) => ({
        code: 500,
        message: err.message,
        data: null,
      }));
  }
}
