<script lang="ts">
import * as Api from "@/utils/api";
import getToast from "@/utils/getToast";
import showConfirmation from "@/utils/showConfirmation";
import { DELAY_API_REQUEST_MS } from "@/utils/consts";

export default {
  methods: {
    searchByWord(event: { target: { value: string } }) {
      const Toast = getToast(this.$swal);

      setTimeout(async () => {
        const q = event.target.value;
        let items;

        if (!q) {
          items = await Api.doGetRequest("/bituyim/getAllItems");
        } else {
          items = await Api.doGetRequest(`/bituyim/search?q=${q}`);
        }

        if (!items || items.length === 0) {
          Toast.fire({
            icon: "error",
            title: `Нет поговорок по запросу ${
              q.length >= 10 ? q.slice(0, 10) + "..." : q
            } в базе`,
          });
          return;
        }
        this.items = items;
        this.loading = false;
      }, DELAY_API_REQUEST_MS);
    },
    searchByPage(event: { target: { value: string } }) {
      const Toast = getToast(this.$swal);
      setTimeout(async () => {
        const page = event.target.value || 1;
        const items = await Api.doGetRequest(
          `/bituyim/getAllItems?page=${page}`
        );
        if (!items || items.length === 0) {
          Toast.fire({
            icon: "error",
            title: `На странице ${page} данных уже нет!`,
          });
          return;
        }
        this.items = items;
        this.loading = false;
      }, DELAY_API_REQUEST_MS);
    },
    async showModifyWindow(event: {
      path: { children: { innerText: any }[] }[];
    }) {
      const Toast = getToast(this.$swal);
      // get record ID and current data
      const recordId = event.path[2].children[0].innerText;
      const currentData = [
        event.path[2].children[1].innerText,
        event.path[2].children[2].innerText,
        event.path[2].children[3].innerText,
      ];

      const [he, translit, ru] = currentData;

      const { value: formValues } = await this.$swal.fire({
        title: "Изменить",
        html:
          `<input id="ru" placeholder="на русском" class="swal2-input" value="${ru}">` +
          `<input id="translit" placeholder="транскрипция" class="swal2-input" value="${translit}">` +
          `<input id="he" placeholder="на иврите" class="swal2-input" value="${he}">`,
        focusConfirm: false,
        preConfirm: () => {
          return [
            document.getElementById("ru").value!,
            document.getElementById("translit").value!,
            document.getElementById("he").value!,
          ];
        },
      });

      if (formValues) {
        const [ru, translit, he] = formValues;

        const apiResponse = await Api.doPutRequest(
          `/bituyim/modify/${recordId}`,
          {
            ru,
            translit,
            he,
          }
        );

        if (!apiResponse.isError && apiResponse.code === 202) {
          Toast.fire({
            icon: "success",
            title: "Поговорка изменена в базе",
          });
        } else {
          console.error(apiResponse);
          Toast.fire({
            icon: "error",
            title: "Произошла ошибка",
          });
        }
      }
    },
    async showDeleteWindow(event: {
      path: { children: { innerText: any }[] }[];
    }) {
      const Toast = getToast(this.$swal);
      // get record ID
      const recordId = event.path[2].children[0].innerText;
      const confirmation = await showConfirmation(this.$swal, recordId);
      if (confirmation.isConfirmed) {
        const apiResponse = await Api.doDeleteRequest(
          `/bituyim/remove/${recordId}`
        );
        if (!apiResponse.isError && apiResponse.code === 200) {
          Toast.fire({
            icon: "success",
            title: "Поговорка удалена из базы!",
          });
        } else {
          console.error(apiResponse);
          Toast.fire({
            icon: "error",
            title: "Произошла ошибка",
          });
        }
      } else if (confirmation.dismiss === this.$swal.DismissReason.cancel) {
        return;
      }
    },
    async showAddWindow() {
      // toast appears for several seconds at right top
      const Toast = getToast(this.$swal);

      const { value: formValues } = await this.$swal.fire({
        title: "Добавить",
        html:
          '<input id="ru" placeholder="на русском" class="swal2-input">' +
          '<input id="translit" placeholder="транскрипция" class="swal2-input">' +
          '<input id="he" placeholder="на иврите" class="swal2-input">',
        focusConfirm: false,
        preConfirm: () => {
          return [
            document.getElementById("ru").value!,
            document.getElementById("translit").value!,
            document.getElementById("he").value!,
          ];
        },
      });

      if (formValues) {
        const [ru, translit, he] = formValues;

        const apiResponse = await Api.doPostRequest("/bituyim/addNew", {
          ru,
          translit,
          he,
        });

        if (!apiResponse.isError && apiResponse.code === 201) {
          Toast.fire({
            icon: "success",
            title: "Поговорка добавлена в базу",
          });
        } else {
          console.error(apiResponse);
          Toast.fire({
            icon: "error",
            title: "Произошла ошибка",
          });
        }
      }
    },
    async showRestoreWindow() {
      const Toast = getToast(this.$swal);
      const confirmation = await showConfirmation(this.$swal, "поговорки", false);
      if (confirmation.isConfirmed) {
        const apiResponse = await Api.doGetRequest("/bituyim/restore");
        if (apiResponse && apiResponse.restored) {
          Toast.fire({
            icon: "success",
            title: "Все поговорки восстановлены из резервной копии",
          });
        } else {
          console.error(apiResponse);
          Toast.fire({
            icon: "error",
            title: "Произошла ошибка",
          });
        }
      } else if (confirmation.dismiss === this.$swal.DismissReason.cancel) {
        return;
      }
    },
    sortAsc(event: {
      path: { children: { children: { value: number }[] }[] }[];
    }) {
      setTimeout(async () => {
        // get number field
        const currentPage = event.path[6].children[1].children[1].value || 1;
        const items = await Api.doGetRequest(
          `/bituyim/getAllItems?sort=1&page=${currentPage}`
        );
        this.items = items;
        this.loading = false;
      }, DELAY_API_REQUEST_MS);
    },
    sortDesc(event: {
      path: { children: { children: { value: number }[] }[] }[];
    }) {
      setTimeout(async () => {
        const currentPage = event.path[6].children[1].children[1].value || 1;
        const items = await Api.doGetRequest(
          `/bituyim/getAllItems?sort=-1&page=${currentPage}`
        );
        this.items = items;
        this.loading = false;
      }, DELAY_API_REQUEST_MS);
    },
  },
  data() {
    return {
      loading: true,
      items: null,
    };
  },
  async created() {
    const items = await Api.doGetRequest("/bituyim/getAllItems");
    this.items = items;
    this.loading = false;
  },
};

</script>

<template>
  <div>
    <table class="main_table" v-if="!this.loading && this.items.length > 0">
      <thead>
        <tr>
          <th>
            ID
            <button v-on:click="sortAsc">▲</button>
            <button v-on:click="sortDesc">▼</button>
          </th>
          <th>На иврите</th>
          <th>Транскрипция</th>
          <th>На русском</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody v-for="item in items" :key="item._id">
        <tr>
          <td>{{ item._id }}</td>
          <td>{{ item.he }}</td>
          <td>{{ item.translit }}</td>
          <td>{{ item.ru }}</td>
          <td>
            <button v-on:click="showModifyWindow">Изменить</button>
            <button v-on:click="showDeleteWindow">Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div>
    <input v-on:change="searchByWord" type="text" placeholder="Поиск слова" />
    <input
      v-on:change="searchByPage"
      type="number"
      placeholder="Страница"
      value="1"
    />
    <button v-on:click="showAddWindow">Добавить...</button>
    <button v-on:click="showRestoreWindow">Восстановить все</button>
  </div>
</template>
