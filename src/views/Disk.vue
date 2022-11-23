<template>
  <el-card class="box-card">
    <el-breadcrumb :separator-icon="ArrowRight" style="line-height: 100%">
      <el-breadcrumb-item>
        <router-link to="/">root</router-link>
      </el-breadcrumb-item>
      <template v-for="item in breadList">
        <el-breadcrumb-item v-if="item.name">
          <router-link :to="'/' + item.realLink">{{item.name}}</router-link>
        </el-breadcrumb-item>
      </template>
    </el-breadcrumb>
  </el-card>

  <el-space border direction="vertical">
    <div></div>
  </el-space>


  <el-table
      :data="data"
      border
      style="height: 79vh"
      table-layout="fixed"
  >
    <el-table-column
        align="center"
        label="Name"
        sortable=""
        prop="name">
      <template #default="scope">
        <router-link v-if="scope.row.type === 'folder'" :to="'/' + scope.row.link">{{scope.row.name}}</router-link>
        <el-link v-else :href="'/public/' + scope.row.link" target="_blank">{{scope.row.name}}</el-link>
      </template>
    </el-table-column>
    <el-table-column align="center" label="Size" sortable="">
      <template #default="scope">
        <div style="display: flex; margin: auto">
          <span style="margin: auto">{{ calcSize(scope.row.size) }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column align="center" label="LastDate" sortable="" prop="last_date"/>
    <el-table-column
        align="center"
        prop="type"
        label="Type"
        column-key="type"
        :filters="ext"
        :filter-method="filterHandler"
    />

    <el-table-column label="Operations" width="120">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="fileDetail(scope)">
          Detail
        </el-button>
        <el-button :disabled='scope.row.type === "folder"' link type="primary" size="small" @click="viewFile(scope)">
          View
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog v-model="dialogVisible" :title="view.name" width="30%">
    <p>文件类型：{{view.type}}</p>
    <p>文件大小：{{getFilesSize(view.size)}}</p>
    <p>最后一次修改日期：{{view.last_date}}</p>
    <p>文件连接：
      <el-link v-if='view.type === "folder"' type="primary" :href="view.link">{{ view.link }}</el-link>
      <el-link v-else :download="view.name" :href="'/public/' + view.link">{{view.link}}</el-link>
    </p>
    <p>
      二维码：
      <vue-qrcode :value="'/public/' + view.link" :options="{ width: 100 }"></vue-qrcode>
    </p>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script lang="ts" setup>
import axios from "axios";
import {onMounted, reactive, ref, watch} from "vue";
import {TableColumnCtx} from "element-plus/es/components/table/src/table-column/defaults";
import {RenderRowData} from "element-plus/es/components/table/src/table/defaults";
import { ArrowRight } from '@element-plus/icons-vue'
import {useRoute, useRouter} from "vue-router";
import VueQrcode from '@chenfengyuan/vue-qrcode';
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UploadProps, UploadUserFile } from 'element-plus'

interface path {
  name: string
  size: string
  last_date: string
  type: string
  link: string
}

interface prePath {
  name: string
  realLink: string
}

const data = reactive<path[]>(
    []
)

const ext = reactive<{ text: string, value: string }[]>(
    []
)

const filterHandler = (
    value: string,
    row: path,
    column: TableColumnCtx<path>
) => {
  const property = column['property']
  console.log(column, row)
  return row.type === value
}

const dialogVisible = ref(false)

const view = ref({

}as path)

const fileDetail = (scope: RenderRowData<path>) => {
  dialogVisible.value = true
  view.value = scope.row
  console.log(view.value.type)
}

const viewFile = (scope: RenderRowData<path>) => {
  if (scope.row.type === 'cpp') {

  }
}

const getFilesSize = (size :string) => {
  if (size === '-') return '-'
  const v = parseInt(size)
  if (v < 1 << 10) return v + "B"
  else if (v < 1 << 20) return Math.ceil(v / (1 << 10)) + "KB"
  else if (v < 1 << 30)  return Math.ceil(v / (1 << 20)) + "MB"
  else return Math.ceil(v / (1 << 30)) + "GB"
}


const breadList = ref<prePath[]>([])



const GetData = (path: string) => {
  const mp: { [key: string]: boolean; } = {};
  path = path.slice(1)
  ext.length = 0
  data.length = 0
  axios.get("/filelist?path=" + path).then(res => {
    for (const file of res.data.data as path[]) {
      if (file.type === "folder") {
        file.size = '-'
        if (!mp["folder"]) {
          ext.push({text: "folder", value: "folder"})
          mp['folder'] = true
        }
      } else {
        const t = file.name.split(".")
        if (!mp[t[1]]) {
          ext.push({
            text: t[1],
            value: t[1]
          })
          mp[t[1]] = true;
        }
      }
      while (file.link.charAt(0) === '/') file.link = file.link.substring(1)
      data.push(file)
    }
  })
}


onMounted(() => {
  GetData(useRoute().path)
})

const route = useRoute()
watch(() => route.path, (n, o) => {
  GetData(route.path)
  const tmp = route.fullPath.split('/')
  let path = ""
  breadList.value.length = 0
  console.log(tmp)
  for (const pre of tmp) {
    if (pre === '') continue
    path += pre + "/"
    breadList.value.push({
      name: pre,
      realLink: path
    }as prePath)
  }
  console.log(breadList)
})

</script>

<style scoped>
.directory {
  width: 100%;
}
.box-card {

}
</style>