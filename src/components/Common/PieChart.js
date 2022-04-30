import React from 'react';
import ReactHighcharts from 'react-highcharts';

function PieChart(props) {
  const config = {
    chart: {
      type: 'column'
  },
  title: {
      align: 'left',
      text: 'Thống kê phần trăm sản sản phẩm/khách hàng đăng ký tài khoản'
  },
  // subtitle: {
  //     align: 'left',
  //     text: 'Click the columns to view versions. Source: <a href="http://statcounter.com" target="_blank">statcounter.com</a>'
  // },
  accessibility: {
      announceNewData: {
          enabled: true
      }
  },
  xAxis: {
      type: 'category'
  },
  yAxis: {
      title: {
          text: 'Total percent market share'
      }

  },
  legend: {
      enabled: false
  },
  plotOptions: {
      series: {
          borderWidth: 0,
          dataLabels: {
              enabled: true,
              format: '{point.y:.1f}%'
          }
      }
  },

  tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
  },

  series: [
      {
          name: "Browsers",
          colorByPoint: true,
          data: [
              {
                  name: "Chrome",
                  y: 62.74,
                  drilldown: "Chrome"
              },
              {
                  name: "Firefox",
                  y: 10.57,
                  drilldown: "Firefox"
              },
              {
                  name: "Internet Explorer",
                  y: 7.23,
                  drilldown: "Internet Explorer"
              },
              {
                  name: "Safari",
                  y: 5.58,
                  drilldown: "Safari"
              },
              {
                  name: "Edge",
                  y: 4.02,
                  drilldown: "Edge"
              },
              {
                  name: "Opera",
                  y: 1.92,
                  drilldown: "Opera"
              },
              {
                  name: "Other",
                  y: 7.62,
                  drilldown: null
              }
          ]
      }
  ],
  series:props.series
  
  };

  return <ReactHighcharts config={config} />;
}

export default PieChart;
