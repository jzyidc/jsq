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

/**
 * 获取代理用户列表
 * @param {Object} params - 查询参数
 * @param {string} [params.screenPhone] - 筛选用户手机号码
 * @param {string} [params.screenReferrerPhone] - 筛选推荐人手机号码
 * @param {string} [params.screenStartTime] - 筛选注册时间范围开始时间
 * @param {string} [params.screenEndTime] - 筛选注册时间范围结束时间
 * @param {number|string} [params.page] - 页码，默认第1页
 * @param {number|string} [params.pageSize] - 每页条数，默认20条
 * @returns {Promise} 代理用户列表
 */
export const getMyUser = (params = {}) => {
  return request({
    url: '',
    method: 'post',
    data: {
      Action: 'GetMyUser',
      ScreenPhone: params.screenPhone || '',
      ScreenReferrerPhone: params.screenReferrerPhone || '',
      ScreenStartTime: params.screenStartTime || '',
      ScreenEndTime: params.screenEndTime || '',
      Page: params.page || 1,
      PageSize: params.pageSize || 20
    }
  })
}

/**
 * 获取当前提现账户
 * @returns {Promise<{
 *   code: number,
 *   msg: string,
 *   real_name?: string,
 *   faceid_Idcard?: string,
 *   settlement_account_bank?: string,
 *   settlement_account_number?: string
 * }>} 当前提现账户信息
 */
export const getSettlementAccount = () => {
  return request({
    url: '',
    method: 'post',
    data: {
      Action: 'GetSettlementAccount'
    }
  })
}

/**
 * 设置提现账户
 * @param {Object} params - 设置参数
 * @param {string} params.Action - 操作类型，固定为 "SetSettlementAccount"
 * @param {string} params.SettlementBank - 提现银行，固定为 "支付宝"
 * @param {string} params.SettlementAccount - 提现账户（支付宝账号）
 * @returns {Promise<{Code: number, Msg: string}>} 设置结果
 */
export const setSettlementAccount = (params) => {
  return request({
    url: '',
    method: 'post',
    data: {
      Action: params.Action,
      SettlementBank: params.SettlementBank,
      SettlementAccount: params.SettlementAccount
    }
  })
}

/**
 * 设置用户折扣
 * @param {string} phone - 用户手机号码
 * @param {string} discount - 折扣值，0.1 - 1.0范围内
 * @returns {Promise<{Code: number, Msg: string}>} 设置结果
 */
export const setUserDiscount = (phone, discount) => {
  return request({
    url: '',
    method: 'post',
    data: {
      Action: 'SetUserDiscount',
      Phone: phone,
      Discount: discount
    }
  })
}

/**
 * 获取佣金订单数据（订单结算）
 * @param {Object} params - 查询参数
 * @param {number|string} [params.page] - 页码，默认第1页
 * @param {number|string} [params.pageSize] - 每页条数，默认20条
 * @returns {Promise<{
 *   Code: number,
 *   Msg: string,
 *   query_total_amount: number,
 *   total_commission_amount: number,
 *   settled_amount: number,
 *   confirming_amount: number,
 *   unsettled_amount: number,
 *   current_month_amount: number,
 *   NowPage: number,
 *   PageSize: number,
 *   RowCount: number,
 *   PageCount: number,
 *   List: Array<{
 *     id: string,
 *     user_phone: string,
 *     type: string,
 *     consume_amount: string,
 *     commission_amount: number,
 *     commission_balance: string,
 *     discount: string,
 *     linked_order_consume: string,
 *     linked_order_settlement: string,
 *     status: string,
 *     time: string
 *   }>
 * }>} 佣金订单数据
 */
export const getCommissionOrder = (params = {}) => {
  return request({
    url: '',
    method: 'post',
    data: {
      Action: 'GetCommissionOrder',
      Page: params.page || 1,
      PageSize: params.pageSize || 20
    }
  })
}

// 提交结算
export const submitSettlement = () => {
  return request({
    url: '',
    method: 'post',
    data: {
      Action: 'SubmitSettlement'
    }
  })
}

/**
 * 获取提现订单数据
 * @param {Object} params - 查询参数
 * @param {number|string} [params.page] - 页码，默认第1页
 * @param {number|string} [params.pageSize] - 每页条数，默认20条
 * @returns {Promise<{
 *   Code: number,
 *   Msg: string,
 *   query_total_amount: number,
 *   NowPage: number,
 *   PageSize: number,
 *   RowCount: number,
 *   PageCount: number,
 *   List: Array<{
 *     id: string,
 *     amount: number,
 *     account_bank: string,
 *     account_number: string,
 *     order_submit: string,
 *     order_complete: string,
 *     time_submit: string,
 *     time_complete: string,
 *     status: string
 *   }>
 * }>} 提现订单数据
 */
export const getSettlementOrder = (params = {}) => {
  return request({
    url: '',
    method: 'post',
    data: {
      Action: 'GetSettlementOrder',
      Page: params.page || 1,
      PageSize: params.pageSize || 20
    }
  })
}