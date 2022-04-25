import React from 'react';
import ReactHighcharts from 'react-highcharts';

function PieChart(props) {
  const config = {
    chart: {
      type: 'pie',
    },
    title: {
      text: 'Thông kê mặt số lượng',
    },
    // subtitle: {
    //   text: 'Click the slices to view versions. Source: <a href="http://statcounter.com" target="_blank">statcounter.com</a>',
    // },

    accessibility: {
      announceNewData: {
        enabled: true,
      },
      point: {
        valueSuffix: '%',
      },
    },

    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          format: '{point.name}: {point.y:.1f}%',
        },
      },
    },

    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.data.name}</span><br>',
      pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> của tất cả<br/>',
    },
    series: [
      {
        innerSize: '50%',
        colorByPoint: true,
        data: [
          {
            name: 'Sản phẩm',
            y: 50,
          },
          {
            name: 'Đơn hàng',
            y: 10,
          },
          {
            name: 'Khách hàng',
            y: 120,
          },
        ],
      },
    ],
    series: props.series,
  };

  return <ReactHighcharts config={config} />;
}

export default PieChart;
