<script lang="ts">
import * as Api from "@/utils/api";
import * as GuiModify from "@/utils/guiMod";
import getToast from "@/utils/getToast";
import showConfirmation from "@/utils/showConfirmation";
import { DELAY_API_REQUEST_MS } from "@/utils/consts";
import getDoubles from "./plainHTMLs/getDoublesInput";

export default {
  methods: {
    searchByWord(event: { target: { value: string } }) {
      const Toast = getToast(this.$swal);

      setTimeout(async () => {
        const q = event.target.value;
        let items;

        if (!q) {
          items = await Api.doGetRequest("/doubles/getAllItems");
        } else {
          items = await Api.doGetRequest(`/doubles/search?q=${q}&admin=true`);
        }

        if (!items || items.length === 0) {
          Toast.fire({
            icon: "error",
            title: `Нет слов по запросу ${
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
          `/doubles/getAllItems?page=${page}`
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
      path: { children: { innerText: string }[] }[];
    }) {
      const Toast = getToast(this.$swal);
      // get record ID and current data
      const recordId = event.path[2].children[0].innerText;
      const currentData = [
        event.path[2].children[1].innerText,
        event.path[2].children[2].innerText,
        event.path[2].children[3].innerText,
      ];

      const [ru, single, double] = currentData;

      const { value: formValues } = await this.$swal.fire({
        title: "Изменить",
        html:
          `<input id="ru" placeholder="на русском" class="swal2-input" value="${ru}">` +
          `<input id="x1" placeholder="x1" class="swal2-input" value="${single}">` +
          `<input id="x2" placeholder="x2" class="swal2-input" value="${double}">`,
        focusConfirm: false,
        preConfirm: () => {
          return [
            document.getElementById("ru").value!,
            document.getElementById("x1").value!,
            document.getElementById("x2").value!,
          ];
        },
      });

      if (formValues) {
        const [ru, x1, x2] = formValues;

        const apiResponse = await Api.doPutRequest(
          `/doubles/modify/${recordId}`,
          {
            ru,
            x1,
            x2,
          }
        );

        if (!apiResponse.isError && apiResponse.code === 202) {
          const oldRecord = {
            _id: recordId,
            ru,
            x1,
            x2,
          };
          const newItems = GuiModify.afterRenameDouble(
            this.items,
            oldRecord,
            apiResponse.data
          );
          this.items = newItems;

          Toast.fire({
            icon: "success",
            title: "Слово изменено в базе",
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
      path: { children: { innerText: string }[] }[];
    }) {
      const Toast = getToast(this.$swal);
      // get record ID
      const recordId = event.path[2].children[0].innerText;
      const word = event.path[2].children[3].innerText.slice(0, 12) + "...";
      const confirmation = await showConfirmation(this.$swal, word);
      if (confirmation.isConfirmed) {
        const apiResponse = await Api.doDeleteRequest(
          `/doubles/remove/${recordId}`
        );
        if (!apiResponse.isError && apiResponse.code === 200) {
          const newItems = GuiModify.afterDeleteDouble(this.items, recordId);
          this.items = newItems;
          Toast.fire({
            icon: "success",
            title: "Слово удалено из базы!",
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

      const doublesHTML = getDoubles();

      const { value: formValues } = await this.$swal.fire({
        title: "Добавить",
        html: doublesHTML,
        focusConfirm: false,
        preConfirm: () => {
          return [
            document.getElementById("ru").value!,
            document.getElementById("single").value!,
            document.getElementById("double").value!,
          ];
        },
      });

      if (formValues) {
        const [ru, single, double] = formValues;

        const apiResponse = await Api.doPostRequest("/doubles/addNew", {
          ru,
          single,
          double,
        });

        if (!apiResponse.isError && apiResponse.code === 201) {
          const newItems = GuiModify.afterDoubleInsert(
            this.items,
            apiResponse.data
          );
          this.items = newItems;
          Toast.fire({
            icon: "success",
            title: "Слово добавлено в базу",
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
      const confirmation = await showConfirmation(
        this.$swal,
        "двойные слова",
        false
      );
      if (confirmation.isConfirmed) {
        const apiResponse = await Api.doGetRequest("/doubles/restore");
        if (apiResponse && apiResponse.restored) {
          Toast.fire({
            icon: "success",
            title: "Все слова восстановлены из резервной копии",
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
          `/doubles/getAllItems?sort=1&page=${currentPage}`
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
          `/doubles/getAllItems?sort=-1&page=${currentPage}`
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
    const items = await Api.doGetRequest("/doubles/getAllItems");
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
          <th>На русском</th>
          <th>x1</th>
          <th>x2</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody v-for="item in items" :key="item._id">
        <tr>
          <td>{{ item._id }}</td>
          <td>{{ item.ru }}</td>
          <td>{{ item.single }}</td>
          <td>{{ item.double }}</td>
          <td>
            <button v-on:click="showModifyWindow">Изменить</button>
            <button v-on:click="showDeleteWindow">Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else style="margin: 100px 0; color: black; font-size: 24px">
      База данных пуста - попробуйте восстановить данные (кнопка ниже) или
      дождитесь загрузки
    </div>
  </div>
  <div>
    <input v-on:change="searchByWord" type="text" placeholder="Поиск слова" />
    <input
      v-on:change="searchByPage"
      type="number"
      placeholder="Страница"
      value="1"
      min="1"
    />
    <button v-on:click="showAddWindow">Добавить...</button>
    <button v-on:click="showRestoreWindow">Восстановить все</button>
  </div>
</template>
