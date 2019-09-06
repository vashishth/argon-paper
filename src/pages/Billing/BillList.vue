<template>
  <span>
    <transition name="modal" v-if="imgModal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">
            <div class="modal-body">
                 <div class="loader" v-show="!isLoad" style="margin-top:18px;width: 64px;height: 64px;border: 9px dotted #110f69;border-top: 9px dotted #110f69;border-right: 9px dotted #110f69;border-bottom: 9px dotted #110f69;"></div>
                 <img :src="imageurl" height="100%" width="100%" @load="loaded">
            </div>
            <div class="modal-footer">
              <slot name="footer">
                <button type="button" class="btn btn-default" data-dismiss="modal" @click="closeModel">Close</button>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div>
      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header" style="padding: 10px;">
              <span style="font-size:40px;"><b>Order List</b></span>
              <button type="button" class="btn btn-default" style="float: right;margin: 10px;" @click="createOrder">New Bill <i class="fa fa-plus-circle"></i></button>
            </div>
           </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header" style="padding: 10px;">
              <downloadExcel class="btn btn-success" :data="json_data" :fields="json_fields" name="filename.xls" style="margin:10px;"><i class="fa fa-download"></i>&nbsp;&nbsp;Back Up Data</downloadExcel>
              <button type="button" class="btn btn-danger" style="float: right;margin: 10px;" @click='reset'>Reset<i class="fa fa-refresh"></i></button>
            </div>
            <table class="table table-striped">
              <thead>
                <tr style="color: rgb(17, 15, 105);font-weight: 800;">
                 <th class="hidden-xs" style="padding-bottom: 64px;">ID</th>
                 <th style="padding-bottom: 26px;">Product Name<br><input type="text" class="form-control" id="usr" v-model="search_name"></th>
                 <th style="padding-bottom: 27px;">
                    Category<br>
                    <select class="form-control" style="padding: 0px 6px;" v-model="search_cat" @change="getFilterItem">
                       <option value=""></option>
                       <option v-for="value in filterBy(categories.category, val => available_cat.includes(val))" :key="value" :value="value">{{value.charAt(0).toUpperCase() + value.substr(1)}}</option>
                    </select>
                 </th>
                 <th style="padding-bottom: 64px;">Amount</th>
                 <th>Order Date<br><input style="width: 91%;padding: 2px 6px;height: 25px;margin-top: 2px;" type="date" class="form-control" id="usr" v-model="from_date" @change="getFilterItem"><br><input style="width: 91%;margin-top: -16px;padding: 2px 6px;height: 25px;" type="date" class="form-control" id="usr" v-model="to_date" @change="getFilterItem"></th>
                 <th style="padding-bottom: 64px;">Note</th>
                 <th style="padding-bottom: 64px;text-align:center;" colspan="2">Actions</th>
              </tr>
              </thead>
              <tbody>
                <tr v-if="filterBy(filterBy(itemOrders, search_name, 'pro_name', 'comment'), search_cat, 'category').length <= 0">
                  <td colspan="7">No Data Found</td>
                </tr>
                <tr v-for="(item, index) in limitBy(orderBy(filterBy(filterBy(itemOrders, search_name, 'pro_name', 'comment'), search_cat , 'category'), 'startedAt', -1), 10, page * 10 - 10)" v-bind:key="index">
                   <td class="hidden-xs">{{ index+1+page * 10 - 10 }}</td>
                   <td>{{ item.pro_name }}</td>
                   <td>{{ item.category }}</td>
                   <td>{{ item.amount }}</td>
                   <td>{{ item.order_date }}</td>
                   <td>{{ item.comment }}</td>
                   <td align="center">
                    <a @click="openimage(item.file)" v-if="item.imageType == 'image/png' || item.imageType == 'image/gif' || item.imageType == 'image/jpeg' || item.imageType == 'image/jpg' || item.imageType == 'image/bmp'" data-toggle="modal" data-target="#myModal" style="font-size: 2.5em;color: #110e69;cursor: pointer;"><i class="fa fa-camera"></i></a>
                    <a :href="item.file" v-else-if="item.imageType == 'application/pdf' || item.imageType == 'text/plain'" target="_blank" style="font-size: 2.5em;color: #110e69;cursor: pointer;"><i class="fa fa-arrow-circle-down"></i></a>
                    <a :href="item.file" v-else-if="item.imageType == 'application/vnd.ms-excel' || item.imageType == 'image/tiff' || item.imageType == 'application/vnd.oasis.opendocument.text'" style="font-size: 2.5em;color: #110e69;cursor: pointer;"><i class="fa fa-arrow-circle-down"></i></a>
                    <div class="modal fade" id="myModal" role="dialog" @click="modelClick($event)">
                       <div class="modal-dialog" style="margin-top: 12%;">
                          <div class="modal-content">
                             <div class="modal-body">
                                <div class="loader" v-show="!isLoad" style="margin-top:18px;width: 64px;height: 64px;margin-left: 1%;border: 9px dotted #110f69;border-top: 9px dotted #110f69;border-right: 9px dotted #110f69;border-bottom: 9px dotted #110f69;"></div>
                                <img :src="imageurl" height="100%" width="100%" @load="loaded">
                             </div>
                             <div class="modal-footer">
                                <button type="button" class="btn btn-default" data-dismiss="modal" @click="closeModel">Close</button>
                             </div>
                          </div>
                       </div>
                    </div>
                   </td>
                   <td><a @click="deleteOrder(item.id, item.file, item.pro_name, item.category, item.amount, item.order_date)" style="font-size: 2.5em;color: #dc3545;cursor: pointer;"><i class="fa fa-trash"></i></a></td>
                </tr>
              </tbody>
            </table>
            <pagination v-model="page" :records="items.length" :per-page="10" v-if="items.length>10" style="margin: 0px 0 0 40%;"></pagination>
          </div>
        </div>
      </div>
    </div>
    <div id="overlay" v-if="showloder">
      <div class="loader"></div>
    </div>
  </span>
</template>
<script>
import firebase from 'firebase'
export default {
  name: 'Orderview',
  data () {
    return {
      imgModal: false,
      showloder: true,
      itemOrders: [],
      items: [],
      imageurl: '',
      search_name: '',
      search_cat: '',
      from_date: '',
      available_cat: '',
      is_admin: '',
      to_date: '',
      page: 1,
      categories: {
        category: []
      },
      isLoad: false,
      json_fields: {
        'Product Name': 'pro_name',
        'Category': 'category',
        'Amount': 'amount',
        'Order Date': 'order_date',
        'Note': 'comment',
        'Images': 'imagename'
      },
      json_data: [],
      json_meta: [
        [
          {
            'key': 'charset',
            'value': 'utf-8'
          }
        ]
      ]
    }
  },
  methods: {
    openimage: function (imgurl) {
      this.imgModal = true
      this.isLoad = false
      this.imageurl = imgurl
    },
    modelClick: function (event) {
      if (event.target.id === 'myModal') {
        this.isLoad = false
        this.imageurl = ''
      }
    },
    loaded: function (e) {
      this.isLoad = true
    },
    closeModel: function () {
      this.imgModal = false
      this.isLoad = false
      this.imageurl = ''
    },
    created () {
      this.openimage()
    },
    reset: function () {
      this.search_name = ''
      this.search_cat = ''
      this.from_date = ''
      this.to_date = ''
      this.itemOrders = this.items
    },
    createOrder: function () {
      this.$router.push({ name: 'NewOrder' })
    },
    logoutButton: function () {
      var thisI = this
      firebase.auth().signOut().then(function () {
        thisI.$router.push({ name: 'Login' })
        return false
        // Sign-out successful.
      })
    },
    deleteOrder: function (orderId, imagePath, proName, category, amount, orderDate) {
      var thisI = this
      this.showloder = true
      var db = firebase.firestore()
      var username
      firebase.auth().onAuthStateChanged(function (user) {
        username = user.email
      })
      var jobskillquery = db.collection('users').doc(orderId)
      jobskillquery.delete().then(function () {
        const ref = firebase.storage().refFromURL(imagePath)
        ref.getMetadata().then(function (metadata) {
          ref.delete().then(function () {
            var db = firebase.firestore()
            // db.settings({
            //   timestampsInSnapshots: true
            // })
            db.collection('billlogs').add({
              action: 'delete',
              category: category,
              amount: amount,
              order_date: orderDate,
              pro_name: proName,
              username: username,
              deleted_date: new Date()
            })
            thisI.showloder = false
            location.reload()
            console.log('File deleted successfully')
          }).catch(function (error) {
            thisI.showloder = false
            location.reload()
            console.log('File deleted successfully', error)
          })
        })
        console.log('Document successfully deleted!')
      })
    },
    allOrder: function () {
      var db = firebase.firestore()
      var thisI = this
      // db.settings({
      //   timestampsInSnapshots: true
      // })
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          var userAccess = db.collection('user_access').where('user_name', '==', user.email)
          userAccess.get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              if (doc.data().is_admin) {
                thisI.available_cat = thisI.categories.category
                thisI.is_admin = true
              } else {
                thisI.available_cat = doc.data().category_permission
                thisI.is_admin = false
              }
              // User category wise order
              thisI.available_cat.forEach((val) => {
                var docRef = db.collection('users').orderBy('startedAt', 'desc').where('category', '==', val)
                docRef.get().then(function (querySnapshot) {
                  querySnapshot.forEach(function (doc) {
                    thisI.items.push(Object.assign(doc.data(), { 'id': doc.id }))
                    const ref = firebase.storage().refFromURL(doc.data().file)
                    ref.getMetadata().then(function (metadata) {
                      thisI.json_data.push(Object.assign(doc.data(), { 'imagename': metadata.fullPath }))
                      thisI.showloder = false
                    })
                  })
                  thisI.itemOrders = thisI.items
                  thisI.showloder = false
                }).catch(function (error) {
                  console.log('Error getting document:', error)
                })
              })
            })
          })
        } else {
          thisI.$router.push({ name: 'Login' })
        }
      })
    },
    newCategory: function () {
      window.open(this.$router.resolve({ name: 'addnewcategory' }).href, '_blank')
    },
    getFilterItem () {
      if (this.search_cat) {
        this.itemOrders = this.items.filter(m => m.category === this.search_cat)
      } else if (this.from_date && this.to_date) {
        this.itemOrders = this.itemOrders.filter(m => m.order_date >= this.from_date && m.order_date <= this.to_date)
      } else {
        this.itemOrders = this.items
      }
    }
  },
  mounted: function () {
    this.allOrder()
    var db = firebase.firestore()
    var thisI = this
    this.showloder = true
    // db.settings({
    //   timestampsInSnapshots: true
    // })
    var docRef = db.collection('category')
    docRef.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        thisI.categories = doc.data()
        thisI.showloder = false
      })
    }).catch(function (error) {
      console.log('Error getting document:', error)
    })
  }
}
</script>
