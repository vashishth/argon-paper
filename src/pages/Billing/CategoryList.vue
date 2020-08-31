<template>
  <span>
    <transition name="modal" v-if="imgModal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">
            <h2 style="margin: 0;">Add New Category</h2>
            <div class="modal-body">
              <div
                v-if="category_alert"
                class="alert alert-danger"
                role="alert"
              >
                {{ category_alert }}
              </div>
              <div class="modal-body" style="text-align: left;">
                <div class="row">
                  <div class="col-lg-12 col-md-12 col-sm-12">
                    <p>
                      Category Name :<input
                        type="text"
                        class="form-control"
                        id="usr"
                        v-model="catName"
                      />
                    </p>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-12 col-md-12 col-sm-12">
                    <p>
                      Re-enter Category Name :<input
                        type="text"
                        onpaste="return false;"
                        v-model="catRename"
                        class="form-control"
                        id="usr"
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <slot name="footer">
                <button
                  type="button"
                  class="btn btn-default"
                  @click="closeModel"
                >
                  Close
                </button>
                <button
                  type="button"
                  class="btn btn-default"
                  @click="saveCategory"
                >
                  Save
                </button>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header" style="padding: 10px;">
            <span style="font-size:40px;"><b>Category List</b></span>
            <button
              type="button"
              class="btn btn-default"
              style="float: right;margin: 10px;"
              @click="addCategory"
            >
              New Category <i class="fa fa-plus-circle"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Category Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filterBy(categories.category).length <= 0">
                <td colspan="7">Please wait...</td>
              </tr>
              <tr v-if="datafounderror">
                <td colspan="7">No Data Found</td>
              </tr>
              <tr
                v-for="(value, index) in limitBy(
                  categories.category,
                  10,
                  page * 10 - 10
                )"
                :key="index"
                :value="value"
              >
                <td>{{ index + 1 + page * 10 - 10 }}</td>
                <td>{{ value.charAt(0).toUpperCase() + value.substr(1) }}</td>
                <td>
                  <div v-if="value !== 'Home' && value !== 'Work'">
                    <a
                      @click="deleteCategory(value)"
                      v-if="value !== 'home' && value !== 'work'"
                      style="font-size: 2.5em;color: #dc3545;cursor: pointer;"
                      ><i class="fa fa-trash"></i
                    ></a>
                  </div>
                  <div v-else>
                    <a
                      style="font-size: 2.5em;color: rgb(175, 175, 175);cursor: not-allowed;"
                      ><i class="fa fa-trash"></i
                    ></a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <pagination
            v-model="page"
            :records="categories.category.length"
            :per-page="10"
            v-if="categories.category.length > 10"
            style="margin: 0px 0 0 40%;"
          ></pagination>
        </div>
      </div>
    </div>
    <div id="overlay" v-if="showloder"><div class="loader"></div></div>
  </span>
</template>
<script>
import firebase from "firebase";
export default {
  name: "Category",
  data() {
    return {
      imgModal: false,
      categories: {
        category: []
      },
      available_cat: "",
      catArray: "",
      showloder: true,
      catRename: "",
      catName: "",
      category_alert: "",
      datafound: true,
      datafounderror: false,
      page: 1
    };
  },
  methods: {
    addCategory: function() {
      // alert('sds')
      this.imgModal = true;
      this.catRename = "";
      this.catName = "";
      this.category_alert = "";
    },
    closeModel: function() {
      this.imgModal = false;
    },
    addUserCategory: function() {
      // this.$router.push({ name: 'userpermission' })
    },
    saveCategory: function() {
      var username;
      firebase.auth().onAuthStateChanged(function(user) {
        username = user.email;
      });
      var db = firebase.firestore();
      var thisI = this;
      this.showloder = true;
      // db.settings({
      //   timestampsInSnapshots: true
      // })
      if (
        this.catRename === this.catName &&
        this.catName !== "" &&
        this.catRename !== ""
      ) {
        this.catArray = this.catName;
        var docRef = db.collection("category");
        docRef
          .doc("categoryId")
          .update({
            category: firebase.firestore.FieldValue.arrayUnion(
              thisI.catArray.charAt(0).toUpperCase() + thisI.catArray.substr(1)
            )
          })
          .then(function() {
            db.collection("categoryCreatedlog").add({
              action: "create",
              categoryName: thisI.catArray,
              createdDate: new Date(),
              username: username
            });
            thisI.showloder = false;
            location.reload(true);
            console.log("Document successfully updated!");
          });
      } else {
        this.showloder = false;
        this.category_alert = "Please enter same category name.";
        // alert('Please enter same category name.')
      }
    },
    deleteCategory: function(catName) {
      var username;
      firebase.auth().onAuthStateChanged(function(user) {
        username = user.email;
      });
      var db = firebase.firestore();
      var thisI = this;
      this.showloder = true;
      // db.settings({
      //   timestampsInSnapshots: true
      // })
      var docRef = db.collection("category");
      if (catName !== "Home" && catName !== "Work") {
        docRef
          .doc("categoryId")
          .update({
            category: firebase.firestore.FieldValue.arrayRemove(catName)
          })
          .then(function() {
            db.collection("categoryDeletelog").add({
              action: "delete",
              categoryName: catName,
              deletedDate: new Date(),
              username: username
            });
            location.reload(true);
            console.log("Document successfully updated!");
          });
      } else {
        thisI.showloder = false;
        alert("Sorry, Its default category.");
      }
    },
    createOrder: function() {
      // this.$router.push({ name: 'billingForm' })
    },
    logoutButton: function() {
      // var thisI = this
      // firebase.auth().signOut().then(function () {
      //   thisI.$router.push({ name: 'Login' })
      //   return false
      // })
    },
    orderView: function() {
      window.open(this.$router.resolve({ name: "orderview" }).href, "_blank");
    }
  },
  mounted: function() {
    var db = firebase.firestore();
    var thisI = this;
    // db.settings({
    //   timestampsInSnapshots: true
    // })
    var docRef = db.collection("category");
    docRef
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          thisI.categories = doc.data();
          thisI.showloder = false;
          thisI.datafound = false;
        });
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
        thisI.datafounderror = true;
      });
    firebase.auth().onAuthStateChanged(function(user) {
      // User access category collection
      if (user) {
        var userAccess = db
          .collection("user_access")
          .where("user_name", "==", user.email);
        userAccess.get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            if (doc.data().is_admin) {
              thisI.available_cat = thisI.categories.category;
            } else {
              thisI.available_cat = doc.data().category_permission;
            }
          });
        });
      } else {
        thisI.$router.push({ name: "Login" });
      }
    });
  }
};
</script>
