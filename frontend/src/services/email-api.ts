import { ApiClient } from "./api-client";

export class EmailApiService {
  private readonly controllerNameUrlPart = "email/";

  private readonly apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient();
  }

  sendVerification(formData: { email: string }) {
    return this.apiClient.post(this.controllerNameUrlPart + "send-verification", formData);
  }

  verificate(token: string){
    return this.apiClient.get(this.controllerNameUrlPart + "verificate", token);
  }
}