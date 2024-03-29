<script lang="ts">
import * as Api from "@/utils/api";
import * as GuiModify from "@/utils/guiMod";
import getToast from "@/utils/getToast";
import showConfirmation from "@/utils/showConfirmation";
import { DELAY_API_REQUEST_MS } from "@/utils/consts";
import nsfws_searchByWord from "./NsfwsComponent/searchByWord";

export default {
  methods: {
    _getToast() {
      return getToast(this.$swal);
    },
    searchByWord(event: any) {
      setTimeout(async () => {
        const items = await nsfws_searchByWord(event, this._getToast());
        if (!items) return;
        this.items = items;
        this.loading = false;
      }, DELAY_API_REQUEST_MS);
    },
    searchByPage(event: { target: { value: string } }) {
      const Toast = getToast(this.$swal);
      setTimeout(async () => {
        const page = event.target.value || 1;
        const items = await Api.doGetRequest(`/nsfws/getAllItems?page=${page}`);
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

      const [ru, translit, he] = currentData;

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
          `/nsfws/modify/${recordId}`,
          {
            ru,
            translit,
            he,
          }
        );

        if (!apiResponse.isError && apiResponse.code === 202) {
          const oldRecord = { _id: recordId, ru, translit, he };
          const newItems = GuiModify.afterRename(
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
      const word = event.path[2].children[3].innerText;
      const confirmation = await showConfirmation(this.$swal, word);
      if (confirmation.isConfirmed) {
        const apiResponse = await Api.doDeleteRequest(
          `/nsfws/remove/${recordId}`
        );
        if (!apiResponse.isError && apiResponse.code === 200) {
          const newItems = GuiModify.afterDelete(this.items, recordId);
          this.items = newItems;
          Toast.fire({
            icon: "success",
            title: "Слово удалено из базы",
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

        const apiResponse = await Api.doPostRequest("/nsfws/addNew", {
          ru,
          translit,
          he,
        });

        if (!apiResponse.isError && apiResponse.code === 201) {
          const newItems = GuiModify.afterInsert(this.items, apiResponse.data);
          this.items = newItems;
          Toast.fire({
            icon: "success",
            title: "Плохое слово добавлено в базу",
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
        "слова 18+",
        false
      );
      if (confirmation.isConfirmed) {
        const apiResponse = await Api.doGetRequest("/nsfws/restore");
        if (apiResponse && apiResponse.restored) {
          Toast.fire({
            icon: "success",
            title:
              "Все слова восстановлены из резервной копии (обновите страницу)",
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
          `/nsfws/getAllItems?sort=1&page=${currentPage}`
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
          `/nsfws/getAllItems?sort=-1&page=${currentPage}`
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
    const items = await Api.doGetRequest("/nsfws/getAllItems");
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
