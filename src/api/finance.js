import request from '@/utils/request'

// 在线充值
export const rechargeOnline = (amount, payType = 'alipay') => {
  // 将前端的支付方式映射到后端期望的格式
  const payTypeMap = {
    'alipay': 'alipay',
    'wechat': 'wxpay'
  }
  
  return request({
    url: '',
    method: 'post',
    data: {
      Action: 'RechargeOnline',
      Amount: amount,
      PayType: payTypeMap[payType] || 'alipay'
    }
  })
}

/**
 * 获取充值记录
 * @param {Object} params - 查询参数
 * @param {string} [params.orderNumber] - 订单号筛选
 * @param {string} [params.screenType] - 支付类型筛选 (支付宝/微信)
 * @param {string} [params.startTime] - 开始时间 (格式: 2023-01-01 00:00:00)
 * @param {string} [params.endTime] - 结束时间 (格式: 2023-01-31 23:59:59)
 * @param {number|string} [params.page] - 页码，默认第1页
 * @param {number|string} [params.pageSize] - 每页条数，默认20条
 * @returns {Promise<{
 *   Code: number,
 *   Msg: string,
 *   NowPage: number,
 *   PageSize: number,
 *   RowCount: number,
 *   PageCount: number,
 *   List: Array<{
 *     id: number,
 *     my_order_number: string,
 *     api_order_number: string,
 *     type: string,
 *     amount: string,
 *     time: string
 *   }>
 * }>} 充值记录列表
 */
export const getRechargeRecords = (params = {}) => {
  return request({
    url: '',
    method: 'post',
    data: {
      Action: 'GetPayOrder',
      ScreenOrderNumber: params.orderNumber || '',
      ScreenType: params.screenType || '',
      ScreenStartTime: params.startTime || '',
      ScreenEndTime: params.endTime || '',
      Page: params.page || '',
      PageSize: params.pageSize || ''
    }
  })
}

// 获取账户余额
export const getAccountBalance = () => {
  return request({
    url: '',
    method: 'post',
    data: {
      Action: 'GetAccountBalance'
    }
  })
}

// 检查订单支付状态
export const getPayState = (orderNumber) => {
  return request({
    url: '',
    method: 'post',
    data: {
      Action: 'GetPayState',
      OrderNumber: orderNumber
    }
  })
}

// 获取支持的支付方式
export const getPayOptions = () => {
  return request({
    url: '',
    method: 'post',
    data: {
      Action: 'GetPayOptions'
    }
  })
}

// 获取订单数据
export const getOrderData = (params = {}) => {
  return request({
    url: '',
    method: 'post',
    data: {
      Action: 'GetFinanceOrder',
      Page: params.page || 1,
      PageNumber: params.pageSize || 20,
      ScreenOrderNumber: params.orderNumber || '',
      ScreenType: params.type || '',
      ScreenStartTime: params.startDate ? `${params.startDate} 00:00:00` : '',
      ScreenEndTime: params.endDate ? `${params.endDate} 23:59:59` : ''
    }
  })
}