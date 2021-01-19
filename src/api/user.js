/*
用户信息相关模块
*/

import request from '@/utils/request'

// 用户登录
export const login = data => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/authorizations',
    data
  })
}

// 获取用户基本信息
export const getUserProfile = () => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/profile'
    // headers: {
    //   Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NDE5NTA5NjEsInVzZXJfaWQiOjEsInJlZnJlc2giOmZhbHNlLCJ2ZXJpZmllZCI6dHJ1ZX0.0jNb5MSn7lq8ywNtT7gUbMgmF3Kj0dPitmkGLrZnvr4'
    // }
  })
}

// 获取用户图片素材
export const getUserImages = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/images',
    params
  })
}

// 收藏用户图片素材
export const collectImages = (imageId, data) => {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/user/images/${imageId}`,
    data
  })
}

// 编辑用户头像
export const updateUserPhoto = (photo) => {
  return request({
    method: 'PATCH',
    url: '/mp/v1_0/user/photo',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: {
      photo
    }
  })
}

// 编辑用户资料
export const updateUserInfo = data => {
  return request({
    method: 'PATCH',
    url: 'mp/v1_0/user/profile',
    data
  })
}
