import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";

export interface Response {
  [key: string]: any;
}

export interface UpdateData {
  id: string;
  nilai: string;
  catatan: string;
}

export const useResponseStore = defineStore("response", () => {
  const baseUrl = "https://script.google.com/macros/s/AKfycbzcy_9CiSSkAduEEvxn_frK2Un4-ra6GpC8BpYfsQkK0E9BkGnnwGUTA1UNoYdN-Rb27g/exec";

  const responses = ref<Response[]>([]);
  const response = ref<Response>();
  const errorMessage = ref<any>("");

  // Get Response By NIM
  async function getResponseByNim(nim: string) {
    try {
      const response = await axios.get(`${baseUrl}?action=nim&nim=${nim}`);

      if (response.data.code === 404) {
        errorMessage.value = response.data.message;
      } else if (response.data.code !== 200) {
        errorMessage.value = response.data.message;
      } else {
        errorMessage.value = "";
        responses.value = response.data.data || [];
      }

      return response.data;
    } catch (error: Error | any) {
      errorMessage.value = error.message || "Maaf ada error";
    }
  }

  // Update By ID
  async function updateById(payload: UpdateData) {
    try {
      const fetchData = await fetch(`${baseUrl}?action=update&id=${payload.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify(payload),
        redirect: 'follow'
      });

      const response = await fetchData.json();

      return response.data;
    } catch (error: Error | any) {
      errorMessage.value = error.message || "Maaf ada error";
    }
  }

  return { responses, response, getResponseByNim, errorMessage, updateById };
});
