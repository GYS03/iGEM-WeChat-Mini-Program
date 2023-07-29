// index.js
Page({
  data: {
    tempFilePaths: '',
    isImageSelected: false,
  },
  
  chooseImage: function () {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths[0];
        that.setData({
          tempFilePaths: tempFilePaths,
          isImageSelected: true,
        });
        
      },
      fail(res) {
        console.log('调用失败', res.errMsg);
      },
    });
  },

  reselectImage: function () {
    this.setData({
      tempFilePaths: '',
      isImageSelected: false,
    });
  },
  
  UpLoad: function () {
    if (this.data.isImageSelected) {
      const tempFilePaths = this.data.tempFilePaths;

      if (!tempFilePaths) {
        wx.showToast({
          title: '请先选择图片',
          icon: 'none',
          duration: 2000,
        });
        return;
      }

      // Call the sendImageToServer method here, passing the image path directly
      this.sendImageToServer(tempFilePaths);
    } else {
      wx.showToast({
        title: '请先选择图片',
        icon: 'none',
        duration: 2000,
      });
    }
  },

  sendImageToServer: function (imagePath) {
    const that = this;
    const apiUrl = 'http://10.62.43.236:5015/api/measure_fluorescence';
    // Replace with your server address
    
    wx.uploadFile({
      url: apiUrl,
      filePath: imagePath,
      name: 'image', // The name of the file field that the server expects
      formData: {
        user_id: '123456', // Additional data to send along with the image
      },
      success: function (res) {
        // Handle the server's response upon successful image upload
        console.log('Image upload successful:', res);
        const data = JSON.parse(res.data);
        wx.showToast({
          title: '上传成功',
          icon: 'success',
          duration: 2000,
          success: function () {
            // 图标显示完成后执行跳转
            console.log('Uploaded image URL:', data.imageUrl);
            wx.navigateTo({
              url: '/pages/show/show',
            });
          },
        });
      },
      fail: function (error) {
        console.error('Image upload failed:', error);
        wx.showToast({
          title: '上传失败',
          icon: 'none',
          duration: 2000,
        });
      },
    });
  },
});
