import React from 'react';
import ReactHighcharts from 'react-highcharts';
import Highcharts from 'highcharts';

function Charts(props) {
  const config = {
    chart: {
      type: 'areaspline',
    },
    title: {
      text: 'Thông kê kết quả doanh thu & phí vận chuyển',
    },
    legend: {
      layout: 'vertical',
      align: 'left',
      verticalAlign: 'top',
      x: 150,
      y: 100,
      floating: true,
      borderWidth: 1,
      backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
    },
    xAxis: {
      categories: props?.categoriesX || ['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'chủ nhật'],
      plotBands: [
        {
          from: 4.5,
          to: 6.5,
          color: 'rgba(68, 170, 213, .2)',
        },
      ],
    },
    yAxis: {
      title: {
        text: 'Dòng tiền (vnđ)',
      },
    },
    tooltip: {
      shared: true,
      valueSuffix: 'vnđ',
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      areaspline: {
        fillOpacity: 0.5,
      },
    },
    series: props.series,
  };

  return <ReactHighcharts config={config} />;
}

Charts.defaultProps = {
  type: 'area',
  series: [
    {
      name: 'Series 1',
      data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175],
    },
    {
      name: 'Series 2',
      data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434],
    },
    {
      name: 'Series 3',
      data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387],
    },
    {
      name: 'Series 4',
      data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227],
    },
    {
      name: 'Series 5',
      data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111],
    },
  ],
};

export default Charts;
