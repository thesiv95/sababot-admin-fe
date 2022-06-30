<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <!--allrecords-->
  <div class="t-records t-records_animated t-records_visible">
    <!--header-->
    <div id="t-header" class="t-records t-records_animated t-records_visible">
      <div
        id="navbar"
        class="r t-rec t-rec_pt_0 t-rec_pb_0"
        style="padding-top: 0px; padding-bottom: 0px; background-color: #ffffff"
      >
        <!-- T228 -->
        <div
          class="t228 t228__positionfixed"
          style="
            background-color: rgba(242, 244, 246, 0);
            height: 150px;
            box-shadow: none;
          "
        >
          <div
            class="t228__maincontainer t228__c12collumns"
            style="height: 150px"
          >
            <div class="t228__padding40px"></div>
            <div class="t228__leftside" style="min-width: 190px">
              <div class="t228__leftcontainer">
                <img
                  src="/src/assets/logo-3.png"
                  class="t228__imglogo t228__imglogomobile"
                  imgfield="img"
                  style="
                    max-width: 150px;
                    width: 150px;
                    min-width: 150px;
                    height: auto;
                    display: block;
                  "
                  alt="logo"
                />
              </div>
            </div>
            <div class="t228__centerside">
              <div class="t228__centercontainer">
                <ul class="t228__list">
                  <li class="t228__list_item">
                    <RouterLink to="/" class="t-menu__link-item menu">
                      Слова
                    </RouterLink>
                  </li>
                  <li class="t228__list_item">
                    <RouterLink to="/nsfws" class="t-menu__link-item menu">
                      18+
                    </RouterLink>
                  </li>
                  <li class="t228__list_item">
                    <RouterLink to="/bituyim" class="t-menu__link-item menu">
                      Поговорки
                    </RouterLink>
                  </li>
                  <li class="t228__list_item">
                    <RouterLink to="/tshokim" class="t-menu__link-item menu">
                      Шутки
                    </RouterLink>
                  </li>
                  <li class="t228__list_item">
                    <RouterLink to="/lessons" class="t-menu__link-item menu">
                      Уроки
                    </RouterLink>
                  </li>
                  <li class="t228__list_item">
                    <RouterLink to="/reminder" class="t-menu__link-item menu">
                      Напоминалка
                    </RouterLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <!--[if IE 8
          ]><style>
            #navbar .t228 {
              filter: progid:DXImageTransform.Microsoft.gradient(startColorStr='#D9f2f4f6', endColorstr='#D9f2f4f6');
            }
          </style><!
        [endif]-->
      </div>
    </div>
    <!--/header-->
  </div>
  <div id="rec263037625" class="r t-rec">
    <div class="t-cover" style="height: 100vh; background: #fff">
      <div class="t-container">
        <div class="t-col t-col_12">
          <div class="t102 t-align_center">
            <RouterView />
            <br />
            <br />
            <p class="copyright">
              &copy; thesiv95, 2022{{
                new Date().getFullYear() === 2022
                  ? ""
                  : `-${new Date().getFullYear()}`
              }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <!--/footer-->
  </div>
  <!--/allrecords-->
</template>

<style>
.copyright {
  color: black;
  font-weight: bold;
}
</style>
