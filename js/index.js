/**
 * Created by 邵敬超 on 2017/11/14.
 */

/*大转盘抽奖页面*/
(function ($) {
	
	String.prototype.getLen = function() {
		var len = 0;
		for (var i=0; i<this.length; i++) {
			if (this.charCodeAt(i)>127 || this.charCodeAt(i)==94) {
				len += 2;
			} else {
				len ++;
			}
		}
		return len;
	};
	
	
	$.bigWheel = {
		init: function () {
			
			// 关闭弹出框
			$(".close-box").click(function (index) {
				$(".prize-tips").hide();
			})
		},
		index: function () {
			
			// 初始化页面转盘
			var turnplate = {
				background: "#FFBE04",
				prizeList: [],				//大转盘奖品名称
				prizeImg: ['./images/download_icon_18.png'],				//大转盘奖品名称
				colors: ["#49adeb", "#fdedbc", "#49adeb", "#fdedbc", "#49adeb", "#fdedbc"],					//大转盘奖品区块对应背景颜色
				outsideRadius: 191,			//大转盘外圆的半径
				textRadius: 152,				//大转盘奖品位置距离圆心的距离
				insideRadius: 65,			//大转盘内圆的半径
				startAngle: 0,
				initAngle: -120,      //开始角度
				bRotate: false				//false:停止;ture:旋转
			};
			
			var $resultAlert = $("#J_resultAlert");
			
			//动态添加大转盘的奖品与奖品区域背景颜色
			
			if (window.prizeList) {
				turnplate.prizeList = prizeList;
			}
			console.log($.easing)
			
			// 初始化页面转盘
			window.onload = function () {
				var canvas = $("#wheelcanvas").get(0);
				if (!canvas) { return false; }
				
				
				var line_height = 20;
				//根据奖品个数计算圆周角度
				var arc = Math.PI * 2 / turnplate.prizeList.length;
				var ctx = canvas.getContext("2d");
				
				//背景色
				ctx.strokeStyle = turnplate.background;
				
				//font 属性设置或返回画布上文本内容的当前字体属性
				ctx.font = '600 18px/2 Microsoft YaHei';
				
				/**
				 * canvas 绘图默认中3点钟位置开始绘制 需校正角度
				 * canvas 绘图使用弧度制
				 * 绘制指定角度对应的奖品
				 * */
				
				for (var i = 0; i < turnplate.prizeList.length; i++) {
					var angle = turnplate.startAngle + i * arc;
					
					// 修正角度
					angle = angle - (Math.PI / 2 + arc / 2);
					ctx.fillStyle = turnplate.colors[i];
					
					ctx.beginPath();
					ctx.arc(211, 211, turnplate.outsideRadius, angle, angle + arc, false); //arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）
					ctx.arc(211, 211, turnplate.insideRadius, angle + arc, angle, true);
					ctx.stroke();
					ctx.fill();
					
					//锁画布(为了保存之前的画布状态)
					ctx.save();
					
					//----绘制奖品开始----
					ctx.fillStyle = "#333333";
					var text = turnplate.prizeList[i];
					
					//translate方法重新映射画布上的 (0,0) 位置
					ctx.translate(211 + Math.cos(angle + arc / 2) * turnplate.textRadius, 211 + Math.sin(angle + arc / 2) * turnplate.textRadius);
					
					//rotate方法旋转当前的绘图
					ctx.rotate(angle + arc / 2 + Math.PI / 2);
					
					/** 下面代码根据奖品类型、奖品名称长度渲染不同效果，如字体、颜色、图片效果。(具体根据实际情况改变) **/
					// if (text.indexOf("M") > 0) {
					// 	console.log(text)
					// 	var texts = text.split("M");
					// 	for (var j = 0; j < texts.length; j++) {
					// 		ctx.font = j == 0 ? 'bold 20px Microsoft YaHei' : '16px Microsoft YaHei';
					// 		if (j == 0) {
					// 			ctx.fillText(texts[j] + "M", -ctx.measureText(texts[j] + "M").width / 2, j * line_height);
					// 		} else {
					// 			ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
					// 		}
					// 	}
					// }
					
					//奖品名称长度超过一定范围
					//在画布上绘制填色的文本。文本的默认颜色是黑色
					//measureText()方法返回包含一个对象，该对象包含以像素计的指定字体宽度
					if (text.getLen() > 6) {
						var texts = [text.substring(0, 6),text.substring(6)];
						for (var j = 0; j < texts.length; j++) {
							ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
						}
					} else {
						ctx.fillText(text, -ctx.measureText(text).width / 2, line_height / 2);
					}
					
					var img = new Image();
					img.src = turnplate.prizeImg[0];
					ctx.drawImage($("#J_pointer").get(0),-22.5,line_height * 2 - 8,45,45);
					ctx.restore();
					
					//----绘制奖品结束----
				}
			};
			
			/**
			 * 旋转转盘
			 * @param opt[id] {Number} 奖品id
			 * opt[msg] {String} 抽奖提示语
			 * opt[isLuck] {String} 是否中奖
			 * */
			var rotateFn = function (opt) {
				var itemAngle = 360 / turnplate.prizeList.length;
				var angles = (opt.id * itemAngle);
				updateTimes();
				turnplate.bRotate = true;
				$('#wheelcanvas').rotate({
					angle: 0,
					animateTo: 360 * 5 + (360 - angles),
					duration: 6000,
					callback: function () {
						turnplate.bRotate = false;
						$resultAlert.show();
						if(opt.isLuck){
							$resultAlert.find('.writeInfo').data('id',opt.id).show();
						}else{
							$resultAlert.find('.writeInfo').hide();
						}
						$resultAlert.find('.md-title').html(opt.msg);
					}
				});
			};
			
			// 底部页面切换
			$("#page_tab").on("click", "div", function () {
				$(this).addClass("current").siblings().removeClass('current');
				$($(this).data('target')).show().siblings().hide()
			});
			
			
			// 模拟抽奖过程
			var timesCount = 0; //统计次数
			
			function updateTimes () {
				$("#J_residueDegree").show().html("剩余次数："+(3-timesCount));
			}
			updateTimes();
			function mockResponse () {
				if (timesCount < 3) {
					timesCount++;
					var awardInfoId = parseInt(Math.random() * 6);
					console.log(awardInfoId)
					return {
						isAllow: true,
						awardInfo: {
							id: awardInfoId,
							isLuck: awardInfoId !== 0,
							// info:turnplate.prizeList[awardInfoId],
							msg: awardInfoId !== 0 ? '恭喜您！^_^ ，获得' + turnplate.prizeList[awardInfoId] : turnplate.prizeList[awardInfoId] + '，继续努力哦！'
						}
					}
				} else {
					return {
						isAllow: false,
						msg: '你今天的次数用完了,分享给朋友可增加抽奖次数哦^_^'
						
					}
				}
			}
			
			// 开始抽奖
			$('#J_pointer').click(function () {
				
				if (turnplate.bRotate) {
					return false;
				}
				
				// 模拟请求数据
				var res = mockResponse();
				
				if (res.isAllow) {
					rotateFn(res.awardInfo)
				} else {
					$resultAlert.show();
					$resultAlert.find('.writeInfo').hide();
					$resultAlert.find('.md-title').html(res.msg);
				}
			});
			
			// 领取奖品按钮跳转
			$(".writeInfo").on("click",function () {
				var id = $(this).data('id');
				window.open("./book.html?id=" + id)
			})
		},
		
		// 填写用户信息
		writeUserInfo: function () {
			
			// 表单验证项目
			var valiArray = 'subject,selectAddress,address,consignee,phoneNumber';
			$("#J_submit").on("click", function (e) {
				e.preventDefault();
				var isPass = true;
				$(valiArray.split(',')).each(function (i,item) {
					if(!$('[name='+item+']').val()){
						isPass = false
					}
				});
				
				// 通过验证提交表单
				if(isPass){
					$("#form").submit();
					alert('信息提交成功')
				}else{
					alert('请完善个人信息')
				}
			});
		}
	};
	$.bigWheel.init();
	
})(jQuery);
