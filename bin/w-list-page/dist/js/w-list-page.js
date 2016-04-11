function listPage(options) {
    var defaults = {
        submitBtn: '#submit',
        paginationType: 'complex', // complex  simple
        url: '',
        tableWrap: '.table-wrap',
        ajaxDataField: 'table_data'
    };
    var simpleDataDefaults = {
        prevCursor: 0,
        nextCursor: 0,
        currentPage: 1,
        pageSize: 10,
        tableData: []
    };
    var complexDataDefaults = {
        currentPage: 1,
        totalPage: 0,
        pageSize: 10,
        tableData: []
    };
    /*
     showCheckbox: true,//是否显示checkbox列 默认true
     showRowIndex: false,//是否显示行号 默认true
     rowIndexStart: 1,//行号开始值 默认1
     columns: [],//各列的配置信息 默认[]
     tableData: [],//表格初始化数据
     operation: '',
     operationWidth: 100


     currentPage: 12,    // 当前页 默认 1
     totalPage: 108,     // 总页数 默认 1
     firstCount: 1,      // 1 ... 3 4 5 ... 108首页处预览页数 默认 1
     lastCount: 1,       // 1 ... 3 4 5 ... 108尾页处预览页数 默认 1
     prevCount: 2,       // 当前页前预览页数 默认 2
     nextCount: 6,       // 当前页后预览页数 默认 6
     */
    options = $.extend({}, defaults, options);
    var $tableWrap = $(options.tableWrap);
    var $submitBtn = $(options.submitBtn);
    var $searchForm = $('.search-bar form');
    var $toolBarBottom = $('.tool-bar-bottom');
    // 初始化分页
    if ('prevCursor' in options.data || 'nextCursor' in options.data) {
        options.paginationType = 'simple';
        options.data = $.extend({}, simpleDataDefaults, options.data);
    } else {
        options.paginationType = 'complex';
        options.data = $.extend({}, complexDataDefaults, options.data);
    }
    //两中分页方式都会用到current_page
    $searchForm.append('<input type="hidden" name ="current_page" value = "' + options.data.currentPage + '"/>');
    if (options.paginationType == 'complex') {
        $toolBarBottom.append('<div class="clear"></div>');
        var $paginationContainer = $('<div class="pull-left"></div>');
        $toolBarBottom.prepend($paginationContainer);
        options.totalPage = options.data.totalPage;
        options.currentPage = options.data.currentPage;
        options.clickCallBack = function (pageNum, $element) {
            $searchForm.find('input[name=current_page]').val(pageNum);
            loadDataByAjax.call($element);
        };
        $paginationContainer.wPage(options);
    } else if (options.paginationType == 'simple') {
        var prevDisabled = options.data.prevCursor ? '' : 'disabled';
        var nextDisabled = options.data.nextCursor ? '' : 'disabled';
        var $prevBtn = $('<div class="btn btn-default btn-ms pre ' + prevDisabled + '">上一页</div>');
        var $nextBtn = $('<div class="btn btn-default btn-ms next ' + nextDisabled + '">下一页</div>');
        $toolBarBottom.prepend($nextBtn);
        $toolBarBottom.prepend($prevBtn);
        $prevBtn.on('click', function () {
            // 点击上一页，只向后台发送pre_cursor数据，不发送next_cursor数据。
            $searchForm.find('input[name=next_cursor]').remove();
            var $prevCursor = $searchForm.find('input[name=prev_cursor]');
            if (!$prevCursor.length) {
                $prevCursor = $('<input type="hidden" name="prev_cursor" value="' + options.data.prevCursor + '"/>');
                $searchForm.append($prevCursor);
            }
            loadDataByAjax.call(this);
        });
        $nextBtn.on('click', function () {
            // 点击下一页，只向后台发送next_cursor数据，不发送pre_cursor数据。
            $searchForm.find('input[name=prev_cursor]').remove();
            var $nextCursor = $searchForm.find('input[name=next_cursor]');
            if (!$nextCursor.length) {
                $nextCursor = $('<input type="hidden" name="next_cursor" value="' + options.data.nextCursor + '"/>');
                $searchForm.append($nextCursor);
            }
            loadDataByAjax.call(this);
        });

    } else {
        $toolBarBottom.append('<div class="clear"></div>')
    }
    //计算表格高度
    computeTableHeight();
    //初始化表格
    options.tableData = options.data.tableData;
    $(".table-wrap").wTable(options);

    $(window).on('resize', function () {
        computeTableHeight();
    });
    //查询按钮事件
    $submitBtn.not('.disabled').on('click', function (e) {
        $searchForm.find('input[name=current_page]').val(1);
        $searchForm.find('input[name=prev_cursor]').remove();
        $searchForm.find('input[name=next_cursor]').remove();
        loadDataByAjax.call(this)
    });
    $searchForm.find('input').on('keydown', function (e) {
        if (e.keyCode == 13) {
            $submitBtn.trigger('click');
            return false;
        }
    });

    function computeTableHeight() {
        // table-wrap 上面可以有任意东西，通过offset().top计算上面整体高度，底部内容需要单独计算
        var windowHeight = $(window).height();
        var bottomHeight = $('.tool-bar-bottom').outerHeight();
        $tableWrap.height(windowHeight - $tableWrap.offset().top - bottomHeight - 3);
    }

    // ajax 载入数据
    function loadDataByAjax(opt) {
        if (!opt) opt = {};
        var formData = $('.search-bar form').serializeArray();
        var $this = $(this);
        if ($this.hasClass('disabled')) return false;
        $.ajax({
            method: 'GET',
            dataType: 'json',
            data: formData,
            url: options.url,
            beforeSend: function (XMLHttpRequest) {
                $.showPreloader();
                $this.addClass('disabled');
                if (opt.beforeSend) opt.beforeSend(XMLHttpRequest);
            },
            success: function (data, textStatus) {
                if (opt.success) opt.success(data, textStatus);
                if (options.paginationType == 'simple') {
                    options.data.prevCursor = data.prev_cursor;
                    options.data.nextCursor = data.next_cursor;
                    if ($searchForm.find('input[name=next_cursor]').length) {
                        options.data.currentPage++;
                    } else if ($searchForm.find('input[name=pre_cursor]').length) {
                        options.data.currentPage--;
                    } else {
                        options.data.currentPage = 1;
                    }
                }
                if (options.paginationType == 'complex') {
                    options.data.currentPage = data.current_page;
                    options.data.totalPage = data.total_page;
                    $paginationContainer.wPage('setCurrentPage', options.data.currentPage);
                    $paginationContainer.wPage('setTotalPage', options.data.totalPage);
                }
                $searchForm.find('input[name=current_page]').val(options.data.currentPage);
                var indexStart = options.data.pageSize * (options.data.currentPage - 1) + 1;
                $tableWrap.wTable('load', data[options.ajaxDataField], indexStart);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert(XMLHttpRequest.status + '：' + XMLHttpRequest.statusText);
            },
            complete: function (XMLHttpRequest, textStatus) {
                $.hidePreloader();
                $this.removeClass('disabled');
                if (options.paginationType == 'simple') {
                    var $prevCursor = $searchForm.find('input[name=prev_cursor]');
                    var $nextCursor = $searchForm.find('input[name=next_cursor]');
                    if ($prevCursor.length && $prevCursor.val()) {
                        $prevBtn.removeClass('disabled');
                    } else {
                        $prevBtn.addClass('disabled');
                    }
                    if ($nextCursor.length && $nextCursor.val()) {
                        $nextBtn.removeClass('disabled');
                    } else {
                        $nextBtn.addClass('disabled');
                    }
                }
                if (opt.complete) opt.complete(XMLHttpRequest, textStatus);
            }
        });
    }

    return $tableWrap;
}