<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div class="card card-signin my-5" style="border: 1px solid rgba(0, 0, 0, 0.125);">
            <div class="card-body">
              <h1 class="card-title text-center"><b>Sign In</b></h1>
              <!-- <form class="form-signin"> -->
                <div class="form-label-group">
                  <label for="inputEmail">Email address</label>
                  <input type="email" id="inputEmail" @keyup.enter="loginButton" v-model="email" class="form-control" placeholder="Email address" required autofocus>
                </div><br>
                <div class="form-label-group">
                  <label for="inputPassword">Password</label>
                  <input type="password" @keyup.enter="loginButton" v-model='password' id="inputPassword" class="form-control" placeholder="Password" required>
                </div><br><br>
                <button class="btn btn-lg btn-primary btn-block text-uppercase" @click="loginButton">Sign in</button>
                <br>
                <div v-if="login_alert" class="alert alert-danger" role="alert">{{login_alert}}</div>
              <!-- </form> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import firebase from 'firebase'
export default {
  name: 'Login',
  data () {
    return {
      email: '',
      password: '',
      showloder: false,
      loginlable: true,
      username: true,
      pass: true,
      login_alert: ''
    }
  },
  methods: {
    loginButton: function () {
      this.showloder = true
      this.loginlable = false
      var thisI = this
      if (navigator.onLine) {
        firebase.auth().onAuthStateChanged(function (user) {
          if (user) {
            thisI.$router.push({ name: 'Order List' })
            location.reload()
          }
        })
        firebase.auth().signInWithEmailAndPassword(this.email, this.password).catch(function (error) {
          var errorCode = error.code
          var errorMessage = error.message
          if (errorCode || errorMessage) {
            thisI.login_alert = 'Invalid email and password.'
            // alert('Invalid email and password.')
            thisI.showloder = false
            thisI.loginlable = true
            return false
          }
        })
      } else {
        this.login_alert = 'please check your network connection.'
        // alert('please check your network connection.')
        this.showloder = false
        this.loginlable = true
      }
    }
  },
  mounted: function () {
    var self = this
    this.login_alert = ''
    if (navigator.onLine) {
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          self.$router.push({ name: 'Order List' })
          return false
        } else {
          self.$router.push({ name: 'Login' })
        }
      })
    } else {
      alert('please check your network connection.')
    }
  }
}
</script>

<style>
.loader {
  margin-top: 23%;
  margin-left: 46%;
  border: 9px dotted rgb(255, 255, 255);
  border-radius: 95%;
  border-top: 9px dotted rgb(255, 255, 255);
  border-right: 9px dotted rgb(255, 255, 255);
  border-bottom: 9px dotted rgb(255, 255, 255);
  width: 90px;
  height: 91px;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
}
#overlay {
  position: fixed;
  display: block;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  z-index: 2;
}
.focus-input100 {

    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
  }
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
