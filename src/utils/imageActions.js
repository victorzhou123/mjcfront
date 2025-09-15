import { imageStorage } from './imageStorage.js';

// 保存到相册的通用方法
const saveToAlbum = (filePath) => {
  console.log('开始保存图片到相册:', filePath)
  uni.saveImageToPhotosAlbum({
    filePath: filePath,
    success: () => {
      uni.showToast({
        title: '保存成功',
        icon: 'success'
      })
    },
    fail: (err) => {
      console.error('保存图片到相册失败:', err)
      // 判断是否是权限问题
      if (err.errMsg.includes('auth deny') || err.errMsg.includes('auth denied')) {
        uni.showModal({
          title: '权限提示',
          content: '需要您的相册访问权限才能保存图片，请在设置中开启。',
          success: (modalRes) => {
            if (modalRes.confirm) {
              uni.openSetting({
                success(settingdata) {
                  console.log(settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    console.log('获取权限成功，再次保存')
                    uni.saveImageToPhotosAlbum({
                      filePath: filePath,
                      success: () => {
                        uni.showToast({
                          title: '保存成功',
                          icon: 'success'
                        })
                      },
                      fail: (saveErr) => {
                        console.error('再次保存失败:', saveErr)
                        uni.showToast({
                          title: '保存失败',
                          icon: 'none'
                        })
                      }
                    })
                  } else {
                    console.log('获取权限失败')
                    uni.showToast({
                      title: '您未授权，无法保存',
                      icon: 'none'
                    })
                  }
                }
              })
            }
          }
        })
      } else {
        uni.showToast({
          title: '保存失败',
          icon: 'none'
        })
      }
    }
  })
}

// 下载图片到手机相册
const downloadImage = (image) => {
  uni.showLoading({
    title: '保存中...'
  })

  const url = image.url
  console.log('开始保存图片:', url)

  // 如果是远程URL，先下载
  if (url.startsWith('http')) {
    uni.downloadFile({
      url: url,
      success: (res) => {
        if (res.statusCode === 200) {
          saveToAlbum(res.tempFilePath)
        } else {
          uni.hideLoading()
          uni.showToast({
            title: '图片下载失败',
            icon: 'none'
          })
        }
      },
      fail: () => {
        uni.hideLoading()
        uni.showToast({
          title: '图片下载失败',
          icon: 'none'
        })
      }
    })
  } else {
    // 否则假定是本地路径
    saveToAlbum(url)
  }
}

// 显示图片详情
const showImageDetails = (image) => {
  const saveTime = new Date(image.saveTime).toLocaleString('zh-CN')
  const content = `生成时间: ${saveTime}\n提示词: ${image.prompt || '无'}\n图片序号: ${image.index || 1}/${image.imageCount || 1}`

  uni.showModal({
    title: '图片详情',
    content: content,
    showCancel: false,
    confirmText: '确定'
  })
}

// 删除图片
const deleteImage = (image, onDeleteSuccess) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这张图片吗？此操作不可恢复。',
    success: async (res) => {
      if (res.confirm) {
        try {
          await imageStorage.deleteImage(image.id)

          uni.showToast({
            title: '删除成功',
            icon: 'success'
          })

          if (onDeleteSuccess) {
            onDeleteSuccess()
          }
        } catch (error) {
          console.error('删除图片失败:', error)
          uni.showToast({
            title: '删除失败',
            icon: 'none'
          })
        }
      }
    }
  })
}

export const showImageActionSheet = (image, imageList, onDeleteSuccess, options = {}) => {
  const { fromPreview = false } = options;
  const itemList = [];

  if (!fromPreview && imageList && Array.isArray(imageList) && imageList.length > 0) {
    itemList.push('预览图片');
  }
  if (image.prompt || image.saveTime) {
    itemList.push('查看详情');
  }
  if (image.url) {
    itemList.push('保存图片');
  }
  if (image.id) {
    itemList.push('删除图片');
  }

  if (itemList.length === 0) {
    console.warn('No actions available for this image.');
    return;
  }

  // 显示操作菜单
  uni.showActionSheet({
    itemList: itemList,
    success: (res) => {
      const action = itemList[res.tapIndex];
      switch (action) {
        case '预览图片':
          uni.previewImage({
            urls: imageList.map(img => img.url),
            current: image.url
          });
          break;
        case '查看详情':
          showImageDetails(image);
          break;
        case '保存图片':
          downloadImage(image);
          break;
        case '删除图片':
          deleteImage(image, onDeleteSuccess);
          break;
      }
    }
  });
}