import {createApp} from 'vue';
import Antd from 'ant-design-vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'ant-design-vue/dist/antd.css';

import * as Icons from '@ant-design/icons-vue';
import axios from "axios";


const app = createApp(App);
app.use(store)
    .use(router)
    .use(Antd)
    .mount('#app');

/*全局图标使用*/
/*const icons: any = Icons;
for (const iconsKey in icons) {
    app.component(iconsKey, icons[iconsKey]);
}*/

axios.defaults.baseURL = process.env.VUE_APP_SERVER
axios.interceptors.response.use(response => {
    console.log("响应结果:", response);
    return response.data;
}, error => {
    return Promise.reject(error);
})
axios.interceptors.request.use(request => {
    console.log("请求信息:", request);
    return request;
}, error => {
    return Promise.reject(error)
})

console.log('环境：' + process.env.NODE_ENV);
console.log('服务端：' + process.env.VUE_APP_SERVER)