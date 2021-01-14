/*
图片相关模块
*/

import request from '@/utils/request'

// 获取用户图片素材
export const getUserImages = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/images',
    params
  })
}

// 收藏用户图片素材
export const collectImage = (imageId, collect) => {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/user/images/${imageId}`,
    data: {
      collect
    }
  })
}

// 删除用户图片素材
export const deleteImage = (imageId) => {
  return request({
    method: 'DELETE',
    url: `/mp/v1_0/user/images/${imageId}`
  })
}

// 上传用户图片素材
export const uploadImage = data => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/user/images',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}
