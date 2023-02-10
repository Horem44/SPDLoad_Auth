import { ApiClient } from "../../services/api-client";

export class ProfileApiService {
  private readonly controllerNameUrlPart = "users/";

  private readonly apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient();
  }

  getCurrentUser() {
    return this.apiClient.get(this.controllerNameUrlPart);
  }

  saveUserChanges(formData: FormData) {
    return this.apiClient.patch(this.controllerNameUrlPart, formData);
  }
}