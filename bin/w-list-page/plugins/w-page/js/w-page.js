;
(function ($, window, document, undefined) {
    //定义插件对象的构造函数
    var plugInObj = function (ele, opt) {
        //调用者jQuery对象
        this.$element = ele;
        //默认值
        this.defaults = {
            currentPage: 1,     // 当前页 默认 1
            totalPage: 1,       // 总页数 默认 1
            firstCount: 1,      // 1 ... 3 4 5 ... 108首页处预览页数 默认 1
            lastCount: 1,       // 1 ... 3 4 5 ... 108尾页处预览页数 默认 1
            prevCount: 2,       // 当前页前预览页数 默认 2
            nextCount: 6,       // 当前页后预览页数 默认 6
            clickCallBack: function (pageNum, $element) {
                /*
                 * pageNum：点击切换之后的页码 $element：点击的元素，jQuery对象
                 * 鼠标抬起调用此函数，按下时不调用此函数
                 * 点击当前页也调用此函数,相当于刷新当前页.
                 * */
                console.log(pageNum);
                console.log($element.parent().html());      //$element:页码指的是a标签,上下一页指的是li标签
            }
        };
        //存原始的参数,各个函数不要改变这个值,只能读取.
        this.oriOptions = $.extend({}, this.defaults, opt);
        //各个函数可以更改这个对象中的值,便于各个函数之间的数据传递.
        //因为"引用",一处修改,其他处都可见.
        this.options = $.extend({}, this.defaults, opt);
        // 处理得到的用户数据 存到options中
        this.options.currentPage = parseInt(this.oriOptions.currentPage) || 1;
        this.options.totalPage = parseInt(this.oriOptions.totalPage) || 1;

        // 1 2 ... 3首页处预览页数
        this.options.firstCount = this.oriOptions.firstCount == undefined ? 1 : parseInt(this.oriOptions.firstCount) == 0 ? 0 : parseInt(this.oriOptions.firstCount) || 1;

        // 6...7 8尾页处预览页数
        this.options.lastCount = this.oriOptions.lastCount == undefined ? 1 : parseInt(this.oriOptions.lastCount) == 0 ? 0 : parseInt(this.oriOptions.lastCount) || 1;

        // 当前页前预览页数
        this.options.prevCount = this.oriOptions.prevCount == undefined ? 2 : parseInt(this.oriOptions.prevCount) == 0 ? 0 : parseInt(this.oriOptions.prevCount) || 2;

        //当前页后预览页数
        this.options.nextCount = this.oriOptions.nextCount == undefined ? 6 : parseInt(this.oriOptions.nextCount) == 0 ? 0 : parseInt(this.oriOptions.nextCount) || 6;
        this.options.currentPage = this.options.currentPage >= this.options.totalPage ? this.options.totalPage : this.options.currentPage;
        this.options.currentPage = this.options.currentPage <= 0 ? 1 : this.options.currentPage;
        this.options.totalPage = this.options.totalPage <= 0 ? 1 : this.options.totalPage;

        this.options.firstCount = this.options.firstCount < 0 ? 1 : this.options.firstCount;
        this.options.lastCount = this.options.lastCount < 0 ? 1 : this.options.lastCount;
        this.options.prevCount = this.options.prevCount < 0 ? 2 : this.options.prevCount;
        this.options.nextCount = this.options.nextCount < 0 ? 6 : this.options.nextCount;

    };
    //定义插件的方法
    plugInObj.prototype = {
        init: function () {
            var _this = this;
            var options = _this.options;
            var $element = _this.$element;
            options.totalPage = parseInt(options.totalPage);
            if (options.totalPage < 2) return $element;
            $element.html('<ul class="pagination" style="margin:0px;"><li title="上一页" class="page-prev page-pn" ><a href="javascript:;" >&lt;</a></li><li title="下一页" class="page-next page-pn"><a href="javascript:;">&gt;</a></li></ul>');
            _this.setNumList();
            //　前一页事件绑定 支持鼠标按住，快速切换页码，鼠标抬起时执行一次回调
            var prevIntId = null;// setInterval 句柄
            var executeInt = false;// 用来标记setInterval是否执行了区分按住和单击时间
            $element.find(".page-prev").mousedown(function () {
                prevIntId = setInterval(function () {
                    options.currentPage--;
                    options.currentPage = options.currentPage <= 1 ? 1 : options.currentPage;
                    _this.setNumList();
                    executeInt = true;
                }, 150)
            }).mouseup(function () {
                clearInterval(prevIntId)
                if (!executeInt) {
                    // interval未执行 相当于快速单击
                    options.currentPage--;
                    options.currentPage = options.currentPage <= 1 ? 1 : options.currentPage;
                    _this.setNumList();
                }
                executeInt = false;
                if (options.clickCallBack) {
                    options.clickCallBack(options.currentPage, $(this))
                }
            }).mouseout(function () {
                clearInterval(prevIntId)
            });
            // 后一页事件绑定
            var nextIntId = null;
            $element.find(".page-next").mousedown(function () {
                nextIntId = setInterval(function () {
                    options.currentPage++;
                    options.currentPage = options.currentPage >= options.totalPage ? options.totalPage : options.currentPage;
                    _this.setNumList();
                    executeInt = true;
                }, 150)
            }).mouseup(function () {
                clearInterval(nextIntId);
                if (!executeInt) {
                    // interval未执行 相当于快速单击
                    options.currentPage++;
                    options.currentPage = options.currentPage >= options.totalPage ? options.totalPage : options.currentPage;
                    _this.setNumList();
                }
                executeInt = false;
                if (options.clickCallBack) {
                    options.clickCallBack(options.currentPage, $(this))
                }
            }).mouseout(function () {
                clearInterval(nextIntId);
            });
            return $element;

        },
        setNumList: function () {
            /*
             * 计算数字显示方式
             * 前 后一页判断是否可用
             * 数字绑定事件
             *
             * */

            var liHtml = "";
            var _this = this;
            var options = _this.options;
            var $element = _this.$element;
            var firstCount = options.firstCount;
            var prevCount = options.prevCount;
            var nextCount = options.nextCount;
            var lastCount = options.lastCount;
            var currentPage = options.currentPage;
            var totalPage = options.totalPage;
            firstCount = parseInt(firstCount);
            prevCount = parseInt(prevCount);
            nextCount = parseInt(nextCount);
            lastCount = parseInt(lastCount);
            currentPage = parseInt(currentPage);
            totalPage = parseInt(totalPage);
            var showCount = firstCount + prevCount + nextCount + lastCount + 3;
            var isShowPrevEllipsis = currentPage - prevCount - firstCount > 1;
            var isShowNextEllipsis = currentPage + nextCount + lastCount < totalPage;
            //只显示前省略号 不显示后省略号
            if (isShowPrevEllipsis == true && isShowNextEllipsis == false) {
                if (totalPage > showCount) {
                    for (var i = 1; i <= firstCount; i++) {
                        liHtml += '<li><a href="javascript:;" class="page-num">' + i + '</a></li>'
                    }
                    liHtml += '<li class="disabled"><a href="javascript:;">…</a></li>'
                    for (var i = totalPage - lastCount - nextCount - prevCount - 1; i <= totalPage; i++) {
                        if (i == currentPage) {
                            liHtml += '<li class="active"><a href="javascript:;" class="page-num">' + i + '</a></li>'
                        } else {
                            liHtml += '<li><a href="javascript:;" class="page-num">' + i + '</a></li>'
                        }
                    }
                } else {
                    for (var i = 1; i <= totalPage; i++) {
                        if (i == currentPage) {
                            liHtml += '<li class="active"><a href="javascript:;" class="page-num">' + i + '</a></li>'
                        } else {
                            liHtml += '<li><a href="javascript:;" class="page-num">' + i + '</a></li>'
                        }
                    }
                }

            }
            //只显示后省略号不显示前省略号
            if (isShowPrevEllipsis == false && isShowNextEllipsis == true) {
                if (totalPage > showCount) {
                    for (var i = 1; i < nextCount + prevCount + firstCount + 3; i++) {
                        if (i == currentPage) {
                            liHtml += '<li class="active"><a href="javascript:;" class="page-num">' + i + '</a></li>'
                        } else {
                            liHtml += '<li><a href="javascript:;" class="page-num">' + i + '</a></li>'
                        }
                    }
                    liHtml += '<li class="disabled"><a href="javascript:;">…</a></li>'
                    for (var i = totalPage - lastCount + 1; i <= totalPage; i++) {
                        liHtml += '<li><a href="javascript:;" class="page-num">' + i + '</a></li>'
                    }
                } else {
                    for (var i = 1; i <= totalPage; i++) {
                        if (i == currentPage) {
                            liHtml += '<li class="active"><a href="javascript:;" class="page-num">' + i + '</a></li>'
                        } else {
                            liHtml += '<li><a href="javascript:;" class="page-num">' + i + '</a></li>'
                        }
                    }
                }

            }
            //前后省略号都不显示
            if (isShowPrevEllipsis == false && isShowNextEllipsis == false) {
                for (var i = 1; i <= totalPage; i++) {
                    if (i == currentPage) {
                        liHtml += '<li class="active"><a href="javascript:;" class="page-num">' + i + '</a></li>'
                    } else {
                        liHtml += '<li><a href="javascript:;" class="page-num">' + i + '</a></li>'
                    }
                }
            }
            //前后省略号都显示
            if (isShowPrevEllipsis == true && isShowNextEllipsis == true) {
                for (var i = 1; i <= firstCount; i++) {
                    liHtml += '<li><a href="javascript:;" class="page-num">' + i + '</a></li>'
                }
                liHtml += '<li class="disabled"><a href="javascript:;">…</a></li>'
                for (var i = currentPage - prevCount; i <= currentPage + nextCount; i++) {
                    if (i == currentPage) {
                        liHtml += '<li class="active"><a href="javascript:;"  class="page-num">' + i + '</a></li>'
                    } else {
                        liHtml += '<li><a href="javascript:;" class="page-num">' + i + '</a></li>'
                    }
                }
                liHtml += '<li class="disabled"><a href="javascript:;">…</a></li>'
                for (var i = totalPage - lastCount + 1; i <= totalPage; i++) {
                    liHtml += '<li><a href="javascript:;" class="page-num">' + i + '</a></li>'
                }
            }
            // 清空数字
            $element.find("li:not(.page-pn)").remove();
            // 加入新数字
            $element.find("li.page-prev").after(liHtml);
            // 计算前一页是否可用
            if (currentPage <= 1) {
                $element.find(".page-prev").addClass("disabled");
            } else {
                $element.find(".page-prev").removeClass("disabled");
            }
            // 计算后一页是否可用
            if (currentPage >= totalPage) {
                $element.find(".page-next").addClass("disabled");
            } else {
                $element.find(".page-next").removeClass("disabled");
            }
            // 数字绑定事件
            $element.find(".page-num").click(function () {
                options.currentPage = parseInt($(this).html());
                if (options.clickCallBack) {
                    options.clickCallBack(options.currentPage, $(this))
                }
                _this.setNumList();

            });
            return $element;
        },// end of function setNumList()
        getCurrentPage: function () {
            return this.options.currentPage;
        },
        getTotalPage: function () {
            return this.options.totalPage;
        },
        setCurrentPage: function (pageNum) {
            this.options.currentPage = pageNum;
            this.setNumList();
        },
        setTotalPage: function (totalPage) {
            this.options.totalPage = totalPage;
            this.setNumList();
        }
    };
    //在插件中使用插件对象
    $.fn.wPage = function (options, data) {
        if (this.length <= 0) return this
        //创建实体 使得同一个jQuery对象都使用同一个实体,便于数据的存取
        if (!this.data("_wPageObj_")) this.data("_wPageObj_", new plugInObj(this, options));
        var obj = this.data("_wPageObj_");

        if (options == undefined || typeof(options) == "object" && !$.isFunction(options)) {
            //所传参数为对象 初始化
            return obj.init();
        } else if (typeof(options) == "string") {
            //所传参数为字符串,执行相应的方法
            switch (options) {
                case "getCurrentPage":
                    return obj.getCurrentPage();
                    break;
                case "getTotalPage":
                    return obj.getTotalPage();
                    break;
                case "setCurrentPage":
                    return obj.setCurrentPage(data);
                    break;

                case "setTotalPage":
                    return obj.setTotalPage(data);
                    break;
                default:
                    return "No such method!"
            }
        }
    }
})(jQuery, window, document);