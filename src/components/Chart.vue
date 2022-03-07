<script>
import { Line } from 'vue-chartjs'
export default {
  extends: Line,
  props: {
    weaChartData: {
      type: Object,
      default: null,
    },
    options: {
      type: Object,
      default: null,
    }
  },
  watch: {
    weaChartData(val) {
      if(val){
        // this.$data._chart.update();
        this.render();
      }
    }
  },
  methods: {
    render(){
      this.renderChart(this.weaChartData, this.options);
    },
  },
  mounted(){
    this.render();
  }
}
</script>

<style>

</style>