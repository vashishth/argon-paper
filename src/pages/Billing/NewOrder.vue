<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header" style="padding: 10px;">
            <span style="font-size:40px;"><b>New Order</b></span>
            <button type="button" class="btn btn-default" style="float: right;margin: 10px;" @click="orderView"> <i class="fa fa-chevron-circle-left"></i> Back</button>
          </div>
         </div>
      </div>
    </div>
     <div id="snackbar" v-if="snackbar" v-bind:style="{ background: activeColor }">{{ message }}</div>
    <div class="card card">
       <div class="card-body">
          <div>
             <form>
                <div class="row">
                   <div class="col-md-3">
                      <div class="form-group">
                         <label class="control-label">Product Name</label>
                         <input class="form-control" name="name" id="name" v-model="productname"  placeholder="Enter Product Name"/>
                         <span v-if='productname_alert' style="color:red;float: left;align-items: center;">* {{productname_alert}}</span>
                      </div>
                   </div>
                   <div class="col-md-3">
                      <div class="form-group">
                         <label class="control-label">Amount</label>
                         <input class="form-control" name="amount" id="amount" v-model="amount" placeholder="Enter Amount" @keypress="keymonitor"/>
                         <span v-if='amount_alert' style="color:red;float: left;align-items: center;">* {{amount_alert}}</span>
                      </div>
                   </div>
                   <div class="col-md-3">
                      <div class="form-group">
                         <label class="control-label">Category</label>
                         <select class="form-control" id="category_option" v-model="category">
                            <option v-for="value in categories.category" :key="value" :value="value">{{value.charAt(0).toUpperCase() + value.substr(1)}}</option>
                         </select>
                         <span v-if='category_alert' style="color:red;float: left;align-items: center;">* {{category_alert}}</span>
                      </div>
                   </div>
                   <div class="col-md-3">
                      <div class="form-group">
                         <label class="control-label">Order Date</label>
                         <input type="date" class="form-control" name="order_date" id="order_date" v-model="date"/>
                         <span v-if='orderdate_alert' style="color:red;float: left;align-items: center;">* {{orderdate_alert}}</span>
                      </div>
                   </div>
                </div>
                <div class="row">
                   <div class="col-md-12">
                      <div class="form-group">
                        <label>Extra Note</label>
                        <textarea rows="5" placeholder="Add Note" v-model="note" class="form-control border-input" name="comment" id="comment" form="usrform"></textarea>
                        <span v-if='comment_alert' style="color:red;float: left;align-items: center;">* {{comment_alert}}</span>
                      </div>
                   </div>
                </div>
                <div class="row">
                   <div class="col-md-12">
                      <div class="form-group">
                        <label>Select An Image</label>
                        <input type="file" class="form-control" name="file" id="file" @change="filename" accept="image/x-png,image/gif,image/jpeg,image/jpg,image/tiff,image/bmp,application/pdf,.xls,.txt,.odt"/>
                        <span v-if='image_alert' style="color:red;float: left;align-items: center;">* {{image_alert}}</span>
                        <!-- <textarea rows="5" placeholder="Add Note" v-model="note" class="form-control border-input" name="comment" id="comment" form="usrform"></textarea> -->
                        <!-- <textarea rows="5" placeholder="Here can be your description" class="form-control border-input"></textarea> -->
                      </div>
                   </div>
                </div>
                <div class="text-center">
                   <button type="button" class="btn btn-round btn-info" @click="registrationButton">
                      Save Order
                   </button>
                </div>
                <div class="clearfix"></div>
             </form>
          </div>
       </div>
       <!---->
    </div>
     <div id="overlay" v-if="showloder">
        <div class="loader"></div>
     </div>
  </div>
</template>
<script>
import firebase from 'firebase'
// import router from '../router'
export default {
  name: 'Billing',
  data () {
    return {
      showloder: false,
      reglable: true,
      productname: '',
      available_cat: '',
      amount: '',
      note: '',
      category: 'home',
      date: '',
      file: '',
      message: '',
      snackbar: false,
      is_admin: '',
      url: '',
      regbutton: false,
      categories: '',
      activeColor: '#f54d4d',
      productname_alert: '',
      amount_alert: '',
      comment_alert: '',
      category_alert: '',
      orderdate_alert: '',
      image_alert: ''
    }
  },
  methods: {
    registrationButton: function () {
      this.regbutton = true
      this.showloder = true
      this.reglable = false
      this.productname_alert = ''
      this.amount_alert = ''
      this.comment_alert = ''
      this.category_alert = ''
      this.orderdate_alert = ''
      this.image_alert = ''
      var self = this
      if (document.getElementById('file').files.length !== 0 && this.productname !== '' && this.amount !== '' && this.note !== '' && this.category !== '' && this.date !== '' && this.file !== '') {
        if (this.file.type === 'application/vnd.ms-excel' || this.file.type === 'text/plain' || this.file.type === 'image/png' || this.file.type === 'image/gif' || this.file.type === 'image/jpeg' || this.file.type === 'image/jpg' || this.file.type === 'image/tiff' || this.file.type === 'image/bmp' || this.file.type === 'application/pdf' || this.file.type === 'application/vnd.ms-excel' || this.file.type === 'application/vnd.oasis.opendocument.text') {
          const ref = firebase.storage().ref()
          const name = (+new Date()) + '-' + this.file.name
          const metadata = {
            contentType: this.file.type
          }
          const task = ref.child(name).put(this.file, metadata)
          task
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then((url) => {
              self.url = url
              if (url !== '') {
                var file1 = self.url
                var db = firebase.firestore()
                // db.settings({
                //   timestampsInSnapshots: true
                // })
                db.collection('users').add({
                  pro_name: self.productname,
                  category: self.category,
                  amount: self.amount,
                  order_date: self.date,
                  comment: self.note,
                  file: file1,
                  imageType: this.file.type,
                  startedAt: new Date()
                })
                  .then(function (docRef) {
                    self.productname = ''
                    self.category = ''
                    self.amount = ''
                    self.date = ''
                    self.note = ''
                    self.file = ''
                    self.url = ''
                    self.showloder = false
                    self.reglable = true
                    self.input = ''
                    var fileLoader = document.getElementById('file')
                    fileLoader.value = null
                    self.snackbar = true
                    self.message = 'Order added successfully.'
                    self.activeColor = 'green'
                    setTimeout(function () { self.snackbar = false }, 2000)
                    self.regbutton = false
                  })
              }
            })
        } else {
          this.snackbar = true
          this.message = 'File format is not valid'
          this.activeColor = '#f54d4d'
          setTimeout(function () { self.snackbar = false }, 2000)
          this.showloder = false
          self.regbutton = false
          this.reglable = true
          return false
        }
      } else {
        this.snackbar = true
        if (this.productname === '') { this.productname_alert = 'This field is required' }
        if (this.amount === '') { this.amount_alert = 'This field is required' }
        if (this.note === '') { this.comment_alert = 'This field is required' }
        if (this.category === '') { this.category_alert = 'This field is required' }
        if (this.date === '') { this.orderdate_alert = 'This field is required' }
        if (this.file === '') { this.image_alert = 'This field is required' }
        this.message = 'Please fill all field.'
        this.activeColor = '#f54d4d'
        setTimeout(function () { self.snackbar = false }, 2000)
        this.showloder = false
        self.regbutton = false
        this.reglable = true
        return false
      }
    },
    filename: function (event) {
      var files = event.target.files[0]
      this.file = files
    },
    logoutButton: function () {
      var thisI = this
      firebase.auth().signOut().then(function () {
        thisI.$router.push({ name: 'login' })
        return false
      })
    },
    keymonitor: function (event) {
      this.amount = this.amount.replace(/[^0-9.]/g, '')
      if ((event.which !== 46 || this.amount.indexOf('.') !== -1) && (event.which < 48 || event.which > 57)) {
        event.preventDefault()
      }
    },
    orderView: function () {
      this.$router.push({ name: 'Order List' })
    },
    newCategory: function () {
      window.open(this.$router.resolve({ name: 'addnewcategory' }).href, '_blank')
    }
  },
  mounted: function () {
    var self = this
    this.showloder = true
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        self.$router.push({ name: 'NewOrder' })
        var db = firebase.firestore()
        // db.settings({
        //   timestampsInSnapshots: true
        // })
        var docRef = db.collection('category')
        docRef.get().then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            self.categories = doc.data()
            self.showloder = false
          })
        }).catch(function (error) {
          console.log('Error getting document:', error)
        })
        // User access category collection
        var userAccess = db.collection('user_access').where('user_name', '==', user.email)
        userAccess.get().then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            if (doc.data().is_admin) {
              self.available_cat = self.categories.category
              self.is_admin = true
            } else {
              self.available_cat = doc.data().category_permission
              self.is_admin = false
            }
          })
        })
        return false
      } else {
        self.showloder = false
        self.$router.push({ name: 'login' })
      }
    })
  }
}
</script>

<style>
#snackbar {
 min-width: 383px;
 margin-left: -187px;
 background-color: #f54d4d;
 color: #fff;
 text-align: center;
 border-radius: 2px;
 padding: 16px;
 position: fixed;
 z-index: 1;
 left: 49%;
 margin-top: 5%;
 /* bottom: 30px; */
 font-size: 17px;
 bottom:100px;
}
#snackbar {
 visibility: visible;
 -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
 animation: fadein 0.5s, fadeout 0.5s 2.5s;
}
</style>