<script lang="ts">
import * as Api from "@/utils/api";
import * as GuiModify from "@/utils/guiMod";
import getToast from "@/utils/getToast";
import showConfirmation from "@/utils/showConfirmation";
import { DELAY_API_REQUEST_MS } from "@/utils/consts";
import type { Lesson } from "@/types/lesson.type";

export default {
  methods: {
    async searchByNumber(event: { target: { value: string } }) {
      const Toast = getToast(this.$swal);
      const number = event.target.value;

      let items;

      if (number) {
        items = await Api.doGetRequest(
          `/youtube/search?title=${number}&admin=true`
        );
      } else {
        items = await Api.doGetRequest("/youtube/getAllItems");
      }

      if (!items || items.length === 0) {
        Toast.fire({
          icon: "error",
          title: `Нет уроков с индексом ${number}`,
        });
        return;
      }
      this.items = items;
      this.loading = false;
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

      const [index, title, url] = currentData;

      const { value: formValues } = await this.$swal.fire({
        title: "Изменить",
        html:
          `<input id="index" placeholder="на русском" class="swal2-input" value="${index}">` +
          `<input id="title" placeholder="транскрипция" class="swal2-input" value="${title}">` +
          `<input id="url" placeholder="на иврите" class="swal2-input" value="${url}">`,
        focusConfirm: false,
        preConfirm: () => {
          return [
            document.getElementById("index").value!,
            document.getElementById("title").value!,
            document.getElementById("url").value!,
          ];
        },
      });

      if (formValues) {
        const [index, title, url] = formValues;

        const apiResponse = await Api.doPutRequest(
          `/youtube/modify/${recordId}`,
          {
            index,
            title,
            url,
          }
        );

        if (!apiResponse.isError && apiResponse.code === 202) {
          const oldRecord: Lesson = { _id: recordId, index, title, url };
          const newItems = GuiModify.afterRenameLesson(this.items, oldRecord, apiResponse.data);
          this.items = newItems;
          Toast.fire({
            icon: "success",
            title: "Урок изменен в базе",
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
      const confirmation = await this.$swal.fire({
        title: "Подтвердите удаление",
        text: recordId,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Да",
        cancelButtonText: "Нет",
      });
      if (confirmation.isConfirmed) {
        const apiResponse = await Api.doDeleteRequest(
          `/youtube/remove/${recordId}`
        );
        if (!apiResponse.isError && apiResponse.code === 200) {
          const newItems = GuiModify.afterDeleteLesson(this.items, recordId);
          this.items = newItems;
          Toast.fire({
            icon: "success",
            title: "Урок удален из базы (обновите страницу)",
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
    async searchByText(event: { target: { value: string } }) {
      const Toast = getToast(this.$swal);
      const text = event.target.value;

      let items;

      if (text) {
        items = await Api.doGetRequest(
          `/youtube/search?title=${text}&admin=true`
        );
      } else {
        items = await Api.doGetRequest("/youtube/getAllItems");
      }

      if (!items || items.length === 0) {
        Toast.fire({
          icon: "error",
          title: `Нет уроков с названием, содержащим ${
            text.length >= 10 ? text.slice(0, 10) : text
          }`,
        });
      }
      this.items = items;
      this.loading = false;
    },
    searchByPage(event: { target: { value: string } }) {
      const Toast = getToast(this.$swal);
      setTimeout(async () => {
        const page = event.target.value || 1;
        const items = await Api.doGetRequest(
          `/youtube/getAllItems?page=${page}`
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
    async showAddWindow() {
      // toast appears for several seconds at right top
      const Toast = getToast(this.$swal);

      const { value: formValues } = await this.$swal.fire({
        title: "Добавить",
        html:
          '<input id="index" placeholder="номер урока" class="swal2-input">' +
          '<input id="title" placeholder="название урока" class="swal2-input">' +
          '<input id="url" placeholder="ссылка на урок" class="swal2-input">',
        focusConfirm: false,
        preConfirm: () => {
          return [
            document.getElementById("index").value!,
            document.getElementById("title").value!,
            document.getElementById("url").value!,
          ];
        },
      });

      if (formValues) {
        const [index, title, url] = formValues;

        const apiResponse = await Api.doPostRequest("/youtube/addNew", {
          index,
          title,
          url,
        });

        if (!apiResponse.isError && apiResponse.code === 201) {
          const newItems = GuiModify.afterInsertLesson(
            this.items,
            apiResponse.data
          );
          this.items = newItems;
          Toast.fire({
            icon: "success",
            title: "Урок добавлен в базу",
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
        "ссылки на уроки",
        false
      );
      if (confirmation.isConfirmed) {
        const apiResponse = await Api.doGetRequest("/youtube/restore");
        if (apiResponse && apiResponse.restored) {
          Toast.fire({
            icon: "success",
            title: "Все ссылки на уроки восстановлены из резервной копии (обновите страницу)",
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
          `/youtube/getAllItems?sort=1&page=${currentPage}`
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
          `/youtube/getAllItems?sort=-1&page=${currentPage}`
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
    const items = await Api.doGetRequest("/youtube/getAllItems");
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
          <th>Номер</th>
          <th>Название</th>
          <th>Ссылка</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody v-for="item in items" :key="item._id">
        <tr>
          <td>{{ item._id }}</td>
          <td>{{ item.index }}</td>
          <td>{{ item.title }}</td>
          <td>
            <a :href="item.url" target="_blank">
              {{ item.url }}
            </a>
          </td>
          <td>
            <button v-on:click="showModifyWindow">Изменить</button>
            <button v-on:click="showDeleteWindow">Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div>
    <input
      v-on:change="searchByNumber"
      type="number"
      placeholder="Поиск урока по номеру"
    />
    <input
      v-on:change="searchByText"
      type="text"
      placeholder="Поиск урока по названию"
    />
    <input
      v-on:change="searchByPage"
      type="number"
      value="1"
      placeholder="Страница"
    />
    <button v-on:click="showAddWindow">Добавить...</button>
    <button v-on:click="showRestoreWindow">Восстановить все</button>
  </div>
</template>
