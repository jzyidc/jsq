// Token使用示例
// 这个文件展示了如何在登录后自动为所有POST请求添加Token

import { login, getUserInfo } from '@/api/auth'
import request from '@/utils/request'

// 示例1: 登录并获取用户信息
export const loginExample = async () => {
  try {
    // 1. 用户登录
    const loginData = {
      username: 'testuser',
      password: 'password123'
    }
    
    const loginResponse = await login(loginData)
    console.log('登录响应:', loginResponse)
    // 预期响应格式:
    // {
    //   "Code": 1000,
    //   "Token": "75E1ABA6FD6A09C0ED9115B0AF5EB267",
    //   "Msg": "登录成功"
    // }
    
    if (loginResponse.Code === 1000) {
      console.log('登录成功，Token已自动保存到Cookie')
      
      // 2. 获取用户信息（Token会自动添加）
      const userInfoResponse = await getUserInfo()
      console.log('用户信息响应:', userInfoResponse)
      // 实际发送的请求数据会是:
      // {
      //   "Action": "GetUserInfo",
      //   "Token": "75E1ABA6FD6A09C0ED9115B0AF5EB267"
      // }
      // 
      // 预期响应格式:
      // {
      //   "Code": 1000,
      //   "Msg": "获取成功",
      //   "PhoneNumber": "15115641701",
      //   "OfficialQQ": "836813888",
      //   "QQ": "",
      //   "Agent": "直属官方推广",
      //   "Balance": 0.0,
      //   "TotalRechargeAmount": 0.0,
      //   "RegTime": "2025-06-22 20:49:57",
      //   "NodeQty": 0,
      //   "OnlineDeviceQty": 0,
      //   "ExpireQty": 0,
      //   "Ipaddress": "183.9.130.126"
      // }
    }
  } catch (error) {
    console.error('操作失败:', error)
  }
}

// 示例2: 自定义POST请求（Token会自动添加）
export const customPostRequest = async () => {
  try {
    const response = await request({
      url: '',
      method: 'post',
      data: {
        Action: 'CustomAction',
        SomeParam: 'value'
        // Token会由请求拦截器自动添加
      }
    })
    
    // 实际发送的请求数据会是:
    // {
    //   "Action": "CustomAction",
    //   "SomeParam": "value",
    //   "Token": "75E1ABA6FD6A09C0ED9115B0AF5EB267"
    // }
    
    console.log('自定义请求响应:', response)
  } catch (error) {
    console.error('自定义请求失败:', error)
  }
}

// 示例3: 批量操作示例
export const batchOperations = async () => {
  try {
    // 所有这些POST请求都会自动包含Token
    const operations = [
      request({
        url: '',
        method: 'post',
        data: { Action: 'Operation1' }
      }),
      request({
        url: '',
        method: 'post',
        data: { Action: 'Operation2', Param: 'value' }
      }),
      request({
        url: '',
        method: 'post',
        data: { Action: 'Operation3', Data: { key: 'value' } }
      })
    ]
    
    const results = await Promise.all(operations)
    console.log('批量操作结果:', results)
  } catch (error) {
    console.error('批量操作失败:', error)
  }
}

// 注意事项:
// 1. Token会自动从Cookie中获取并添加到所有POST请求的data中
// 2. 如果没有Token（未登录），POST请求不会添加Token字段
// 3. GET请求仍然使用Authorization头部传递Token
// 4. 登录成功后，Token会自动保存到Cookie，有效期7天
// 5. 登出时，Token会从Cookie中移除