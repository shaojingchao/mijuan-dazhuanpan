/**
 * Created by 邵敬超 on 2018/02/01.
 */

/*大转盘抽奖页面*/
(function ($) {
  
  /**
   * 奖品列表
   * @desc 奖品列表数据格式
   * */
  // var prizeList = [
  //   {
  //     name: "500元现金红包",
  //     img: "images/iPhone6.png"
  //   },
  //   {
  //     name: "押题密卷一套",
  //     img: "images/shouhuan.png"
  //   },
  //   {
  //     name: "100元代金券",
  //     img: "images/iPhone6.png"
  //   },
  //   {
  //     name: "50元代金券",
  //     img: "images/prize/prize1_rmb_50yuan.png"
  //   },
  //   {
  //     name: "20元代金券",
  //     img: "images/shouhuan.png"
  //   },
  //   {
  //     name: "10元代金券",
  //     img: "images/iPhone6.png"
  //   }
  // ];
  
  
  String.prototype.getLen = function () {
    var len = 0
    for (var i = 0; i < this.length; i++) {
      if (this.charCodeAt(i) > 127 || this.charCodeAt(i) == 94) {
        len += 2
      } else {
        len++
      }
    }
    return len
  }
  var _start_color = '#fedb03'
  var _end_color = '#fccd02'
  var TurningPlate = {
    init: function (prize) {
      
      this.turnplate.prizeList = prize
      
      // 初始化页面转盘
      var turnplate = this.turnplate
      
      //动态添加大转盘的奖品与奖品区域背景颜色
      
      // 初始化页面转盘
      $(function () {
        $('#loading').fadeOut(150)
        var canvas = $('#wheelcanvas').get(0)
        if (!canvas) { return false }
        
        
        var line_height = 18
        //根据奖品个数计算圆周角度
        var arc = Math.PI * 2 / turnplate.prizeList.length
        var ctx = canvas.getContext('2d')
        
        //背景色
        ctx.strokeStyle = turnplate.background
        
        //font 属性设置或返回画布上文本内容的当前字体属性
        ctx.font = '500 18px/2 Microsoft YaHei'
        
        /**
         * canvas 绘图默认中3点钟位置开始绘制 需校正角度
         * canvas 绘图使用弧度制
         * 绘制指定角度对应的奖品
         * */
        
        for (var i = 0; i < turnplate.prizeList.length; i++) {
          var angle = turnplate.startAngle + i * arc
          
          // 修正角度
          angle = angle - (Math.PI / 2 + arc / 2)
          ctx.fillStyle = turnplate.colors[i]
          
          ctx.beginPath()
          ctx.arc(211, 211, turnplate.outsideRadius, angle, angle + arc, false) //arc(x,y,r,起始角,结束角,绘制方向)
          // 方法创建弧/曲线（用于创建圆或部分圆）
          ctx.arc(211, 211, turnplate.insideRadius, angle + arc, angle, true)
          ctx.stroke()
          ctx.fill()
          
          //锁画布(为了保存之前的画布状态)
          ctx.save()
          
          //----绘制奖品开始----
          ctx.fillStyle = '#b41819'
          var text = turnplate.prizeList[i].name
          
          //translate方法重新映射画布上的 (0,0) 位置
          ctx.translate(211 + Math.cos(angle + arc / 2) * turnplate.textRadius, 211 + Math.sin(angle + arc / 2) * turnplate.textRadius)
          
          //rotate方法旋转当前的绘图
          ctx.rotate(angle + arc / 2 + Math.PI / 2)
          
          //奖品名称长度超过一定范围
          //在画布上绘制填色的文本。文本的默认颜色是黑色
          //measureText()方法返回包含一个对象，该对象包含以像素计的指定字体宽度
          var _wordLen = turnplate.wordWrapLength
          if (text.getLen() > _wordLen) {
            var texts = [text.substring(0, _wordLen), text.substring(_wordLen)]
            for (var j = 0; j < texts.length; j++) {
              ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height)
            }
          } else {
            ctx.fillText(text, -ctx.measureText(text).width / 2, line_height / 2)
          }
          
          // 绘制奖品配图 优化图片视觉尺寸
          var img = turnplate.prizeList[i].img
          var _imgMax = Math.max(img.height, img.width)
          var _imgAbs = Math.abs(img.height - img.width) / _imgMax
          var imgSize = 60 + 20 * _imgAbs
          ctx.drawImage(img, -imgSize / 2, (line_height) + (imgSize - img.height) / 2, img.width * (imgSize / _imgMax), img.height * imgSize / _imgMax)
          ctx.restore()
          
          
          //----绘制奖品结束----
        }
      })
      
    },
    turnplate: {
      background: '#FFBE04',
      prizeList: [],				//大转盘奖品名称
      prizeImg: ['./images/download_icon_18.png'],				//大转盘奖品名称
      colors: [_start_color, _end_color, _start_color, _end_color, _start_color, _end_color],					//大转盘奖品区块对应背景颜色
      outsideRadius: 191,			//大转盘外圆的半径
      textRadius: 152,				//大转盘奖品位置距离圆心的距离
      wordWrapLength: 8,
      insideRadius: 65,			//大转盘内圆的半径
      startAngle: 0,
      initAngle: -120,      //开始角度
      rotating: false,				//false:旋转; ture:停止
      requesting: false
      
    },
    updateTimes: function (times) {
      $('#J_residueDegree').find('.J_times').text(times)
    },
    rotateFn: function (data) {
      var _data = data.data
      /**
       * 旋转转盘
       * @param opt[id] {Number} 奖品id
       * opt[msg] {String} 抽奖提示语
       * opt[isLuck] {String} 是否中奖
       * */
      var turnplate = TurningPlate.turnplate
      var itemAngle = 360 / turnplate.prizeList.length
      var angles = (_data.awardID * itemAngle)
      TurningPlate.updateTimes(_data.times)
      TurningPlate.turnplate.rotating = true
      $('#wheelcanvas').rotate({
        angle: 0,
        animateTo: 360 * 5 + (360 - angles),
        duration: 5000,
        callback: function () {
          TurningPlate.turnplate.rotating = false
          TurningPlate.showAlert(template('tpl_modal', data))
        }
      })
    },
    // 填写用户信息
    writeUserInfo: function () {
      
      // 表单验证项目
      var valiArray = 'subject,selectAddress,address,consignee,phoneNumber'
      $(document).on('click', '#J_submit', function (e) {
        e.preventDefault()
        var isPass = true
        $(valiArray.split(',')).each(function (i, item) {
          if (!$('[name=' + item + ']').val()) {
            isPass = false
          }
        })
        
        // 通过验证提交表单
        if (isPass) {
          $('#form').submit()
          TurningPlate.hideAlert(function () {
            TurningPlate.showAlert(template('tpl_modal_get_prize'), 0)
          }, 0)
        } else {
          alert('请完善个人信息')
        }
      })
    },
    getLotteryData: function (cb) {
      /**
       * 获取抽奖结果数据
       * */
      $.get('/lotteryPlay', function (data) {
        cb && cb(data)
      }, 'json')
    },
    lotteryDataBuffer: null,//数据暂存
    startFn: function () {
      
      /*正在转动时返回*/
      if (TurningPlate.turnplate.rotating === true) return false
      var _dataBuf = TurningPlate.lotteryDataBuffer
      
      // 抽奖次数已用完
      if (_dataBuf != null && _dataBuf.data.times === 0) {
        TurningPlate.showAlert(template('tpl_modal_no'))
        return false
      }
      
      
      // 开始转动时请求数据
      TurningPlate.turnplate.requesting = true
      TurningPlate.getLotteryData(function (data) {
        TurningPlate.turnplate.requesting = false
        TurningPlate.lotteryDataBuffer = data
        TurningPlate.rotateFn(data)
      })
    },
    loadPrizeThumb: function (prizeList, loadedCb) {
      var _imgLoadedCount = 0
      prizeList.forEach(function (item, i) {
        var img = new Image()
        img.src = item.img
        $(img).on('load', function () {
          _imgLoadedCount++
          prizeList[i].img = img
          //图片加载完成初始化转盘
          if (_imgLoadedCount === prizeList.length) {
            loadedCb && loadedCb()
          }
        })
      })
    },
    index: function (data) {
      
      // 绘制转盘需要先加载奖品图片
      var prizeList = data.prizeList
      var times = data.times
      TurningPlate.loadPrizeThumb(prizeList, function () {
        TurningPlate.init(prizeList)
        TurningPlate.writeUserInfo()
        TurningPlate.updateTimes(times)
        
        // 底部页面切换
        $('#page_tab').on('click', 'div', function () {
          var _currentClass = $('#page_tab').data('current')
          $(this).addClass(_currentClass).siblings().removeClass(_currentClass)
          $($(this).data('target')).show().siblings().hide()
        })
        
        // 开始抽奖
        $(document).on('click', '#J_pointer', function () {
          TurningPlate.startFn()
        })
        
        // 继续抽奖
        $(document).on('click', '#J_goon', function () {
          TurningPlate.hideAlert()
        })
        
        // 关闭弹框
        $(document).on('click', '.close-btn', function () {
          TurningPlate.hideAlert()
        })
        
        // 领取奖品
        $(document).on('click', '#J_receive', function () {
          TurningPlate.hideAlert(function () {
            TurningPlate.showAlert(template('tpl_modal_form'), 0)
          }, 0)
        })
      })
    },
    showAlert: function (html, time) {
      var _time = time === undefined ? 150 : time
      $('#layer-box').html(html).fadeIn(_time)
    },
    hideAlert: function (cb, time) {
      var _time = time === undefined ? 150 : time
      $('#layer-box').fadeOut(_time, function () {
        $(this).html('')
        cb && cb()
      })
    }
  }
  $.TurningPlate = TurningPlate
})(jQuery)
