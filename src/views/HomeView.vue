<script setup lang="ts">
import { useResponseStore } from '@/stores/response';
import { ref } from 'vue';

const responseStore = useResponseStore();
const nim = ref<string>("");
const isLoading = ref<boolean>(false);

function kirim() {
  if (!nim.value) {
    responseStore.errorMessage = 'Masukin NIM dulu';
    return;
  }

  isLoading.value = true;
  responseStore.errorMessage = '';

  responseStore.getResponseByNim(nim.value)
    .finally(() => {
      isLoading.value = false;
    });
}

function reset() {
  nim.value = '';
  responseStore.responses = [];
  responseStore.errorMessage = '';
}

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };

  const formattedDate = date.toLocaleDateString('id-ID', options);

  return `${formattedDate}`;
};

</script>

<template>
  <main class="mx-5 md:mx-10 my-14">
    <label class="input input-bordered flex items-center gap-2">
      <input type="text" class="grow" placeholder="Masukin NIM" v-model="nim" @keydown.enter="kirim" />
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 opacity-70">
        <path fill-rule="evenodd"
          d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
          clip-rule="evenodd" />
      </svg>
    </label>

    <!-- Reset -->
    <div class="mt-5">
      <button @click="reset" class="btn btn-sm mr-5">Reset</button>
      <button @click="kirim" class="btn btn-sm ">Cari</button>
    </div>

    <!-- Filter Shift Baru -->
    <!-- <div class="mt-5 flex">
      <select class="select select-bordered w-full max-w-xs">
        <option disabled selected>Shift Baru</option>
        <option>A</option>
        <option>B</option>
      </select>
    </div> -->

    <!-- Error -->
    <div v-if="responseStore.errorMessage" class="mt-5">
      <p class="text-red-500">{{ responseStore.errorMessage }}</p>
    </div>

    <!-- Response -->
    <div v-if="!isLoading && !responseStore.errorMessage && responseStore.responses.length > 0"
      class="overflow-x-auto mt-10 md:mt-8">
      <table class="table w-full min-w-[400px]">
        <!-- head -->
        <thead>
          <tr>
            <th class="text-center" width="30%">Timestamp</th>
            <th class="text-center" width="10%">Pertemuan Ke</th>
            <th class="text-center" width="10%">Github</th>
            <th class="text-center" width="10%">Nilai</th>
            <th class="text-center">Catatan</th>
          </tr>
        </thead>
        <tbody>
          <!-- row -->
          <tr v-for="(item, index) in responseStore.responses" :key="index">
            <td class="text-center">{{ formatDate(item['Timestamp']) }}</td>
            <td class="text-center">{{ item['Pertemuan ke'] }}</td>
            <td class="text-center">
              <a :href="item['Link Repository Github']" target="_blank">{{ item['Link Repository Github'] }}</a>
            </td>
            <td class="text-center" v-if="item['Nilai'] == '' || item['Nilai'] == null">-</td>
            <td class="text-center" v-else>{{ item['Nilai'] }}</td>
            <td class="text-center" v-if="item['Catatan'] == '' || item['Catatan'] == null">-</td>
            <td class="text-center" v-else>{{ item['Catatan'] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else-if="isLoading" class="mt-5">
      <p>Mohon bersabar...</p>
    </div>

  </main>
</template>
