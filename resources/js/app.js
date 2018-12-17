
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

//importing vue Router globally for webroute
import VueRouter from 'vue-router'
Vue.use(VueRouter)

//adding vue component
let routes = [
    { path: '/admin', component: require('./components/Admin.vue').default },
    { path: '/audience', component: require('./components/Audience.vue').default },
    { path: '/createquiz', component: require('./components/Createquiz.vue').default },
    { path: '/resultquiz', component: require('./components/Resultquiz.vue').default }
]

//route any path in web with history in laravel
const router = new VueRouter({
    mode: 'history',
    routes
})


/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.component('example-component', require('./components/ExampleComponent.vue'));

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: '#app',
    router
});
