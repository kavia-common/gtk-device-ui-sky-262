page_tag='status_throughput'
let lastTraffic = {
  "2.4GHz": 0,
  "5GHz": 0,
  "6GHz": 0,
  time: 0,
};
var combinedChart = createCombinedChart();
$(document).ready(function(){
    $.lang_load("status_throughput");
    page_initial();
});


function createCombinedChart() {
    var svg = d3.select("#combinedChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var xScale = d3.scale.linear().range([0, width]);
    var yScale = d3.scale.linear().range([height, 0]);

    var lines = {
        "2.4GHz": d3.svg.line()
            .x(d => xScale(d.relativeTime))
            .y(d => yScale(d["2.4GHz"])),
        "5GHz": d3.svg.line()
            .x(d => xScale(d.relativeTime))
            .y(d => yScale(d["5GHz"])),
        "6GHz": d3.svg.line()
            .x(d => xScale(d.relativeTime))
            .y(d => yScale(d["6GHz"]))
    };

    var areas = {
        "2.4GHz": d3.svg.area()
            .x(d => xScale(d.relativeTime))
            .y0(height)
            .y1(d => yScale(d["2.4GHz"])),
        "5GHz": d3.svg.area()
            .x(d => xScale(d.relativeTime))
            .y0(height)
            .y1(d => yScale(d["5GHz"])),
        "6GHz": d3.svg.area()
            .x(d => xScale(d.relativeTime))
            .y0(height)
            .y1(d => yScale(d["6GHz"]))
    };

    var colors = {
        "2.4GHz": "blue",
        "5GHz": "red",
        "6GHz": "green"
    };

    var paths = {};
    var fillPaths = {};
    
    Object.keys(colors).forEach(freq => {
        fillPaths[freq] = svg.append("path")
            .datum([])
            .attr("fill", colors[freq])
            .attr("opacity", 0.1)
            .attr("class", "area-path");

        paths[freq] = svg.append("path")
            .datum([])
            .attr("fill", "none")
            .attr("stroke", colors[freq])
            .attr("stroke-width", 2)
            .attr("class", "line-path");
    });

    // 添加X軸
    var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
    var xAxisGroup = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x-axis")
        .call(xAxis);

    // 添加Y軸
    var yAxis = d3.svg.axis().scale(yScale).orient("left");
    var yAxisGroup = svg.append("g")
        .attr("class", "y-axis")
        .call(yAxis);

    // 添加Y軸標籤
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Throughput");

    // 添加標題
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .text("WiFi Throughput");

    // 添加圖例
    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width + 10}, 0)`);

    Object.keys(colors).forEach((freq, i) => {
        var legendItem = legend.append("g")
            .attr("transform", `translate(0, ${i * 25})`);

        legendItem.append("rect")
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", colors[freq]);

        legendItem.append("text")
            .attr("x", 25)
            .attr("y", 12)
            .text(freq);
    });

    return {
        paths,
        fillPaths,
        xScale,
        yScale,
        xAxis,
        yAxis,
        xAxisGroup,
        yAxisGroup,
        lines,
        areas
    };
}

function updateChart() {
    if (currentIndex < data.length) {
        var start = Math.max(0, currentIndex - windowSize + 1);
        var currentData = data.slice(start, currentIndex + 1);

        // 更新 X 軸範圍
        var xExtent = [
            currentData[0].relativeTime, 
            currentData[currentData.length - 1].relativeTime
          ];
          combinedChart.xScale.domain(xExtent);


          var yMax = d3.max(currentData, d =>
            Math.max(d["2.4GHz"], d["5GHz"], d["6GHz"])
          );
          if (yMax === 0 || isNaN(yMax)) {
            yMax = 1; // 確保 Y 軸的最大值不為異常數值
          }
          yMax = yMax * 1.1;
        combinedChart.yScale.domain([0, yMax]);


        Object.keys(combinedChart.paths).forEach(freq => {
            combinedChart.paths[freq].datum(currentData).attr("d", combinedChart.lines[freq]);
            combinedChart.fillPaths[freq].datum(currentData).attr("d", combinedChart.areas[freq]);
        });

        // 更新 X 軸
        combinedChart.xAxis.ticks(10)
            .tickFormat(d => {
                var minutes = Math.floor(d / 60);
                var seconds = Math.floor(d % 60);
                return minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);
            });
        combinedChart.xAxisGroup.call(combinedChart.xAxis);
        combinedChart.yAxisGroup.call(combinedChart.yAxis);
        currentIndex++;
        setTimeout(updateChart, interval);
    }
}

function _prepare_layout(obj) {
    const totalTraffic = {
        "2.4GHz": 0,
        "5GHz": 0,
        "6GHz": 0,
    };

    const currentTime = new Date().getTime() / 1000;
    if (!obj || !Array.isArray(obj.WlanThroughput) || obj.WlanThroughput.length === 0) {
        return ;
    }
    
    obj.WlanThroughput.forEach((entry) => {
        const { TxBytes, RxBytes, Interface } = entry;
        const traffic = TxBytes + RxBytes;

        if (Interface?.startsWith("ath0")) {
            totalTraffic["2.4GHz"] += traffic;
        } else if (Interface?.startsWith("ath1")) {
            totalTraffic["5GHz"] += traffic;
        } else if (Interface?.startsWith("ath2")) {
            totalTraffic["6GHz"] += traffic;
        }
    });

    const isAnomaly = (band) =>
        totalTraffic[band] < lastTraffic[band] || totalTraffic[band] < 0;

    if (isAnomaly("2.4GHz") || isAnomaly("5GHz") || isAnomaly("6GHz")) {
        return {
          "2.4GHz": 0,
          "5GHz": 0,
          "6GHz": 0,
          time: 0,
        };
      }

    // const isNoChangeButNotZero = (band) => 
    //     (totalTraffic[band] - lastTraffic[band] === 0) && 
    //     (totalTraffic[band] !== 0 && lastTraffic[band] !== 0);
    
    // if (isNoChangeButNotZero("2.4GHz") || isNoChangeButNotZero("5GHz") || isNoChangeButNotZero("6GHz")) {
    //     return lastTraffic;
    // }
    const throughput = {
        "2.4GHz": (totalTraffic["2.4GHz"] - lastTraffic["2.4GHz"]) *BYTES_TO_MBITS ,  
        "5GHz": (totalTraffic["5GHz"] - lastTraffic["5GHz"]) * BYTES_TO_MBITS,  
        "6GHz": (totalTraffic["6GHz"] - lastTraffic["6GHz"]) *BYTES_TO_MBITS ,  
    };

    console.log(throughput);
    lastTraffic = { ...totalTraffic, time: currentTime };
    if (data.length === 0) {
        console.log("data.length");
        return { "2.4GHz": 0,"5GHz": 0,"6GHz": 0,};
       }
    
    return throughput;
}


function calculateMedian(values) {
    if (values.length === 0) return 0;
    values.sort((a, b) => a - b);
    const mid = Math.floor(values.length / 2);
    return values.length % 2 !== 0 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
}


function set_ui_init(obj) {
    const traffic = _prepare_layout(obj);

    if (!traffic) {
        return;
    }

    trafficList.push(traffic);
    if (trafficList.length > 7) {
        trafficList.shift(); 
    }

    // 计算中位数
    const medianTraffic = {
        "2.4GHz": calculateMedian(trafficList.map(t => t["2.4GHz"])),
        "5GHz": calculateMedian(trafficList.map(t => t["5GHz"])),
        "6GHz": calculateMedian(trafficList.map(t => t["6GHz"])),
    };

    const totalMedianThroughput = 
    medianTraffic["2.4GHz"] + medianTraffic["5GHz"] + medianTraffic["6GHz"];

    const totalThroughputElement = document.getElementById("totalThroughput");
    if (totalThroughputElement) {
        totalThroughputElement.textContent = `Total WiFi Throughput: ${totalMedianThroughput.toFixed(2)} Mbps`;
    }



    const currentTime = new Date().getTime() / 1000;

    if (startTime === null) startTime = currentTime;

    const relativeTime = currentTime - startTime;

    data.push({
        time: currentTime,
        relativeTime: relativeTime,
        "2.4GHz": medianTraffic["2.4GHz"],
        "5GHz": medianTraffic["5GHz"],
        "6GHz": medianTraffic["6GHz"]
    });

    updateChart();
}
    
    function get_info_success_cb(obj) {
    INFO_DATA = API.obj.copy(obj);
    set_ui_init(INFO_DATA.Throughput);
    loading_control(0);
    }
    
    function get_info_error_cb(obj) {
    loading_control(0);
    if(obj.api_return == 403) {
    logout('sto');
    }
    }
    
    function get_info_data(info_list){
    API.info.get(info_list, get_info_success_cb, get_info_error_cb);
    }
    
    
    function checkAndFetch() {
        // 檢查是否在正確的頁面
        if (page_tag !== 'status_throughput') {
            cleanupResources();
            return;
        }
            get_info_data(INFO_LIST);
            // 設置下一次獲取
            fetchingTimeout = setTimeout(checkAndFetch, interval);
    }
    
    
    
    
    function startDataFetching() {
        // 確保開始前清除可能存在的 timeout
        if (fetchingTimeout) {
            clearTimeout(fetchingTimeout);
        }
        checkAndFetch();
    }
    
    function cleanupResources() {
        // 清除 timeout
        if (fetchingTimeout) {
            clearTimeout(fetchingTimeout);
            fetchingTimeout = null;
        }
        
        data = [];
        currentIndex = 0;
        startTime = null;
    }
    
    window.addEventListener('unload', cleanupResources);
    function page_initial(){
    loading_control(1);
    data = [];
    currentIndex = 0;
    startTime = null;
    startDataFetching();
    }