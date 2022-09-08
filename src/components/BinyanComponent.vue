<script lang="ts">
import * as Api from "@/utils/api";
import * as GuiModify from "@/utils/guiMod";
import getToast from "@/utils/getToast";
import showConfirmation from "@/utils/showConfirmation";
import { DELAY_API_REQUEST_MS } from "@/utils/consts";
import getBinyanInput from "./plainHTMLs/getBinyanInput";
import parseCurrentTime from "@/utils/parseCurrentTime";
import parsePreviousTime from "@/utils/parsePreviousTime";
    
  export default {
    methods: {
      searchByWord(event: { target: { value: string } }) {
        const Toast = getToast(this.$swal);
  
        setTimeout(async () => {
          const q = event.target.value;
          let items;
  
          if (!q) {
            items = await Api.doGetRequest("/binyans/getAllItems");
          } else {
            items = await Api.doGetRequest(`/binyans/search?q=${q}&admin=true`);
          }
  
          if (!items || items.length === 0) {
            Toast.fire({
              icon: "error",
              title: `Нет биньянов по запросу ${
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
            `/binyans/getAllItems?page=${page}`
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
        console.log(parseCurrentTime(event.path[2].children[6].innerText))
        // Transform some values first
        const [
          _maleSingle,
          _femaleSingle,
          _malePlural,
          _femalePlural
        ] = parseCurrentTime(event.path[2].children[6].innerText);

        const [
          _me, _youMaleSingle, _youFemaleSingle, _he, _she, _we, _youMalePlural, _youFemalePlural, _theyMalePlural, _theyFemalePlural
        ] = parsePreviousTime(event.path[2].children[7].innerText)

        const currentData = [
          event.path[2].children[1].innerText, // infinitive
          event.path[2].children[2].innerText, // translit
          event.path[2].children[3].innerText, // ru
          event.path[2].children[4].innerText, // binyan
          event.path[2].children[5].innerText, // root
          _maleSingle,
          _femaleSingle,
          _malePlural,
          _femalePlural,
          _me,
          _youMaleSingle,
          _youFemaleSingle,
          _he, _she, _we,
          _youMalePlural,
          _youFemalePlural, 
          _theyMalePlural, 
          _theyFemalePlural
        ];

        console.log(event.path[2].children);
        
        

        const binyanHTML = getBinyanInput(currentData!);
        
        const { value: formValues } = await this.$swal.fire({
          title: "Изменить",
          html: binyanHTML,
          focusConfirm: false,
          preConfirm: () => {
            return [
              document.getElementById("infinitive").value!,
              document.getElementById("translit").value!,
              document.getElementById("ru").value!,
              document.getElementById("binyanType").value!,
              document.getElementById("root").value!,
              document.getElementById("maleSingle").value!,
              document.getElementById("femaleSingle").value!,
              document.getElementById("malePlural").value!,
              document.getElementById("femalePlural").value!,
              document.getElementById("me").value!,
              document.getElementById("youMaleSingle").value!,
              document.getElementById("youFemaleSingle").value!,
              document.getElementById("he").value!,
              document.getElementById("she").value!,
              document.getElementById("we").value!,
              document.getElementById("youMalePlural").value!,
              document.getElementById("youFemalePlural").value!,
              document.getElementById("theyMalePlural").value!,
              document.getElementById("theyFemalePlural").value!,
            ];
          },
        });
  
        if (formValues) {
          const [infinitive, translit, ru, binyanType, root, maleSingle, femaleSingle, malePlural, femalePlural, me, youMaleSingle, youFemaleSingle, he, she, we, youMalePlural, youFemalePlural, theyMalePlural, theyFemalePlural] = formValues;

  
          const apiResponse = await Api.doPutRequest(
            `/binyans/modify/${recordId}`,
            {
              translit, 
              ru,
              infinitive,
              binyanType,
              root,
              timePresent: {
                  maleSingle,
                  femaleSingle,
                  malePlural,
                  femalePlural
              },
              timePast: {
                  me,
                  youMaleSingle,
                  youFemaleSingle,
                  he,
                  she,
                  we,
                  youMalePlural,
                  youFemalePlural,
                  theyMalePlural,
                  theyFemalePlural
              }
            }
          );
  
          if (!apiResponse.isError && apiResponse.code === 202) {
            const oldRecord = { 
              _id: recordId, 
              translit, 
              ru,
              infinitive,
              binyanType,
              root,
              timePresent: {
                  maleSingle,
                  femaleSingle,
                  malePlural,
                  femalePlural
              },
              timePast: {
                  me,
                  youMaleSingle,
                  youFemaleSingle,
                  he,
                  she,
                  we,
                  youMalePlural,
                  youFemalePlural,
                  theyMalePlural,
                  theyFemalePlural
              }
            };
            const newItems = GuiModify.afterRenameBinyan(
              this.items,
              oldRecord,
              apiResponse.data
            );
            this.items = newItems;
  
            Toast.fire({
              icon: "success",
              title: "Биньян изменен в базе",
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
            `/binyans/remove/${recordId}`
          );
          if (!apiResponse.isError && apiResponse.code === 200) {
            const newItems = GuiModify.afterDeleteBinyan(this.items, recordId);
            this.items = newItems;
            Toast.fire({
              icon: "success",
              title: "Биньян удален из базы!",
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

        const binyanHTML = getBinyanInput();
  
        const { value: formValues } = await this.$swal.fire({
          title: "Добавить",
          html: binyanHTML,
          focusConfirm: false,
          preConfirm: () => {
            return [
              document.getElementById("ru").value!,
              document.getElementById("translit").value!,
              document.getElementById("infinitive").value!,
              document.getElementById("binyanType").value!,
              document.getElementById("root").value!,
              document.getElementById("maleSingle").value!,
              document.getElementById("femaleSingle").value!,
              document.getElementById("malePlural").value!,
              document.getElementById("femalePlural").value!,
              document.getElementById("me").value!,
              document.getElementById("youMaleSingle").value!,
              document.getElementById("youFemaleSingle").value!,
              document.getElementById("he").value!,
              document.getElementById("she").value!,
              document.getElementById("we").value!,
              document.getElementById("youMalePlural").value!,
              document.getElementById("youFemalePlural").value!,
              document.getElementById("theyMalePlural").value!,
              document.getElementById("theyFemalePlural").value!,
            ];
          },
        });
  
        if (formValues) {
          const [ru, translit, infinitive, binyanType, root, maleSingle, femaleSingle, malePlural, femalePlural, me, youMaleSingle, youFemaleSingle, he, she, we, youMalePlural, youFemalePlural, theyMalePlural, theyFemalePlural] = formValues;
  
          const apiResponse = await Api.doPostRequest("/binyans/addNew", {
            translit, 
            ru,
            infinitive,
            binyanType,
            root,
            timePresent: {
                maleSingle,
                femaleSingle,
                malePlural,
                femalePlural
            },
            timePast: {
                me,
                youMaleSingle,
                youFemaleSingle,
                he,
                she,
                we,
                youMalePlural,
                youFemalePlural,
                theyMalePlural,
                theyFemalePlural
            }
          });
  
          if (!apiResponse.isError && apiResponse.code === 201) {
            const newItems = GuiModify.afterBinyanInsert(this.items, apiResponse.data);
            this.items = newItems;
            Toast.fire({
              icon: "success",
              title: "Биньян добавлен в базу",
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
          "биньяны",
          false
        );
        if (confirmation.isConfirmed) {
          const apiResponse = await Api.doGetRequest("/binyans/restore");
          if (apiResponse && apiResponse.restored) {
            Toast.fire({
              icon: "success",
              title: "Все биньяны восстановлены из резервной копии",
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
            `/binyans/getAllItems?sort=1&page=${currentPage}`
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
            `/binyans/getAllItems?sort=-1&page=${currentPage}`
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
      const items = await Api.doGetRequest("/binyans/getAllItems");
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
          <th>Инф.</th>
          <th>Транскр.</th>
          <th>На рус.</th>
          <th>Биньян</th>
          <th>Корень</th>
          <th>Наст.вр.</th>
          <th>Пр.вр.</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody v-for="item in items" :key="item._id">
        <tr>
          <td>{{ item._id }}</td>
          <td>{{ item.infinitive }}</td>
          <td>{{ item.translit }}</td>
          <td>{{ item.ru }}</td>
          <td>{{ item.binyanType }}</td>
          <td>{{ item.root }}</td>
          <td>
            - {{ item.timePresent.maleSingle }}<br />
            - {{ item.timePresent.femaleSingle }}<br />
            - {{ item.timePresent.malePlural }}<br />
            - {{ item.timePresent.femalePlural }}<br />
          </td>
          <td>
            - я - {{ item.timePast.me }}<br />
            - ты (м) - {{item.timePast.youMaleSingle}}<br />
            - ты (ж) - {{item.timePast.youFemaleSingle}}<br />
            - он - {{item.timePast.he}}<br />
            - она - {{item.timePast.she}}<br />
            - мы - {{item.timePast.we}}<br />
            - вы (м) - {{item.timePast.youMalePlural}}<br />
            - вы (ж) - {{item.timePast.youFemalePlural}}<br />
            - они (м) - {{item.timePast.theyMalePlural}}<br />
            - они (ж) - {{item.timePast.theyFemalePlural}}<br />
          </td>
          <td>
            <button v-on:click="showModifyWindow">Изменить</button>
            <button v-on:click="showDeleteWindow">Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else style="margin: 100px 0; color: black; font-size: 24px">
      База данных пуста - попробуйте восстановить данные (кнопка ниже) или дождитесь загрузки
    </div>
  </div>
  <div>
    <input
      v-on:change="searchByWord"
      type="text"
      placeholder="Поиск биньяна"
    />
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
    