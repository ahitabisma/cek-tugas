import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";

export interface Response {
  [key: string]: any;
}

export const useResponseStore = defineStore("response", () => {
  const responses = ref<Response[]>([]);
  const response = ref<Response>();
  const errorMessage = ref<any>("");

  async function getResponseByNim(nim: string) {
    try {
      const response = await axios.get(`https://script.google.com/macros/s/AKfycbzFDac8fWotruptG-rXCG1jUW5VfBmOpBpvFE_wfvswa2cGRoKQEHlNhpsxeLuSZzN0Xg/exec?action=nim&nim=${nim}`);

      if (response.data.code === 404) {
        errorMessage.value = "Gak ketemu";
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

  return { responses, response, getResponseByNim, errorMessage };
});
