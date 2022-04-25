import React, { useEffect } from 'react';
import { DatePicker } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import dayjs from 'dayjs';
import moment from 'moment';
import { groupBy } from 'lodash';

import { Admin } from 'components/layouts';
import { Charts, PieChart } from 'components/Common';
import { packageActions } from 'actions';
import { selectPackage } from 'selectors';
import { sumMoneyNumber } from 'utils/number';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD HH:mm';
const startDate = dayjs().subtract(7, 'day').startOf().format(dateFormat);
const endDate = dayjs().startOf().format(dateFormat);

function Dashboard(props) {
  const {
    actions: { getTurnover },
    selectListTurnover: { packages, productCount, productCountOld, packageAcceptCount, packageNotAcceptCount, userCount },
  } = props;

  useEffect(() => {
    getTurnover({
      startDate: startDate,
      endDate: endDate,
    });
  }, []);

  function onChange(value, dateString) {
    getTurnover({ startDate: dateString[0], endDate: dateString[1] });
  }

  const turnoverArray = groupBy(packages, item => {
    const updatedAt = dayjs(item.updatedAt);
    return updatedAt?.format('YYYY-MM-DD');
  });

  const keyArray = Object.keys(turnoverArray);

  const valueArray = keyArray.map(key => sumMoneyNumber(turnoverArray[key].map(item => item.value)));

  return (
    <Admin title="Báo cáo - live">
      <RangePicker
        showTime={{ format: 'HH:mm' }}
        onChange={onChange}
        defaultValue={[moment(startDate, dateFormat), moment(endDate, dateFormat)]}
        placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
        format={dateFormat}
      />
      <Charts
        series={[
          { name: 'Doanh thu', data: valueArray.reverse() },
          { name: 'Tiền COD', data: [] },
        ]}
        categoriesX={keyArray.reverse()}
      />
      <PieChart
        series={[
          {
            innerSize: '50%',
            data: [
              {
                name: 'Sản phẩm',
                y: productCount,
              },
              {
                name: 'Sản phẩm tồn kho',
                y: productCountOld,
              },
              {
                name: 'Đơn hàng xác thực thanh toán',
                y: packageAcceptCount,
              },
              {
                name: 'Đơn hàng chưa xác thực thanh toán',
                y: packageNotAcceptCount,
              },
              {
                name: 'Khách hàng',
                y: userCount,
              },
            ],
          },
        ]}
      />
    </Admin>
  );
}
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators({ ...packageActions }, dispatch) });
const mapStateToProps = state => ({ ...selectPackage(state) });

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
