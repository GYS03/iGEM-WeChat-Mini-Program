// pages/show/show.js
// showImagePage.js
Page({
  data: {
    showImage: false,
    serverImageUrl: '',
    displayText: "Select the button you want to view the content, click on the picture to enlarge it for observation, long press on the picture to save it in the local album.",
    isImagePopupVisible: false, // 是否显示图片弹出窗口
  },

  // 小程序端代码
showPlot: function () {
  this.setData({
    displayText: "The Plot image shows the curve fitting results of fluorescence detection. "
  });
  const that = this;
  const apiUrl = 'http://minifluorescence.com:80/api/measure_fluorescence_plot'; // 修改为服务器返回结果图片的接口地址
  wx.request({
    url: apiUrl,
    method: 'POST',
    data: {}, // 如果有需要传递的数据，可在此设置
    responseType: 'arraybuffer', // 设置响应类型为 arraybuffer，以获取二进制数据
    success: function (res) {
      if (res.statusCode === 200) {
        // 创建一个临时 URL 对象
        const tempFilePath = wx.env.USER_DATA_PATH + '/temp_plot.png';
        wx.getFileSystemManager().writeFile({
          filePath: tempFilePath,
          data: res.data,
          encoding: 'binary',
          success: function () {
            // 获取图片信息
            wx.getImageInfo({
              src: tempFilePath,
              success: function (infoRes) {
                // 将临时 URL 设置为图像源，展示图片
                that.setData({
                  serverImageUrl: tempFilePath,
                  imageWidth: infoRes.width,
                  imageHeight: infoRes.height,
                  isPlotDisplayed: true,
                });
              },
              fail: function (infoErr) {
                console.error('Get image info failed:', infoErr);
                wx.showToast({
                  title: '获取图片信息失败',
                  icon: 'none',
                  duration: 2000,
                });
              },
            });
          },
          fail: function (writeErr) {
            console.error('Write image file failed:', writeErr);
            wx.showToast({
              title: '保存图片失败',
              icon: 'none',
              duration: 2000,
            });
          },
        });
      } else {
        console.error('Request failed with status code:', res.statusCode);
        wx.showToast({
          title: '请求图片失败',
          icon: 'none',
          duration: 2000,
        });
      }
    },
    fail: function (error) {
      console.error('Request failed:', error);
      wx.showToast({
        title: '请求图片失败',
        icon: 'none',
        duration: 2000,
      });
    },
  });
},

showResult: function () {
  const that = this;
  const apiUrl = 'http://minifluorescence.com:80/api/measure_fluorescence_results'; // 修改为服务器返回结果图片的接口地址
  this.setData({
    displayText: "The Result image is used to display the contours of the fluorescent regions. "
  });
  wx.request({
    url: apiUrl,
    method: 'POST',
    data: {}, // 如果有需要传递的数据，可在此设置
    responseType: 'arraybuffer', // 设置响应类型为 arraybuffer，以获取二进制数据
    success: function (res) {
      if (res.statusCode === 200) {
        // 创建一个临时结果图片的 URL 对象
        const tempResultFilePath = wx.env.USER_DATA_PATH + '/temp_result.png';
        wx.getFileSystemManager().writeFile({
          filePath: tempResultFilePath,
          data: res.data,
          encoding: 'binary',
          success: function () {
            // 获取图片信息
            wx.getImageInfo({
              src: tempResultFilePath,
              success: function (infoRes) {
                // 将临时 URL 设置为图像源，展示图片
                that.setData({
                  serverImageUrl: tempResultFilePath,
                  imageWidth: infoRes.width,
                  imageHeight: infoRes.height,
                  isPlotDisplayed: true,
                });
              },
              fail: function (infoErr) {
                console.error('Get image info failed:', infoErr);
                wx.showToast({
                  title: '获取图片信息失败',
                  icon: 'none',
                  duration: 2000,
                });
              },
            });
          },
          fail: function (writeErr) {
            console.error('Write image file failed:', writeErr);
            wx.showToast({
              title: '保存图片失败',
              icon: 'none',
              duration: 2000,
            });
          },
        });
      } else {
        console.error('Request failed with status code:', res.statusCode);
        wx.showToast({
          title: '请求图片失败',
          icon: 'none',
          duration: 2000,
        });
      }
    },
    fail: function (error) {
      console.error('Request failed:', error);
      wx.showToast({
        title: '请求图片失败',
        icon: 'none',
        duration: 2000,
      });
    },
  });
},

previewImage: function () {
  const urls = [this.data.serverImageUrl]; // 将图片的URL存储在数组中
  wx.previewImage({
    current: this.data.serverImageUrl, // 当前显示图片的URL
    urls: urls, // 需要预览的图片URL数组
    
  });
},

showOptions: function () {
  const that = this;
  wx.showActionSheet({
    itemList: ['Save'],
    success: function (res) {
      // res.tapIndex 为用户点击的选项的索引，0 表示保存图片，1 表示发送给朋友
      if (res.tapIndex === 0) {
        // 保存图片到相册
        that.saveImageToAlbum();
      } 
    },
    fail: function (err) {
      console.error('显示选项框失败', err);
    }
  });
},

// 点击保存图片图标，保存图片到相册
saveImageToAlbum: function () {
  const that = this;
  wx.saveImageToPhotosAlbum({
    filePath: that.data.serverImageUrl,
    success: function (res) {
      console.log('保存图片成功', res);
      wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 2000
      });
    },
    fail: function (err) {
      console.error('保存图片失败', err);
      wx.showToast({
        title: '保存失败',
        icon: 'none',
        duration: 2000
      });
    }
  });
},





reLaunchToIndex: function () {
  wx.reLaunch({
    url: '/pages/index/index',
    success: function(res) {
      console.log('Navigated to index page successfully');
    },
    fail: function(err) {
      console.log('Failed to navigate to index page');
    }
  });
}






});

