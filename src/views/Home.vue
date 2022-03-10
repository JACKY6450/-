<template>
  <div class="home">
    <div class="container mt-4">
      <div class="edit d-flex justify-content-center mb-3">
        <select class="p-1 mr-2" v-model="currentStation">
          <option value="">---請選擇觀測站---</option>
          <option 
            v-for="item in station" :key="item"
            :value="item"
          >
            {{ item }}
          </option>
        </select>
        <select class="p-1 mr-2" v-model="currentStatics">
          <option value="">---選擇要呈現的數據---</option>
          <option 
            v-for="item in statisticsType" :key="item.name"
            :value="item.value"
          >
            {{ item.name }}
          </option>
        </select>
        <button class="btn btn-primary px-4" @click="updateData()">查詢</button>
      </div>
      
      <div class="row justify-content-center">
        <div v-if="dataUpdate" class="col-lg-10" style="overflow-x: scroll;">
          <table class="table text-center text-nowrap">
            <thead>
              <tr class="table-primary">
                <th>一月</th>
                <th>二月</th>
                <th>三月</th>
                <th>四月</th>
                <th>五月</th>
                <th>六月</th>
                <th>七月</th>
                <th>八月</th>
                <th>九月</th>
                <th>十月</th>
                <th>十一月</th>
                <th>十二月</th>
                <th>單位</th>
                <th>對應曲線</th>
                <th>統計期間</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                :class="(index+1) % 2 === 1 ? 'table-secondary' : 'table-info'" 
                v-for="(item, index) in tableStatistic" :key="index"
              >
                <td 
                  v-for="(item, index1) in tableStatistic[index]" 
                  :key="index1">
                  {{ item }}
                </td>
                <td>
                  {{ dataFrom }} ~ {{ dataTo }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col-lg-8 mt-3">
          <Chart id="chart" v-if="weaChartData" :weaChartData="weaChartData" :options="options"/>
        </div>
      </div>
    </div>
    <footer class="text-center bg-primary text-white py-4 mt-4">
      <div>中央氣象局月平均地面觀測站資料</div>
      <div>資料來源：中央氣象局/氣象資料開放平台</div>
    </footer>
  </div>
</template>

<script>
// @ is an alias to /src
import Chart from '@/components/Chart.vue'

export default {
  name: 'Home',
  components: {
    Chart
  },
  data(){
    return{
      data: {},
      station: [],
      statisticsType: [],
      tableStatistic:[],
      currentStation: '',
      currentStatics: '',
      dataFrom: '',
      dataTo: '',
      nameChinese: [
        {name: '氣壓', unit: '百帕'},
        {name: '氣溫', unit: '度C'},
        {name: '相對濕度', unit: '%'},
        {name: '雲量', unit: '十分量'},
        {name: '日照時數', unit: '小時'},
        {name: '降水量', unit: '毫米'},
        {name: '風速', unit: '公尺/秒'}
      ],
      dataUpdate: false,
      weaChartData: {
        labels: [
          '1月',
          '2月',
          '3月',
          '4月',
          '5月',
          '6月',
          '7月',
          '8月',
          '9月',
          '10月',
          '11月',
          '12月',
        ],
        datasets: [],
      },
      options: {
        responsive: true,
        maintainAspectRation: false,
        tilte: {
          display: true,
          text: 'My Data',
        }
      }
    }
  },
  methods: {
    updateData(){
      // let weaChartData = {...this.weaChartData};
      // weaChartData.datasets[0] = {
      //   label: 'Data Update',
      //   data: [61, 21, 32, 53, 4, 64, 35, 16, 76, 27],
      //   backgroundColor: 'transparent',
      //   borderWidth: 2,
      //   borderColor: '#ff3333',
      //   pointBackgroundColor: '#ff3333'
      // }
      // this.weaChartData = {...weaChartData};
      if(this.currentStation === '' || this.currentStatics=== '') return;
      if(!this.dataUpdate) this.dataUpdate = true;
      this.render();
    },
    render(){
      let data = this.data;
      data.surfaceObs.location.forEach((item) => {
        if(item.station.stationName === this.currentStation){
          let statistics = item.stationObsStatistics;
          Object.keys(statistics).forEach((key) => {
            if(key === this.currentStatics){
              if(key === 'temperature'){
                console.log(key);
                let weaChartData = {...this.weaChartData};
                let tableStatistic = [];
                this.dataFrom = statistics[key].startYear;
                this.dataTo = statistics[key].endYear;
                weaChartData.datasets.splice(0, weaChartData.datasets.length);
                for(let i=0; i<3; i++){
                  let datasetsData = [];
                  statistics[key].monthly.forEach((item1) => {
                    if(i===0){
                      datasetsData.push(item1.mean);
                    }
                    else 
                    if(i===1){
                      datasetsData.push(item1.maximum);
                    }
                    else
                    if(i===2){
                      datasetsData.push(item1.minimum);
                    }
                  })
                  this.statisticsType.forEach((item1) => {
                    if(item1.value === this.currentStatics){
                      datasetsData.push(item1.unit);
                    }
                  })
                  tableStatistic.push([...datasetsData]);
                  weaChartData.datasets.push({
                    label: i===0 ? 'mean' : i===1 ? 'maximum' : i===2 ? 'minimum' : '',
                    data: [...datasetsData],
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderColor: i===0 ? '#00ffff' : i===1 ? '#ff3333' : i===2 ? '#00aa55' : '',
                    pointBackgroundColor: i===0 ? '#00ffff' : i===1 ? '#ff3333' : i===2 ? '#00aa55' : ''
                  })
                  // console.log('123', weaChartData.datasets);
                  this.tableStatistic = [...tableStatistic];
                  this.weaChartData = {...weaChartData}; 
                }
              }
              else {
                this.dataFrom = statistics[key].startYear;
                this.dataTo = statistics[key].endYear;
                let tableStatistic = [];
                let datasetsData = [];
                statistics[key].monthly.forEach((item1) => {
                  if(key === 'sunshineDuration'){
                    datasetsData.push(item1.total);  
                  }
                  else
                  if(key === 'precipitation'){
                    datasetsData.push(item1.accumulation);
                  }
                  else{
                    datasetsData.push(item1.mean);
                  }
                })
                this.statisticsType.forEach((item1) => {
                  if(item1.value === this.currentStatics){
                    datasetsData.push(item1.unit);
                  }
                })
                tableStatistic.push([...datasetsData]);  
                let weaChartData = {...this.weaChartData};
                weaChartData.datasets.splice(0, weaChartData.datasets.length);
                weaChartData.datasets.push({
                  label: key === 'sunshineDuration' ? 'total' : key === 'precipitation' ? 'accumulation' : 'mean',
                  data: [...datasetsData],
                  backgroundColor: 'transparent',
                  borderWidth: 2,
                  borderColor: key === 'sunshineDuration' ? '	#eeee00' : key === 'precipitation' ? '#0000ff' : '#00ffff',
                  pointBackgroundColor: key === 'sunshineDuration' ? '	#eeee00' : key === 'precipitation' ? '#0000ff' : '#00ffff'
                })
                // console.log('123', weaChartData.datasets);
                this.tableStatistic = [...tableStatistic];
                this.weaChartData = {...weaChartData};
              }
            }
          })
        }
      })
      this.curveMark();
    },
    curveMark(){
      let tableStatistic = [...this.tableStatistic];
      if(this.currentStatics === 'temperature'){
        const curveState = ['mean', 'maximum', 'minimum'];
        tableStatistic.forEach((item, index) => {
          tableStatistic[index].push(curveState[index]);
        })
      }
      else{
        if(this.currentStatics === 'sunshineDuration'){
          tableStatistic[0].push('total');
        }
        else 
        if(this.currentStatics === 'precipitation'){
          tableStatistic[0].push('accumulation');
        }
        else{
          tableStatistic[0].push('mean');
        }
      }
      // console.log('table', tableStatistic);
      this.tableStatistic = tableStatistic;
    }
  },
  created(){
    const apiUrl = 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/C-B0027-001?Authorization=CWB-A92D3352-36AC-4D14-9877-3D706D2CA3AC';
    this.$http.get(apiUrl).then((response) => {
      const data = response.data.records.data;
      data.surfaceObs.location.forEach((item) => {
        this.station.push(item.station.stationName);
      })
      const statistics = data.surfaceObs.location[0].stationObsStatistics;
      let statisticsName = [];
      Object.keys(statistics).forEach((key) => {
        statisticsName.push(key);  
      })
      let statisticsType = []
      statisticsName.forEach((item, index) => {
        statisticsType.push({
          value: item,
          ...this.nameChinese[index],
        })
      })
      console.log('sta', statisticsType);
      this.statisticsType = [...statisticsType];
      this.data = data;
    })
  },
}
</script>
<style scoped>
</style>