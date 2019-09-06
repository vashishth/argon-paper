<template>
  <div class="wrapper">
    <side-bar>
      <template slot="links">
        <router-link tag="li" :to="{name: 'Order List'}" class="nav-item" exact>
          <a class="nav-link">
            <i class="fa fa-newspaper-o"></i><p>Order</p>
          </a>
        </router-link>
        <router-link tag="li" :to="{name: 'CategoryList'}" class="nav-item">
          <a class="nav-link">
            <i class="ti-view-list-alt"></i><p>Category</p>
          </a>
        </router-link>
        <router-link tag="li" :to="{name: 'UserPermission'}" class="nav-item">
          <a class="nav-link">
            <i class="fa fa-address-card"></i><p>User Permission</p>
          </a>
        </router-link>
        <!-- <sidebar-link to="/" name="Order" icon="fa fa-newspaper-o"/>
        <sidebar-link to="/category-list" name="Category" icon="ti-view-list-alt"/>
        <sidebar-link to="/user-permission" name="User Permission" icon="fa fa-address-card" v-if="is_admin"/> -->
        <li class="nav-item"><a class="nav-link" @click="Logout"><i class="fa fa-sign-out"></i><p>Logout</p></a></li>
      </template>
    </side-bar>
    <div class="main-panel">
      <dashboard-content @click.native="toggleSidebar">
      </dashboard-content>
      <content-footer></content-footer>
    </div>
  </div>
</template>
<style lang="scss">
</style>
<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "./MobileMenu";
import firebase from 'firebase';
export default {
  data() {
    return {
      is_admin: false
    }
  },
  components: {
    TopNavbar,
    ContentFooter,
    DashboardContent,
    MobileMenu
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
    Logout: function () {
      var thisI = this
      firebase.auth().signOut().then(function () {
        thisI.$router.push({ name: 'Login' })
        return false
        // Sign-out successful.
      })
    },
  },
  mounted: function () {
    var self = this
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        var db = firebase.firestore()
        // User access category collection
        var userAccess = db.collection('user_access').where('user_name', '==', user.email)
        userAccess.get().then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            if (doc.data().is_admin) {
              self.is_admin = true
            } else {
              self.is_admin = false
            }
          })
        })
        return false
      }
    })
  }
};
</script>
