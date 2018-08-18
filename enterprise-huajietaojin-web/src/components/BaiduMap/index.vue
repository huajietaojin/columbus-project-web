<template>
  <div class="baidumap">
    <el-row>
      <!--搜索地址-->
      <template v-if="queryable">
        <el-col :span="24" class="input-lable-mini">
          <label>搜索地址</label>
        </el-col>
        <el-col :span="24">
          <el-select v-model="resetToHere" filterable clearable remote placeholder="请输入当前城市检索关键词" :remote-method="searchPlaceByKeyword" class="input-select">
            <el-option v-for="item in placeOptions" :key="item.uid" :label="item.address + ', ' + item.title" :value="item.point.lng + '-' + item.point.lat"></el-option>
          </el-select>
        </el-col>
      </template>
      <!--地图实例-->
      <el-col :span="24">
        <div :id="mapId" :style="style"></div>
      </el-col>
      <!--点击地址-->
      <template v-if="tipable">
        <el-col :span="24" class="input-lable-mini">
          <label>详细地址</label>
        </el-col>
        <el-col :span="24">
          <el-input placeholder="详细地址" v-model="showAddress" :disabled="true"></el-input>
        </el-col>
      </template>

    </el-row>
  </div>
</template>

<script>
/**
* 6个属性，一个抛出事件
*/
const FOCUS = { longitude: 119.303451, latitude: 26.088526 }
export default {
  props: {
    height: {
      type: Number,
      default: 400
    },
    queryable: {
      type: Boolean,
      default: false
    },
    clickable: {
      type: Boolean,
      default: false
    },
    tipable: {
      type: Boolean,
      default: false
    },
    center: {
      type: Object,
      default: function() {
        return FOCUS
      }
    }
  },
  data() {
    const mapId = 'baidumap' + new Date().getTime()
    return {
      style: {
        width: '100%',
        height: this.height + 'px'
      },
      mapId: mapId,
      mapInstance: null,
      showAddress: null,
      resetToHere: null,
      placeOptions: [],
      loading: false,
      searchHandler: null,
      blueIcon: null,
      tempClickMarker: null
    }
  },
  watch: {
    resetToHere: function(newValue) {
      if (newValue === null || newValue === '') {
        return
      }
      const ptVal = newValue.split('-')
      const point = new BMap.Point(ptVal[0], ptVal[1])
      this.markerAnimateShow(point, 4000)
    }
  },
  methods: {
    postEvent: function(e) {
      // 发送点击事件
      console.log('postEvent')
      if (this.tempClickMarker !== null) {
        this.mapInstance.removeOverlay(this.tempClickMarker);
      }
      if (this.clickable === false) {
        return
      }
      const location = {}
      location.longitude = e.point.lng
      location.latitude = e.point.lat
      const pt = e.point
      this.tempClickMarker = new BMap.Marker(pt)
      this.mapInstance.addOverlay(this.tempClickMarker)
      const that = this
      this.mapGeocoder.getLocation(pt, function(rs) {
        // console.log(rs);
        const addComp = rs.addressComponents
        location.address = rs.address
        location.province = addComp.province
        location.city = addComp.city
        location.district = addComp.district
        location.street = addComp.street
        location.streetNumber = addComp.streetNumber
        that.showAddress = location.address + ', 坐标[' + location.longitude + ', ' + location.latitude + ']'
        that.$emit('mapclick', location)
      });
    },
    searchPlaceByKeyword: function(query) {
      // 搜索下拉框定位
      if (query !== '') {
        this.loding = true
        // console.log('searchPlaceByKeyword:query:' + query)
        this.searchHandler.search(query)
      } else {
        this.placeOptions = []
      }
    },
    markerAnimateShow: function(bdpoint, mills) {
      const cpmarker = new BMap.Marker(bdpoint, { icon: this.blueIcon })// 创建标注
      this.mapInstance.addOverlay(cpmarker)// 将标注添加到地图中
      this.mapInstance.centerAndZoom(bdpoint, 17)
      cpmarker.setAnimation(BMAP_ANIMATION_BOUNCE)// 跳动的动画
      setTimeout(() => {
        this.mapInstance.removeOverlay(cpmarker)
      }, mills)
    },
    focusCenter: function(centerPoint) {
      // 定位中间位置
      if (this.mapInstance === null) {
        return
      }
      if (centerPoint) {
        this.mapInstance.centerAndZoom(centerPoint, 17)
      }
    }

  },
  created() {
    this.blueIcon = new BMap.Icon('http://api.map.baidu.com/img/markers.png',
      new BMap.Size(23, 25), {
        anchor: new BMap.Size(10, 20), // 指定定位位置
        imageOffset: new BMap.Size(0, 0 - 10 * 25) // 设置图片偏移
      });
    this.mapGeocoder = new BMap.Geocoder();
  },
  mounted() {
    const that = this
    console.log('baidumap mounted, id:' + this.mapId)
    const map = new BMap.Map(that.mapId, { enableMapClick: false })
    if (this.center) {
      this.center = FOCUS
    }
    map.centerAndZoom(new BMap.Point(this.center.longitude, this.center.latitude), 16)
    that.mapInstance = map
    // let marker = new BMap.Marker(initPoint);  // 创建标注
    // map.addOverlay(marker);               // 将标注添加到地图中
    // marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
    const top_right_navigation = new BMap.NavigationControl({
      // anchor: BMAP_ANCHOR_TOP_RIGHT,
      type: BMAP_NAVIGATION_CONTROL_ZOOM
    }) // 右上角，仅包含缩放按钮
    map.addControl(top_right_navigation)

    const options = {
      onSearchComplete: function(results) {
        // 判断状态是否正确
        if (searchHandler.getStatus() === BMAP_STATUS_SUCCESS) {
          const list = []
          for (let i = 0; i < results.getCurrentNumPois(); i++) {
            if (!results.getPoi(i).city) {
              continue
            }
            // console.log(results.getPoi(i))
            list.push(results.getPoi(i))
          }
          that.placeOptions = list
        }
        that.loding = false
      }
    }
    const searchHandler = new BMap.LocalSearch(map, options)
    // searchHandler.search("公园");
    that.searchHandler = searchHandler

    // 点击事件
    const postEvent = that.postEvent
    map.addEventListener('click', postEvent)
  }
}
</script>

<style scoped>
.baidumap {
  width: '100%';
}

.input-lable-mini {
  color: #afafaf;
  font-size: 12px;
  margin-bottom: 4px;
}

.input-select {
  width: 100%;
}
</style>
