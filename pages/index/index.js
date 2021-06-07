// 0 引入 用来发送请求的 方法 一定要把路径补全
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    // 轮播图数组
    swiperList: [
      // {
      //   goods_id: "0",
      //   image_src: "https://aecpm.alicdn.com/simba/img/TB1CWf9KpXXXXbuXpXXSutbFXXX.jpg_q50.jpg"
      // },
      // {
      //   goods_id: "1",
      //   image_src: "https://aecpm.alicdn.com/simba/img/TB15tIjGVXXXXcoapXXSutbFXXX.jpg"
      // },
      // {
      //   goods_id: "2",
      //   image_src: "https://img.alicdn.com/imgextra/i3/2206686532409/O1CN01yJc6Lt1TfMncjGrwa_!!2206686532409-0-lubanimage.jpg"
      // },
      // {
      //   goods_id: "3",
      //   image_src: "https://img.alicdn.com/imgextra/i3/168/O1CN018zscWq1D6zDJIQUPn_!!168-0-luban.jpg"
      // }
    ],
    // 导航 数组
    catesList: [
      // {
      //   name: "出二手",
      //   image_src: "https://i.loli.net/2021/05/28/iajV5s3rhtJDoeC.png",
      //   open_type: "switchTab",
      //   navigator_url: ""
      // },
      // {
      //   name: "收二手",
      //   image_src: "https://gw.alicdn.com/tfs/TB1LvIxVAvoK1RjSZFDXXXY3pXa-183-144.png?getAvatar=1",
      //   open_type: "switchTab",
      //   navigator_url: ""
      // },
      // {
      //   name: "转租收租",
      //   image_src: "https://gw.alicdn.com/tfs/TB19uWKXkCy2eVjSZPfXXbdgpXa-183-144.png?getAvatar=1",
      //   open_type: "switchTab",
      //   navigator_url: ""
      // },
      // {
      //   name: "组局派对",
      //   image_src: "https://gw.alicdn.com/tfs/TB10cw0VxnaK1RjSZFtXXbC2VXa-183-144.png?getAvatar=1",
      //   open_type: "switchTab",
      //   navigator_url: ""
      // },
      // {
      //   name: "兼职信息",
      //   image_src: "https://gw.alicdn.com/tfs/TB10cw0VxnaK1RjSZFtXXbC2VXa-183-144.png?getAvatar=1",
      //   open_type: "switchTab",
      //   navigator_url: ""
      // },
      // {
      //   name: "本地优惠",
      //   image_src: "https://gw.alicdn.com/tfs/TB10cw0VxnaK1RjSZFtXXbC2VXa-183-144.png?getAvatar=1",
      //   open_type: "switchTab",
      //   navigator_url: ""
      // },
      // {
      //   name: "包车接机",
      //   image_src: "https://gw.alicdn.com/tfs/TB10cw0VxnaK1RjSZFtXXbC2VXa-183-144.png?getAvatar=1",
      //   open_type: "switchTab",
      //   navigator_url: ""
      // },
      // {
      //   name: "全部分类",
      //   image_src: "https://gw.alicdn.com/tfs/TB10cw0VxnaK1RjSZFtXXbC2VXa-183-144.png?getAvatar=1",
      //   open_type: "switchTab",
      //   navigator_url: ""
      // }
    ],
    tabs: [
      {
        id: 0,
        value: "综 合",
        isActive: true
      },
      {
        id: 1,
        value: "最 新",
        isActive: false
      },
      {
        id: 2,
        value: "最 热",
        isActive: false
      },
      {
        id: 3,
        value: "筛 选",
        isActive: false
      }
    ],
    goodsList: [],
    // 楼层数据
    floorList: []
  },
  // 接口要的参数
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  // 总页数
  totalPages:1,
  // 页面开始加载 就会触发
  onLoad: function (options) {
    // 1 发送异步请求获取轮播图数据  优化的手段可以通过es6的 promise来解决这个问题 
    // wx.request({
    //   url: 'https://api.zbztb.cn/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     this.setData({
    //       swiperList: result.data.message
    //     })
    //   }
    // });

    this.getSwiperList();
    this.getCateList();
    // this.getFloorList();

    this.QueryParams.cid=options.cid||"";
    this.QueryParams.query=options.query||"";
    this.getGoodsList();

  },

  // 获取轮播图数据
  getSwiperList() {
    request({ url: "/get_rotogram" })
      .then(result => {
        // console.log(result)
        this.setData({
          swiperList: result
        })
      })
  },
  // 获取 分类导航数据
  getCateList() {
    request({ url: "/catlists" })
      .then(result => {
        this.setData({
          catesList: result
        })
      })
  },
  // 获取 楼层数据
  getFloorList() {
    request({ url: "/home/floordata" })
      .then(result => {
        this.setData({
          floorList: result
        })
      })
  },

  // 标题点击事件 从子组件传递过来
  handleTabsItemChange(e) {
    // 1 获取被点击的标题索引
    const { index } = e.detail;
    // 2 修改源数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3 赋值到data中
    this.setData({
      tabs
    })
  },
  // 获取商品列表数据
  async getGoodsList() {
    const res = await request({ url: "/goods", data: this.QueryParams });
    // 获取 总条数
    const total = res.total;
    // 计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
    // console.log(this.totalPages);
    this.setData({
      // 拼接了数组
      goodsList: [...this.data.goodsList, ...res.goods]
    })

    // 关闭下拉刷新的窗口 如果没有调用下拉刷新的窗口 直接关闭也不会报错  
    wx.stopPullDownRefresh();

  },
  // 页面上滑 滚动条触底事件
  onReachBottom() {
    //  1 判断还有没有下一页数据
    if (this.QueryParams.pagenum >= this.totalPages) {
      // 没有下一页数据
      //  console.log('%c'+"没有下一页数据","color:red;font-size:100px;background-image:linear-gradient(to right,#0094ff,pink)");
      wx.showToast({ title: '没有下一页数据' });

    } else {
      // 还有下一页数据
      //  console.log('%c'+"有下一页数据","color:red;font-size:100px;background-image:linear-gradient(to right,#0094ff,pink)");
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  // 下拉刷新事件 
  onPullDownRefresh() {
    // 1 重置数组
    this.setData({
      goodsList: []
    })
    // 2 重置页码
    this.QueryParams.pagenum = 1;
    // 3 发送请求
    this.getGoodsList();
  }
})
