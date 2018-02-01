/**
 * Created by 邵敬超 on 2017/11/17.
 */


(function () {
	Mock.setup({
		timeout:100
	});
  
  ['500元现金红包', '押题密卷一套', '100元代金券', '50元代金券', '20元代金券', '10元代金券']
	// 页面初始化接口数据
	Mock.mock('/getAwardsList',function () {
		return Mock.mock({
			status:1,
			data:{
				prizeList: [
					{
						name: "500元现金红包",
						img: "images/iPhone6.png"
					},
					{
						name: "押题密卷一套",
						img: "images/ipadmini.png"
					},
					{
						name: "100元代金券",
						img: "images/shouhuan.png"
					},
					{
						name: "50元代金券",
						img: "images/prize/20.png"
					},
					{
						name: "20元代金券",
						img: "images/red.png"
					},
					{
						name: "10元代金券",
						img: "images/shouhuan.png"
					}
				],
				times:3
			},
			msg:'成功'
		})
	});
	
	// 抽奖接口
	var lotteryTimes = 3;
	Mock.mock('/lotteryPlay',function () {
		lotteryTimes--;
		if(lotteryTimes  < 0){
			return Mock.mock({
				status:1,
				data:{
					isLuck:0,
					times:0,
					awardID:0,
					msg:"抽奖次数已用完，分享可增加一次机会"
				},
				msg:'成功'
			})
		} else {
			return Mock.mock({
				status:1,
				data:{
					isLuck:1,
					times:lotteryTimes,
					awardID:1,
          img: "images/prize/20.png",
          msg: '恭喜您！成功获得押题密卷50元代金券。',
          tips: '*限购买《2018临考预测押题密卷》使用'
				},
				msg:'成功'
			})
		}
	});
})();
