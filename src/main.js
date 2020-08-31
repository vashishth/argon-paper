import Vue from "vue";
import App from "./App";
import router from "./router/index";

import firebase from "firebase";
import Vue2Filters from "vue2-filters";
import VuePaginate from "vue-pagination-2";
import JsonExcel from "vue-json-excel";
import JqueryFileDownLoad from "jquery-file-download";
import axios from "axios";

import PaperDashboard from "./plugins/paperDashboard";
import "vue-notifyjs/themes/default.css";

Vue.use(PaperDashboard);

Vue.prototype.$http = axios;
Vue.use(Vue2Filters);
Vue.use(VuePaginate);
Vue.use(JsonExcel);
Vue.use(JqueryFileDownLoad);
Vue.component("pagination", VuePaginate);
Vue.component("downloadExcel", JsonExcel);
Vue.config.productionTip = false;

if (navigator.onLine) {
  var config = {
    apiKey: "AIzaSyDn6sVWCpQ4vIqn3wJTNVX6_N8iS38DlbY",
    authDomain: "argon-3adce.firebaseapp.com",
    databaseURL: "https://argon-3adce.firebaseio.com",
    projectId: "argon-3adce",
    storageBucket: "argon-3adce.appspot.com",
    messagingSenderId: "605742544011",
    appId: "1:605742544011:web:3bd2f7e2cd599b9b3c108e",
    measurementId: "G-7JSXL9WM66"
  };
  firebase.initializeApp(config);
} else {
  alert("please check your network connection.");
}

/* eslint-disable no-new */
new Vue({
  router,
  firebase,
  render: h => h(App)
}).$mount("#app");
