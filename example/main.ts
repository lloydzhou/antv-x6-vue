import { createApp } from 'vue'
import App from './App.vue'
import Graph from '../lib/index'

const app = createApp(App)

// ts模式下会报错vue3支持use直接传递PluginInstallFunction
// app.use(Graph)
app.use(Graph.install)

app.mount('#app')
