import { createApp } from 'vue'
import App from './App.vue'
import Dag from './Dag.vue'
import Graph from '../src/index'

const app = createApp(Dag)
// const app = createApp(App)

// ts模式下会报错vue3支持use直接传递PluginInstallFunction
// app.use(Graph)
app.use(Graph.install)

app.mount('#app')
