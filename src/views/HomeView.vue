<script setup lang="ts">
import { useResponseStore } from '@/stores/response';
import { reactive, ref } from 'vue';
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const responseStore = useResponseStore();
const nim = ref<string>('');
const isLoading = ref<boolean>(false);
const isLoadingTab = ref<boolean>(false);

const loadingStates = reactive<{ [key: string]: boolean }>({});
const nilai = reactive<{ [key: string]: string }>({});
const catatan = reactive<{ [key: string]: string }>({});

const activeTab = ref('tugas');

const dataSementara = reactive({
  'nama': '',
  'email': '',
  'nim': '',
  'shift_baru': '',
  'shift_krs': '',
});

// Search Tugas
function kirim() {
  activeTab.value = 'tugas';

  if (!nim.value) {
    responseStore.errorMessage = 'Masukin NIM dulu';
    return;
  }

  isLoading.value = true;
  responseStore.errorMessage = '';

  responseStore.response = [];

  responseStore.getResponseByNim(nim.value)
    .then(() => {
      responseStore.responses.forEach(item => {
        nilai[item.id] = item['Nilai'] || '';
        catatan[item.id] = item['Catatan'] || '';
      });

      if (responseStore.responses && responseStore.responses.length > 0) {
        dataSementara.nama = responseStore.responses[0]['NAMA'];
        dataSementara.email = responseStore.responses[0]['Email Address'];
        dataSementara.nim = responseStore.responses[0]['NIM'];
        dataSementara.shift_baru = responseStore.responses[0]['SHIFT Baru'];
        dataSementara.shift_krs = responseStore.responses[0]['SHIFT KRS'];
      }
    })
    .finally(() => {
      isLoading.value = false;
    });
}

// Reset input search
function reset() {
  nim.value = '';
  responseStore.responses = [];
  responseStore.errorMessage = '';
  dataSementara.nama = ''
  dataSementara.email = ''
  dataSementara.nim = ''
  dataSementara.shift_baru = ''
  dataSementara.shift_krs = ''
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

  return date.toLocaleDateString('id-ID', options);
};

// Update nilai dan catatan
async function update(id: string) {
  loadingStates[id] = true;
  responseStore.errorMessage = '';

  const updateData = reactive({
    id,
    nilai: nilai[id],
    catatan: catatan[id],
  });

  try {
    await responseStore.updateById(updateData);

    toast("Data berhasil disimpan!", {
      "type": "success",
      "pauseOnHover": false,
      "autoClose": 1000,
      "dangerouslyHTMLString": true
    })

  } catch (error) {
    toast("Data gagal disimpan!", {
      "type": "error",
      "pauseOnHover": false,
      "autoClose": 1000,
      "dangerouslyHTMLString": true
    })
  } finally {
    loadingStates[id] = false;
  }
}

// Reset nilai dan catatan menjadi kosong
async function updateReset(id: string) {
  loadingStates[id] = true;
  responseStore.errorMessage = '';

  const updateData = reactive({
    id,
    nilai: '',
    catatan: '',
  });

  try {
    await responseStore.updateById(updateData);

    nilai[id] = '';
    catatan[id] = '';

    toast("Data berhasil direset menjadi kosong!", {
      "type": "success",
      "pauseOnHover": false,
      "autoClose": 1000,
      "dangerouslyHTMLString": true
    })

  } catch (error) {
    toast("Data gagal disimpan!", {
      "type": "error",
      "pauseOnHover": false,
      "autoClose": 1000,
      "dangerouslyHTMLString": true
    })
  } finally {
    loadingStates[id] = false;
  }
}

async function getTugas(nim: string) {
  activeTab.value = 'tugas';

  isLoadingTab.value = true;
  responseStore.responses = [];

  responseStore.getResponseByNim(dataSementara.nim)
    .then(() => {
      responseStore.responses.forEach(item => {
        nilai[item.id] = item['Nilai'] || '';
        catatan[item.id] = item['Catatan'] || '';
      });

      if (responseStore.responses && responseStore.responses.length > 0) {
        dataSementara.nama = responseStore.responses[0]['NAMA'];
        dataSementara.email = responseStore.responses[0]['Email Address'];
        dataSementara.nim = responseStore.responses[0]['NIM'];
        dataSementara.shift_baru = responseStore.responses[0]['SHIFT Baru'];
        dataSementara.shift_krs = responseStore.responses[0]['SHIFT KRS'];
      }
    })
    .finally(() => {
      isLoadingTab.value = false;
    });
}
async function getPretest(nim: string, email: string) {
  activeTab.value = 'pre_test';

  isLoadingTab.value = true;
  responseStore.responses = [];

  responseStore.getPretest(nim, email).finally(() => {
    isLoadingTab.value = false;
  });
}

async function getPosttest(nim: string, email: string) {
  activeTab.value = 'post_test';

  isLoadingTab.value = true;
  responseStore.responses = [];

  responseStore.getPosttest(nim, email).finally(() => {
    isLoadingTab.value = false;
  });
}

async function getResponsi1(nim: string, email: string) {
  activeTab.value = 'responsi_1';

  isLoadingTab.value = true;
  responseStore.responses = [];

  responseStore.getResponsi1(nim, email).finally(() => {
    isLoadingTab.value = false;
  });
}

async function getResponsi2(nim: string, email: string) {
  activeTab.value = 'responsi_2';

  isLoadingTab.value = true;
  responseStore.responses = [];

  responseStore.getResponsi2(nim, email).finally(() => {
    isLoadingTab.value = false;
  });
}
</script>


<template>
  <main class="mx-6 md:mx-16 my-14">
    <!-- Input and Search Buttons -->
    <label class="input input-bordered flex items-center gap-2">
      <input type="text" class="grow" placeholder="Masukin NIM" v-model="nim" @keydown.enter="kirim" />
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 opacity-70">
        <path fill-rule="evenodd"
          d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
          clip-rule="evenodd" />
      </svg>
    </label>

    <!-- Reset and Search Buttons -->
    <div class="mt-5">
      <button @click="reset" class="btn btn-sm mr-5">Reset</button>
      <button @click="kirim" class="btn btn-sm">Cari</button>
    </div>

    <!-- Error Message -->
    <div v-if="responseStore.errorMessage" class="mt-5">
      <p class="text-red-500">{{ responseStore.errorMessage }}</p>
    </div>

    <!-- Identitas -->
    <div v-if="!isLoading && dataSementara.nim !== ''" class="mt-10 md:mt-8 mb-10 md:mb-8">
      <ul class="flex gap-4">
        <li class="w-[25%] md:w-[15%] lg:w-[7%]">Nama</li>
        <li class="w-1/12 text-center">:</li>
        <li class="w-2/3">{{ dataSementara.nama }}</li>
      </ul>
      <ul class="flex gap-4">
        <li class="w-[25%] md:w-[15%] lg:w-[7%]">NIM</li>
        <li class="w-1/12 text-center">:</li>
        <li class="w-2/3">{{ dataSementara.nim }}</li>
      </ul>
      <ul class="flex gap-4">
        <li class="w-[25%] md:w-[15%] lg:w-[7%]">SHIFT Baru</li>
        <li class="w-1/12 text-center">:</li>
        <li class="w-2/3">{{ dataSementara.shift_baru }}</li>
      </ul>
      <ul class="flex gap-4">
        <li class="w-[25%] md:w-[15%] lg:w-[7%]">SHIFT KRS</li>
        <li class="w-1/12 text-center">:</li>
        <li class="w-2/3">{{ dataSementara.shift_krs }}</li>
      </ul>
    </div>

    <!-- Loading State -->
    <div v-else-if="isLoading" class="mt-5">
      <p>Mohon bersabar...</p>
    </div>

    <div>
      <div v-if="dataSementara.nim != ''" role="tablist" class="tabs tabs-lifted my-5">
        <a role="tab" id="tugas" :class="['tab', activeTab === 'tugas' ? 'tab-active [--tab-bg:black] text-white' : '']"
          @click="getTugas(dataSementara.nim)">Tugas</a>
        <a role="tab" id="pre_test"
          :class="['tab', activeTab === 'pre_test' ? 'tab-active [--tab-bg:black] text-white' : '']"
          @click="getPretest(dataSementara.nim, dataSementara.email)">Pre-Test</a>
        <a role="tab" id="post_test"
          :class="['tab', activeTab === 'post_test' ? 'tab-active [--tab-bg:black] text-white' : '']"
          @click="getPosttest(dataSementara.nim, dataSementara.email)">Post-Test</a>
        <a role="tab" id="responsi_1"
          :class="['tab', activeTab === 'responsi_1' ? 'tab-active [--tab-bg:black] text-white' : '']"
          @click="getResponsi1(dataSementara.nim, dataSementara.email)">Responsi 1</a>
        <a role="tab" id="responsi_2"
          :class="['tab', activeTab === 'responsi_2' ? 'tab-active [--tab-bg:black] text-white' : '']"
          @click="getResponsi2(dataSementara.nim, dataSementara.email)">Responsi 2</a>
      </div>

      <!-- Response Table Tugas -->
      <div v-if="!isLoading && !isLoadingTab && activeTab === 'tugas' && dataSementara.nim !== ''" class="overflow-x-auto">
        <table class="table w-full min-w-[400px]">
          <thead>
            <tr>
              <th class="text-center" width="5%">Pertemuan Ke</th>
              <th class="text-center" width="20%">Timestamp</th>
              <th class="text-center" width="25%">Github</th>
              <th class="text-center" width="10%">Nilai</th>
              <th class="text-center" width="25%">Catatan</th>
              <th class="text-center" width="15%">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in responseStore.responses" :key="index">
              <td class="text-center">{{ item['Pertemuan ke'] }}</td>
              <td class="text-center">{{ formatDate(item['Timestamp']) }}</td>
              <td class="text-center lg:break-all link link-primary">
                <a :href="item['Link Repository Github']" target="_blank">{{ item['Link Repository Github'] }}</a>
              </td>

              <!-- Nilai Input -->
              <td class="text-center">
                <input type="number" :id="item['id']" placeholder="Nilai" class="input input-bordered w-full max-w-xs"
                  v-model="nilai[item.id]" />
              </td>

              <!-- Catatan Input -->
              <td class="text-center">
                <textarea class="textarea textarea-bordered" :id="item['id']" placeholder="Catatan" rows="3"
                  v-model="catatan[item.id]"></textarea>
              </td>

              <!-- Action Buttons -->
              <td class="text-center">
                <div v-if="!loadingStates[item['id']]" class="flex gap-3">
                  <button @click="updateReset(item['id'])" class="btn btn-warning text-white btn-sm">Reset</button>
                  <button @click="update(item['id'])" class="btn btn-success text-white btn-sm">Simpan</button>
                </div>
                <div v-else>
                  <span class="loading loading-spinner loading-md"></span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Response Table Pre-Test -->
      <div v-if="activeTab === 'pre_test'" class=" overflow-x-auto">
        <div v-for="(item, index) in responseStore.responses" :key="index" class="space-y-5">
          <div v-for="(value, key) in item" :key="key">
            <p class="font-bold" v-html="key"></p>
            <p>
              {{ key.toString().includes('Timestamp') ? formatDate(value) : value }}
            </p>
          </div>
        </div>
      </div>

      <!-- Response Table Post-Test -->
      <div v-if="activeTab === 'post_test'" class="overflow-x-auto">
        <div v-for="(item, index) in responseStore.responses" :key="index" class="space-y-5">
          <div v-for="(value, key) in item" :key="key">
            <p class="font-bold">{{ key }}</p>
            <p>
              {{ key.toString().includes('Timestamp') ? formatDate(value) : value }}
            </p>
          </div>
        </div>
      </div>


      <!-- Response Table Responsi 1 -->
      <div v-if="activeTab === 'responsi_1'" class="overflow-x-auto">
        <div v-for="(item, index) in responseStore.responses" :key="index" class="space-y-5">
          <div v-for="(value, key) in item" :key="key">
            <p class="font-bold" v-html="key"></p>
            <p>
              <a v-if="typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))"
                :href="value" target="_blank" class="text-blue-500 underline">
                {{ value }}
              </a>
              <span v-else>
                {{ key.toString().includes('Timestamp') ? formatDate(value) : value }}
              </span>
            </p>
          </div>
        </div>
      </div>

      <!-- Response Table Responsi 2 -->
      <div v-if="activeTab === 'responsi_2'" class="overflow-x-auto">
        <div v-for="(item, index) in responseStore.responses" :key="index" class="space-y-5">
          <div v-for="(value, key) in item" :key="key">
            <p class="font-bold" v-html="key"></p>
            <p>
              <a v-if="typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))"
                :href="value" target="_blank" class="text-blue-500 underline">
                {{ value }}
              </a>
              <span v-else>
                {{ key.toString().includes('Timestamp') ? formatDate(value) : value }}
              </span>
            </p>
          </div>
        </div>
      </div>

    </div>

    <div v-if="isLoadingTab" class="mt-5">
      <p class="text-center">Loading...</p>
    </div>
  </main>
</template>
