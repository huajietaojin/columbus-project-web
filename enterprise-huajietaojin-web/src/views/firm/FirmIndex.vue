<template>
  <div>
    <firm-table :firms="firms" :loading="loading" @action="onAction"></firm-table>

    <div class="pagination-container">
      <el-pagination layout="total, prev, pager, next" :total="total" :page-size="limit" :current-page="page" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import FirmTable from './widget/FirmTable'
import firmService from '@/api/firm-service.js'

export default {
  components: {
    FirmTable
  },
  data() {
    return {
      loading: true,
      firms: [],
      page: 1,
      total: 0,
      limit: 10,
      offset: 0,
      count: true
    }
  },
  methods: {
    onAction(key) {
      const arr = key.split('-')
      const type = arr[0]
      const that = this
      if (type === 'remove') {
        that.$confirm('此操作将永久删除' + arr[2] + ', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            // TODO
          })
          .catch(() => {})
        return
      } else if (type === 'update') {
        this.$router.push({ name: 'FirmUpdate', params: { id: arr[1] }})
        return
      } else if (type === 'detail') {
        this.$router.push({ name: 'FirmDetail', params: { id: arr[1] }})
      } else {
        return
      }
    },
    fetchData() {
      const that = this
      that.offset = (that.page - 1) * that.limit
      if (that.total > 0) {
        that.count = false
      } else {
        that.count = true
      }
      // that.count = that.total > 0 ? false : true
      const params = {
        $count: that.count,
        $limit: that.limit,
        $offset: that.offset
      }
      console.log(params)
      firmService.list(params)
        .then(response => {
          that.firms = response.data.list
          if (that.count) {
            that.total = response.data.total
          }
          that.loading = false
        })
        .catch(err => {
          console.log('list err', err)
          that.loading = false
        })
    },
    handleCurrentChange: function(page) {
      // console.log(`当前页: ${page}`);
      this.page = page
      this.fetchData()
    }
  },
  created() {
    console.log('FirmIndex')
    this.fetchData()
  }
}
</script>
