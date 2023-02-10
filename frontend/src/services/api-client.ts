import axios from "axios";

export class ApiClient {
  private readonly baseUrl = "http://localhost:8080/";

  get(urlPart: string, token: string | null = null) {
    if (token === null) {
      token = localStorage.getItem("token");
    }

    return fetch(this.baseUrl + urlPart, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  }

  post(urlPart: string, body: unknown) {
    const token = localStorage.getItem("token");

    return fetch(this.baseUrl + urlPart, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  patch(urlPart: string, body: FormData) {
    const token = localStorage.getItem("token");

    return fetch(this.baseUrl + urlPart, {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: body,
    });
  }
}
