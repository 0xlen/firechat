import Vue from 'vue'
import VueRouter from 'vue-router'
import VueFire from 'vuefire'
import firebase from 'firebase'
import {config} from './firebaseConfig'

Vue.use(VueRouter)
Vue.use(VueFire)

var routes = [
    { path: '/login', component: require('./components/Login.vue') },
    { path: '/signup', component: require('./components/Signup.vue') },
    { path: '/chat', component: require('./components/Chat.vue') },
    { path: '/profile', component: require('./components/Profile.vue') },
    { path: '/profile/edit', component: require('./components/ProfileEdit.vue') }
]

var router = new VueRouter({ routes })

new Vue({
    router,
    el: '#layout',
    methods: {
        logout () {
            firebase.auth().signOut()
            this.$router.push('/login')
        },
        isLogin() {
            var currentUser = firebase.auth().currentUser;
            return currentUser
        }
    },
    created () {
        firebase.initializeApp(config)
        firebase.auth().onAuthStateChanged((user) => {
            console.log(user)
            if(user) {
                this.$router.push('/profile')
            } else {
                this.$router.push('/login')
            }
        })
    },
})
