<script lang="ts">
import * as Api from "@/utils/api";
import getToast from "@/utils/getToast";
import showConfirmation from "@/utils/showConfirmation";

export default {
  methods: {
    async changeUserStatus(event) {
      const Toast = getToast(this.$swal);
      const userName = event.path[2].children[1].innerText;
      const userId = event.path[2].children[2].innerText;

      const modalResult = await this.$swal.fire({
        title: `Статус пользователя ${userName}`,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Вкл",
        denyButtonText: "Выкл",
        cancelButtonText: "Отмена",
      });

      if (modalResult.isConfirmed) {
        const apiResponse = await Api.doGetRequest(
          `/reminders/on?userId=${userId}&userName=${userName}`
        );
        if (!apiResponse.active) {
          console.error(apiResponse);
          Toast.fire({
            icon: "error",
            title: "Произошла ошибка",
          });
        } else {
          this.$swal.fire("Включено", "", "success");
        }
      } else if (modalResult.isDenied) {
        const apiResponse = await Api.doGetRequest(
          `/reminders/off?userId=${userId}&userName=${userName}`
        );
        if (apiResponse.active) {
          console.error(apiResponse);
          Toast.fire({
            icon: "error",
            title: "Произошла ошибка",
          });
        } else {
          this.$swal.fire("Отключено", "", "success");
        }
      } else {
        return;
      }
    },
    async showRestoreWindow() {
      const Toast = getToast(this.$swal);
      const confirmation = await showConfirmation(
        this.$swal,
        "напоминалки (пользователи)",
        false
      );
      if (confirmation.isConfirmed) {
        const apiResponse = await Api.doGetRequest("/nsfws/restore");
        if (apiResponse && apiResponse.restored) {
          Toast.fire({
            icon: "success",
            title:
              "Вся информация о напоминалках восстановлена из резервной копии",
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
    async searchByUsername(event) {
      const Toast = getToast(this.$swal);
      const username = event.target.value;

      let items;
      if (username) {
        items = await Api.doGetRequest(
          `/reminders/getItemsByNickname?name=${username}`
        );
        if (!items || items.length === 0) {
          Toast.fire({
            icon: "error",
            title: `Не найдено ника ${username}`,
          });
          return;
        }
      } else {
        items = await Api.doGetRequest('/reminders/getAllItems');
      }

      this.items = items;
      this.loading = false;
    },
    searchByPage(event: { target: { value: string } }) {
      const Toast = getToast(this.$swal);
      setTimeout(async () => {
        const page = event.target.value || 1;
        const items = await Api.doGetRequest(
          `/reminders/getAllItems?page=${page}`
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
      }, 1000);
    },
    async showDeleteWindow(event: {
      path: { children: { innerText: any }[] }[];
    }) {
      const Toast = getToast(this.$swal);
      // get user ID
      const userId = event.path[2].children[2].innerText;
      const confirmation = await showConfirmation(this.$swal, userId);
      if (confirmation.isConfirmed) {
        const apiResponse = await Api.doDeleteRequest(
          `/reminders/remove/${userId}`
        );
        if (!apiResponse.isError && apiResponse.code === 200) {
          Toast.fire({
            icon: "success",
            title: "Пользователь удален из базы!",
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
  },
  data() {
    return {
      loading: true,
      items: null,
    };
  },
  async created() {
    const items = await Api.doGetRequest("/reminders/getAllItems");
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
          <th>ID</th>
          <th>Пользователь</th>
          <th>Идентификатор</th>
          <th>Статус</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody v-for="item in items" :key="item._id">
        <tr>
          <td>{{ item._id }}</td>
          <td>{{ item.userName }}</td>
          <td>{{ item.userId }}</td>
          <td>{{ item.isActive ? "включена" : "выключена" }}</td>
          <td>
            <button v-on:click="changeUserStatus">Изменить статус</button>
            <button v-on:click="showDeleteWindow">Удалить юзера</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div>
    <input v-on:change="searchByUsername" type="text" placeholder="Поиск ника" />
    <input v-on:change="searchByPage" type="number" placeholder="Страница" value="1" />
    <button v-on:click="showRestoreWindow">Восстановить все</button>
  </div>
</template>
