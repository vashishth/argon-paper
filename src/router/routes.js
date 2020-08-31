import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";

// Admin pages
import Dashboard from "@/pages/Dashboard.vue";
import UserProfile from "@/pages/UserProfile.vue";
import Notifications from "@/pages/Notifications.vue";
import Icons from "@/pages/Icons.vue";
import Maps from "@/pages/Maps.vue";
import Typography from "@/pages/Typography.vue";
import TableList from "@/pages/TableList.vue";

import Login from "@/pages/Billing/Login.vue";
import OrderList from "@/pages/Billing/BillList.vue";
import NewOrder from "@/pages/Billing/NewOrder.vue";
import CategoryList from "@/pages/Billing/CategoryList.vue";
import UserPermission from "@/pages/Billing/UserPermission.vue";
import firebase from "firebase";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/",
    component: DashboardLayout,
    children: [
      {
        path: "/",
        name: "Order List",
        component: OrderList
      },
      {
        path: "/new-order",
        name: "NewOrder",
        component: NewOrder
      },
      {
        path: "/category-list",
        name: "CategoryList",
        component: CategoryList,
        afterEnter: (to, from, next) => {
          var db = firebase.firestore();
          // db.settings({
          //   timestampsInSnapshots: true
          // })
          firebase.auth().onAuthStateChanged(function(user) {
            // User access category collection
            if (user) {
              var userAccess = db
                .collection("user_access")
                .where("user_name", "==", user.email);
              userAccess.get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                  if (doc.data().is_admin) {
                    next("/Order List");
                  } else {
                    next(self.path);
                  }
                });
              });
            }
          });
        }
      },
      {
        path: "/user-permission",
        name: "UserPermission",
        component: UserPermission,
        afterEnter: (to, from, next) => {
          var db = firebase.firestore();
          db.settings({
            timestampsInSnapshots: true
          });
          firebase.auth().onAuthStateChanged(function(user) {
            // User access category collection
            if (user) {
              var userAccess = db
                .collection("user_access")
                .where("user_name", "==", user.email);
              userAccess.get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                  if (doc.data().level !== "Level 1") {
                    next("/Order List");
                  } else {
                    next(self.path);
                  }
                });
              });
            }
          });
        }
      },
      {
        path: "/dashboard",
        name: "order",
        component: Dashboard
      },
      {
        path: "stats",
        name: "stats",
        component: UserProfile
      },
      {
        path: "notifications",
        name: "notifications",
        component: Notifications
      },
      {
        path: "icons",
        name: "icons",
        component: Icons
      },
      {
        path: "maps",
        name: "maps",
        component: Maps
      },
      {
        path: "typography",
        name: "typography",
        component: Typography
      },
      {
        path: "table-list",
        name: "table-list",
        component: TableList
      }
    ]
  },
  { path: "*", component: NotFound }
];

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes;
