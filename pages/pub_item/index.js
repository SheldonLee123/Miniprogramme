// pages/pub_item/index.js
import { request } from "../../request/index.js";
Page({

  /**
   * Page initial data
   */
  data: {
    index: 0,
    imgPath: [],
    pubcateList: ["推荐物品", "家具家电", "书籍文具", "服饰鞋包", "电子产品", "美妆护肤", "药品", "运动", "食材"]
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    const { cate_id } = options;
    console.log(cate_id);
    this.getPubCateList(cate_id)
  },

  getPubCateList (cate_id) {
    request({ url: "/get_pubcatelist", data: { cate_id } })
      .then(result => {
        console.log(result)
        // templist = []
        // result.forEach((v, i) => templist[i] = v.cat_name);
        this.setData({
          // pubcateList: templist
        })
      })
  },

  // 点击 “+” 选择图片
  handleChooseImg () {
    // 2 调用小程序内置的选择图片api
    wx.chooseImage({
      // 同时选中的图片的数量
      count: 1,
      // 图片的格式  原图  压缩
      sizeType: ['original', 'compressed'],
      // 图片的来源  相册  照相机
      sourceType: ['album', 'camera'],
      success: (result) => {
        var tempFilePaths = result.tempFilePaths;
        this.setData({
          // 图片数组 进行拼接 
          imgPath: tempFilePaths[0]
        })
      }
    });
  },

  previewImg: function (e) {
    var img = this.data.imgPath;
    // 设置预览图片路径
    wx.previewImage({
      current: img,
      urls: [img]
    })
  },

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  handlepub: function (e) {
    wx.showToast({
      title: '发布成功',
      icon: 'none',
      mask: true
    });
  }
})