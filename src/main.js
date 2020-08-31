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
    apiKey: "AIzaSyAvKgx1AmGvS_7f_62iIvdxR2lyzJreVcM",
    authDomain: "kaushaldemo-8d55c.firebaseapp.com",
    databaseURL: "https://kaushaldemo-8d55c.firebaseio.com",
    projectId: "kaushaldemo-8d55c",
    storageBucket: "kaushaldemo-8d55c.appspot.com",
    messagingSenderId: "875925326754"
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
