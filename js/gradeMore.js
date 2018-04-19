/**
 * @desc select无限极分类
 * @auth ywluo3
 * @version 2018/3/3 13:10
 *
 * @description
 *  
 * 点击多级下拉组件
 * options传入参数：
 *     clear 选中之后是否显示清除按钮 true显示 false隐藏 可不选 默认为true
 *     orderDec 选中的级别按照正序排列还是反序排列 true正序 false隐藏 可不选 默认为true
 *     data 数据,数组 必选
 *     success 选中后的回调函数返回选中结果 可不选
 */
(function ($) {

    $.fn.extend({
        "classGrade": function (options) {
            
            //检测用户传进来的参数是否合法
            if (!isValid(options))
            return this;

            //默认参数
            var defaluts = {
                'clear':true,
                'orderDec':true,
                'data':[],
                succcess:function(result){}
            };

            var opts = $.extend({}, defaluts, options);
            if(opts.data.length==0){
                opts.data.push({
                    "name":"暂无数据",
                    "children":[]
                })
            }

            return this.each(function(){  

                $(this).wrap("<div class='class-grade-cont'></div>");

                var $this = $(this).parent(),that=this;
                var inputItem=$(this);

                // 拼接下拉ul
                var afterContent="<ul class='ifly-anim-upbit class-grade-wap'>";

                opts.data.forEach(function(item){
                    var arrowTure=isValid(item.children)&&item.children.length!=0;
                    afterContent+="<li class='"+(arrowTure?'arrow-right':'')+"' data-id='"+item.id+"'><span>"+item.name+"</span>";
                    if(arrowTure){
                        afterContent+=spellLi(item.children);
                    }
                    afterContent+="</li>";
                })

                afterContent+="</ul>";
                $this.append(afterContent);

                // 有默认选中项 添加至input
                inputItem.nextAll('.class-grade-wap').find('li[data-select=true]').each(function(){
                    inputAssignment(this,inputItem,that)
                })

                //添加清除事件
                if(opts.clear){
                    inputItem.after('<span class="class-grade-clear" style="display:none">×</span>');
                    inputItem.parent().find('.class-grade-clear').bind('click',function(){
                        inputItem.val('');
                        $(this).hide()
                    })
                }

                //输入绑定点击事件
                inputItem.bind('click',function(e){
                    inputItem.nextAll('.class-grade-wap').addClass('ifly-show');
                    e.stopPropagation()
                })

                //li绑定点击事件
                inputItem.nextAll('.class-grade-wap').find('li').bind('click',function(){
                    if($(this).attr('data-id')!='undefined' && $(this).children().html()!='暂无数据'){
                        if($(this).children('ul').length==0){
                            inputAssignment(this,inputItem,that);// 添加数据
                            $this.find('ul').removeClass('ifly-show').addClass('ifly-hide');
                            inputItem.parent().find('.class-grade-clear').show()
                        }
                        return false
                    }
                })

                //li绑定hover事件
                inputItem.nextAll('.class-grade-wap').find('li').hover(function(){
                    if($(this).children('ul').length!=0){
                        $(this).children('ul').addClass('ifly-show')
                    }
                },function(){
                    if($(this).children('ul').length!=0){
                        $(this).children('ul').removeClass('ifly-show').addClass('ifly-hide')
                    }
                })
            });

            //点击 赋值
            function inputAssignment(id,inputItem,target){
                var arr=[];

                arr.push({
                    name:$(id).children('span').html(),
                    id:$(id).attr('data-id')
                });

                //获取点击项 向上层级
                for(var i=0;i<$(id).parents('.ifly-anim-upbit').length-1;i++){
                    opts.orderDec?arr.unshift({
                        name:$(id).parents('.ifly-anim-upbit').eq(i).prev('span').html(),
                        id:$(id).parents('.ifly-anim-upbit').eq(i).prev('span').parent().attr('data-id')
                    }):arr.push({
                        name:$(id).parents('.ifly-anim-upbit').eq(i).prev('span').html(),
                        id:$(id).parents('.ifly-anim-upbit').eq(i).prev('span').parent().attr('data-id')
                    });
                }

                opts.success && opts.success.call(target,arr);
            }
        }
    });

    // 数据children 拼接
    function spellLi(data){
        var spellCont="<ul class='ifly-anim-upbit'>"
        data.forEach(function(item){
            var arrowTure=isValid(item.children)&&item.children.length!=0;
            spellCont+="<li class='"+(arrowTure?'arrow-right':'')+"' data-id='"+item.id+"' "+(item.selected?'data-select=true':'')+"><span>"+item.name+"</span>";
            if(arrowTure){
                spellCont+=spellLi(item.children)
            }
            spellCont+="</li>";
        })
        spellCont+="</ul>";
        return spellCont
    };

    //检测参数是否合法
    function isValid(options) {
        return !options || (options && typeof options === "object") ? true : false;
    };

    //点击空白关闭事件
    document.onclick = function(){
        $(".class-grade-wap").removeClass('ifly-show').addClass('ifly-hide');
        $(".class-grade-wap").find('ul').removeClass('ifly-show').addClass('ifly-hide');
    };

})(window.jQuery);