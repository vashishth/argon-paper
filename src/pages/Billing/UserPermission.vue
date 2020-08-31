<template>
  <span>
    <transition name="modal" v-if="imgModal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">
            <h2 style="margin: 0;">User Permission</h2>
            <div class="modal-body" style="margin: 0;">
             <div v-if="category_user" class="alert alert-danger" role="alert">{{category_user}}</div>
              <div class="modal-body" style="text-align: left;">
                <div class="row">
                  <div class="col-lg-12 col-md-12 col-sm-12"><p>User Name :<input type="text" class="form-control" id="usr" v-model="userName"></p></div>
                </div>
                <div class="row">
                  <div class="col-lg-12 col-md-12 col-sm-12"><p>Is Admin? : <input type="checkbox" v-model="select_level"></p>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-12 col-md-12 col-sm-12"><p>Select Category :
                    <!-- <input type="text" onpaste="return false;" v-model="catRename" class="form-control" id="usr"> -->
                    <select multiple class="form-control" v-model="select_cat">
                      <option v-for="value in filterBy(categories.category)" :key="value" :value="value">{{value.charAt(0).toUpperCase() + value.substr(1)}}</option>
                    </select></p>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <slot name="footer">
                <button type="button" class="btn btn-default" data-dismiss="modal" @click="closeModel">Close</button>
                <button type="button" class="btn btn-default" data-dismiss="modal" v-if="edit_save === 'add'" @click="saveUserCategory">Save</button>
                <button type="button" class="btn btn-default" data-dismiss="modal" v-if="edit_save === 'edit'" @click="editUserCategory">Update</button>
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
            <span style="font-size:40px;"><b>User Permissions</b></span>
            <button type="button" class="btn btn-default" style="float: right;margin: 10px;" @click="addUserCategory('add')">New User<i class="fa fa-plus-circle"></i></button>
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
                <th>User Name</th>
                <th>Categories</th>
                <th colspan="2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filterBy(user_data).length <= 0"><td colspan="7">Please wait...</td></tr>
              <tr v-if="datafounderror"><td colspan="7">No Data Found</td></tr>
              <tr v-for="(value, index) in limitBy(user_data, 10, page * 10 - 10)" :key="index">
                <td>{{ index+1+page * 10 - 10 }}</td>
                <td><i class="fa fa-user" v-if="value.is_admin === true"></i> {{ value.user_name }}</td>
                <td>
                  <span id="assign_category" :key="index" v-for="(category, index) in value.category_permission">
                    <span><i class="fa fa-times cat-list" @click="removeCategory(value.id, category)"></i>&nbsp;&nbsp;{{category}}</span>
                  </span>
                </td>
                <td>
                  <div v-if='value.is_admin !== true'>
                    <a @click="deleteUserCategory(value.id)" style="font-size: 2.5em;color: #dc3545;cursor: pointer;"><i class="fa fa-trash"></i></a>
                  </div>
                  <div v-else>
                    <a style="font-size: 2.5em;color: rgb(175, 175, 175);cursor: not-allowed;"><i class="fa fa-trash"></i></a>
                  </div>
                </td>
                <td>
                  <a @click="addUserCategory('edit', value.id, value.user_name, value.is_admin, value.category_permission)" style="font-size: 2.5em;color: rgb(11, 122, 34);cursor: pointer;" data-target="#myModal1" data-toggle="modal"><i class="fa fa-edit"></i></a>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="row">
            <div class="col-md-12">
              <pagination style="margin: 0px 0 0 40%;" v-model="page" :records="categories.category.length" :per-page="10" v-if="categories.category.length>10"></pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="overlay" v-if="showloder"><div class="loader"></div></div>
  </span>
</template>
<script>
import firebase from 'firebase'
export default {
  name: 'Category',
  data () {
    return {
      imgModal: false,
      categories: {
        category: []
      },
      users: [],
      user_data: [],
      category_user: '',
      userName: '',
      select_cat: [],
      select_level: '',
      available_cat: '',
      useraccess_id: '',
      edit_save: '',
      showloder: true,
      datafound: true,
      datafounderror: false,
      page: 1
    }
  },
  methods: {
    addUserCategory: function (event, id, username, isAdmin, category) {
      this.imgModal = true
      if (event === 'edit') {
        this.edit_save = 'edit'
        this.userName = username
        this.select_cat = category
        this.select_level = isAdmin
        this.category_user = ''
        this.useraccess_id = id
      } else {
        this.edit_save = 'add'
        this.userName = ''
        this.select_cat = []
        this.select_level = ''
        this.category_user = ''
      }
    },
    removeCategory: function (id, category) {
      var db = firebase.firestore()
      var thisI = this
      this.showloder = true
      // db.settings({
      //   timestampsInSnapshots: true
      // })
      var docRef = db.collection('user_access')
      docRef.doc(id).update({
        'category_permission': firebase.firestore.FieldValue.arrayRemove(category)
      }).then(function () {
        thisI.showloder = false
        location.reload(true)
        console.log('Document successfully updated!')
      })
    },
    closeModel: function () {
      this.imgModal = false
    },
    saveUserCategory: function () {
      var db = firebase.firestore()
      var thisI = this
      this.showloder = true
      // db.settings({
      //   timestampsInSnapshots: true
      // })
      if (this.userName !== '' && this.select_cat.length > 0) {
        var docRef = db.collection('user_access')
        docRef.add({
          user_name: thisI.userName,
          is_admin: thisI.select_level,
          category_permission: thisI.select_cat
        }).then(function () {
          thisI.showloder = false
          location.reload(true)
          console.log('Document successfully updated!')
        })
      } else {
        this.showloder = false
        this.category_user = 'Please enter valide data.'
      }
    },
    editUserCategory: function () {
      var db = firebase.firestore()
      var thisI = this
      this.showloder = true
      // db.settings({
      //   timestampsInSnapshots: true
      // })
      if (this.userName !== '' && this.select_cat.length > 0) {
        var docRef = db.collection('user_access')
        docRef.doc(thisI.useraccess_id).update({
          user_name: thisI.userName,
          is_admin: thisI.select_level,
          category_permission: thisI.select_cat
        }).then(function () {
          thisI.showloder = false
          location.reload(true)
          console.log('Document successfully updated!')
        })
      } else {
        this.showloder = false
        this.category_user = 'Please enter valide data.'
      }
    },
    deleteUserCategory: function (userId) {
      var db = firebase.firestore()
      var thisI = this
      this.showloder = true
      var docRef = db.collection('user_access').doc(userId)
      docRef.delete().then(function () {
        thisI.showloder = false
        location.reload()
      })
    },
    createOrder: function () {
      this.$router.push({ name: 'billingForm' })
    },
    logoutButton: function () {
      var thisI = this
      firebase.auth().signOut().then(function () {
        thisI.$router.push({ name: 'Login' })
        return false
      })
    },
    orderView: function () {
      window.open(this.$router.resolve({ name: 'orderview' }).href, '_blank')
    }
  },
  mounted: function () {
    var db = firebase.firestore()
    var thisI = this
    // db.settings({
    //   timestampsInSnapshots: true
    // })
    var docRef = db.collection('category')
    docRef.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        thisI.categories = doc.data()
        thisI.showloder = false
        thisI.datafound = false
      })
    }).catch(function (error) {
      console.log('Error getting document:', error)
      thisI.datafounderror = true
    })
    // user_access collection
    var userRef = db.collection('user_access')
    userRef.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        thisI.users.push(Object.assign(doc.data(), { 'id': doc.id }))
        thisI.datafound = false
      })
      thisI.user_data = thisI.users
      thisI.showloder = false
    }).catch(function (error) {
      console.log('Error getting document:', error)
      thisI.datafounderror = true
    })
    firebase.auth().onAuthStateChanged(function (user) {
      // User access category collection
      if (user) {
        var userAccess = db.collection('user_access').where('user_name', '==', user.email)
        userAccess.get().then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            if (doc.data().is_admin) {
              thisI.available_cat = thisI.categories.category
            } else {
              thisI.available_cat = doc.data().category_permission
            }
          })
        })
      } else {
        thisI.$router.push({ name: 'Login' })
      }
    })
  }
}
</script>
