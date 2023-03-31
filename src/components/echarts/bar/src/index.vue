<template>
    <div :id="'line_container' + timeId" class="bar_container"></div>
</template>

<script>
import { onMounted, computed } from 'vue'
import * as echarts from 'echarts'
export default {
    name: 'bar',
    setup() {
        onMounted(() => {
            let myChart = echarts.init(document.getElementById('line_container' + timeId))
            // 绘制图表
            myChart.setOption({
                title: { text: "总用户量" },
                tooltip: {},
                xAxis: {
                    data: ["12-3", "12-4", "12-5", "12-6", "12-7", "12-8"],
                },
                yAxis: {},
                series: [
                    {
                        name: "用户量",
                        type: "line",
                        data: [5, 20, 36, 10, 10, 20],
                    },
                ],
            });
            window.onresize = function () {//自适应大小
                myChart.resize();
            };
        })
        const timeId = Date.parse(new Date())
        return {
            timeId
        }
    }
}
</script>

<style lang="scss" scoped>
.bar_container {
    width: 100px;
    height: 100px;
}
</style>