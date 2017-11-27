/*
* @Author: Administrator
* @Date:   2017-11-24 19:57:35
* @Last Modified by:   Administrator
* @Last Modified time: 2017-11-27 17:29:06
*/

$(document).ready(function(){
	//nav部鼠标移到上面，显示二级栏目
	//方法一：
	// $('.nav-right li:nth-child(n+2)').each(function(index,ele){
	// 	$(ele).mouseover(function(){
	// 		$(ele).children('ul').show();
	// 		$(this).css('background-color','#fff');
	// 	});
	// 	$(ele).mouseout(function(){
	// 		$(ele).children('ul').hide();
	// 		$(this).css('background-color','#f5f5f5');
	// 	});
	// })
	// 方法二：
	$('.nav-right li:nth-child(n+2)').hover(function() {
		$(this).css('background-color','#fff').children('ul').show();
	}, function() {
		$(this).css('background-color','#f5f5f5').children('ul').hide();
	});

//卖家促销下拉列表
	$('.promotion').mouseover(function(){
		$(this).siblings('.proSlidedown').stop().show('fast');
	});
	$('.promotion').mouseout(function(){
		$(this).siblings('.proSlidedown').stop().hide('fast');
	});

//搜索框下拉列表
	$('.header-search-input').on('keyup',function(event){
		//获取搜索框的值
		var $val = $(this).val();
		//发送请求
		$.ajax({
			url:'./search.json',
			data:{'Query':$val},
			success:function(data){
				// console.log(data);
				for(var i=0;i<data.length;i++){
					if(data[i][0]['Query'] == $val){
						// console.log(data[i][0]['Results'][0].Suggests);
						var obj = {
							items: data[i][0]['Results'][0].Suggests
						};
						var resultstr = template('search',obj);
						$('.header-search .list').html(resultstr);
						$('.header-search .list').show().css({
							'position':'absolute',
							'left':0,
							'top':$('.header-search-input').height()+5
						})
						
					}
				}
				//点击出现的li，对应内容显示到input里
				$('.list li').click(function(){
					$('.header-search-input').val($(this).text());
					$(this).parent('ul').parent().css('display','none');
				})
			}
		});
		//如果搜索框内容为空，下拉列表为空
		if($val==''){
			$('.list').css('display','none');
		}
		//如果内容为列表里的第三列，回车后刷新展示新产品
		if(event.which==13){
			shoppingCart();
		}			
	});
	function shoppingCart(){
		var $val = $('.header-search-input').val();
		$.ajax({
			url:'./basketballShoes.json',
			data:{'Query':$val},
			success:function(data){
				// console.log(data);
				for(var i=0;i<data.length;i++){
					if(data[i][0]['Query'] == $val){
						// console.log(data[i][0]['Results'][0].Suggests);
						var obj = {
							items: data[i][0]['Results'][0].Suggests							
						};
						var resultstr = template('basketBallShoes',obj);
						$('.commodityContainer').html(resultstr);
						
					}
				}
				
			}
		});
	}
	//点击body，下拉列表消失
	$(document).click(function(){
		$('.list').hide();
	})

	//删除商品
	var thisInfo;
	var previous;
	var next;
	$('.commodityInfo .delete').click(function(){
		thisInfo = $(this).parents('.mainCommodity');
		// console.log(template('delete'));
		previous = $(this).parents('.mainCommodity').prev();
		next  = $(this).parents('.mainCommodity').next();
		$(this).parents('.mainCommodity').detach();
		var html = template('delete');
		if($('.mainCommodity').first()){
			next.before(html);
		}else{
			previous.after(html);
		}
		return false;//阻止默认行为，跳到顶部
	});
	//商品恢复
	$('body').on('click','.turnBack',function(){
		console.log(thisInfo);
		previous.after(thisInfo);
		$('.undo-wrapper').hide();
		return false;
	});
	//下边框移动
	$('.switch-cart li').mouseover(function(){
		$('.switch-cart li').removeClass('selectColumn');
		$(this).addClass('selectColumn');
	}).mouseout(function(){
		$('.switch-cart li').removeClass('selectColumn');
		$('.switch-cart li').eq(0).addClass('selectColumn');
	});

	//商品数量的增加
	$('.amount-right').click(function(){
		var inp = $(this).siblings('input');
		var num = inp.val();
		var stock = parseInt($(this).parents('.item-amount').siblings('.stock').text());
		var perprice = parseInt($(this).parents('.td-amount').siblings('.td-price').find('span').text());
		var tolpriceBox = $(this).parents('.td-amount').siblings('.td-sum').find('span');
		if(num<stock){
			num++;
			inp.val(num);
		}else{
			$(this).parent().siblings('.outNum').show('fast');
			// stock($(this));
		}
		tolpriceBox.text(num*perprice+'.00');
		return false;
	});
	//商品库存
	function stock(that){
		var totalSum =parseInt(that.parents('.item-amount').siblings('.stock').text());
		var outnum = that.parents('.item-amount').siblings('.outNum');
		var cursum = that.parents('.item-amount').find('input').val();
		if(parseInt(cursum)>toatlSum){
			outnum.show(fast);
		}else{
			outnum.hide(fast);
		}
		outnum.find('span').text(totalSum);
	}
	
	
	// 
	//商品数量的减少
	$('body').on('click','.amount-left',function(){
		var inp = $(this).siblings('input');
		var num = inp.val();
		var stock = parseInt($(this).parents('.item-amount').siblings('.stock').text());
		var perprice = parseInt($(this).parents('.td-amount').siblings('.td-price').find('span').text());
		var tolpriceBox = $(this).parents('.td-amount').siblings('.td-sum').find('span');
		if(num<=1){
			num=1;
		}else{
			num--;
		}
		inp.val(num);
		tolpriceBox.text(num*perprice+'.00');
		// stock($(this));
		return false;
	});
	//
	//获得已选中商品的总额
	function getCount(){
		var counts = 0;
		var sum = 0;
		$('.td-inner input').each(function(index, el) {
			if ($(el).prop('checked')) {
					counts += parseInt($(el).parents('.td-chk').siblings('.td-sum').find('span').text());
					sum += 1;
			}
		});
		$('.totalSum').text(sum);
		$('.total-sum').html((counts).toFixed(2));
		$('.total-symbol').html((counts).toFixed(2));
	};
	//全选商品金额相加
	
	//商品全选
	$('.allSelected1').click(function(){
		if($(this).prop('checked')){
			$(':checkbox').prop('checked',true);
			$('.commodityInfo').css({
				'background-color':'#FFF8E1'
			});
			$('.submit-btn').css({
				'background-color':'#f40',
				'cursor':'pointer'
			});
			$('#btn-sum').css({
				'background-color':'#f40',
				'cursor':'pointer'
			});
		}else{
			$(':checkbox').prop('checked',false);
			$('.commodityInfo').css({
				'background-color':'#fcfcfc'
			});
			$('.submit-btn').css({
				'background-color':'#aaa',
				'cursor':'not-allowed'
			})
			$('#btn-sum').css({
				'background-color':'#aaa',
				'cursor':'not-allowed'
			})
		}
		getCount();
	});

	//fixed中的全选按钮
	$('.allSelected2').click(function(){
		if($(this).prop('checked')){
			$(':checkbox').prop('checked',true);
			$('.commodityInfo').css({
				'background-color':'#FFF8E1'
			});
			$('.submit-btn').css({
				'background-color':'#f40',
				'cursor':'pointer'
			});
			$('#btn-sum').css({
				'background-color':'#f40',
				'cursor':'pointer'
			});
		}else{
			$(':checkbox').prop('checked',false);
			$('.commodityInfo').css({
				'background-color':'#fcfcfc'
			});
			$('.submit-btn').css({
				'background-color':'#aaa',
				'cursor':'not-allowed'
			})
			$('#btn-sum').css({
				'background-color':'#aaa',
				'cursor':'not-allowed'
			})
		}
		getCount();
	});
	//
	//取消全选
	 function cancelSelect(){
	 	if($('.td-inner input').length == $('.td-inner input:checked').length){
	 		$('.allSelected1').prop('checked',true);
	 		$('.allSelected2').prop('checked',true);
	 	}else{
	 		$('.allSelected1').prop('checked',false);
			$('.allSelected2').prop('checked',false);
	 	}

	 }
	 //取消全选样式设置
	 function cancelCalculator(){
		if ($('.td-inner input:checked').length === 0) {
			$('#btn-sum').css({
				'background-color':'#aaa',
				'cursor':'not-allowed'
			});
			$('.submit-btn').css({
				'background-color':'#aaa',
				'cursor':'not-allowed'
			});
		} else {
			$('#btn-sum').css({
				'background-color':'#f40',
				'cursor':'pointer'
			});
			$('.submit-btn').css({
				'background-color':'#f40',
				'cursor':'pointer'
			})
		}
	}
	//点击某商品时
	$('.td-inner input').click(function(){
		if($(this).prop('checked')){
			$(this).parents('.commodityInfo').siblings('.shopInfo').find('input').prop('checked',true);
			$(this).parents('.commodityInfo').css({
				'background-color':'#fff8e1'
			});
		}else{
			$(this).parents('.commodityInfo').siblings('.shopInfo').find('input').prop('checked',false);
			$(this).parents('.commodityInfo').css({
				'background-color':'#fcfcfc'
			});
		}
		cancelSelect();
		cancelCalculator();
		getCount();
	})

	//点击某商铺时选中
	$('body').on('click','.shopInfo input',function(event){
		if ($(this).prop('checked')) {
			$(this).parents('.shopInfo').siblings('.commodityInfo').find('.td-inner input').prop('checked',true);
			$(this).parents('.shopInfo').siblings('.commodityInfo').css({
				'background-color':'#fff8e1'
			});
		} else {
			$(this).parents('.shopInfo').siblings('.commodityInfo').find('.td-inner input').prop('checked',false);
			$(this).parents('.shopInfo').siblings('.commodityInfo').css({
				'background-color':'#fcfcfc'
			});
		}
		cancelCalculator();
		cancelSelect();
		getCount();
	});







})

