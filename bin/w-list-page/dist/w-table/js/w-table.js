;
(function ($, window, document, undefined) {
    //定义wTable的构造函数
    var wTableObj = function (ele, opt) {
        //调用者jQuery对象
        this.$element = ele;
        //默认值
        this.tableDefaults = {
            showCheckbox: true,//是否显示checkbox列 默认true
            showRowIndex: false,//是否显示行号 默认false
            rowIndexStart: 1,//行号开始值 默认1
            columns: [],//各列的配置信息 默认[]
            tableData: [],//表格初始化数据
            operationWidth: 100,
            operation: null,
            primaryKey: "id"//主键，每行具有唯一性
        };
        this.columnDefaults = {
            name: 'columnName',// 表头名称
            title: '',
            field: 'columnField',// 字段名称
            width: '100%',//列宽,100 '100px' '20%'。
            minWidth: 50,// 自适应列的最小宽度，只有自适应列才起作用。
            align: "left",// 排列方式
            valueFilter: function (value, rowData, tableData) {
                return value;
            }

        };

        //各个函数可以更改这个对象中的值,便于各个函数之间的数据传递.
        //因为"引用",一处修改,其他处都可见.
        this.options = $.extend({}, this.tableDefaults, opt);
        var columns = this.options.columns;
        var colLength = columns.length;

        for (var ci = 0; ci < colLength; ci++) {
            var col = columns[ci];
            columns[ci] = $.extend({}, this.columnDefaults, col);
        }
        var opWidth = this.options.operationWidth;
        this.options.operationWidth = typeof(opWidth) == "number" ? opWidth + "px" : opWidth;
    };
    //定义wTable的方法
    wTableObj.prototype = {
        /*
         * 初始化 数据载入表格
         *
         * */
        init: function () {
            // 将所有数据以data的方式,绑定到具体元素上.data中的数据也是引用,它的改变会影响到原始对象.
            // 将wTableObj中的数据存放到变量中,防止this乱用.
            var _this = this;
            var options = _this.options;
            var columns = options.columns;
            var tableData = options.tableData;
            // 创建结构
            var $wrap = _this.$element;
            var tableClass = 'w-table table table-hover table-bordered table-striped';
            $wrap.html($('<div class="top"><table class="' + tableClass + '"></table></div><div class="center"><table class="' + tableClass + '"></table></div>'));
            var $dataTable = $wrap.find('.center table');
            var $top = $wrap.find('.top');
            var $center = $wrap.find('.center');
            //表头处理
            var $thead = $('<thead><tr></tr></thead>');
            //添加行号
            if (options.showRowIndex) {
                var indexOpt = {
                    isIndex: true,
                    name: '#',// 表头名称
                    field: 'columnField-index',// 字段名称
                    width: 40,
                    align: "center"
                };
                indexOpt = $.extend({}, _this.columnDefaults, indexOpt);
                columns.unshift(indexOpt);
            }
            // 添加checkbox列
            if (options.showCheckbox) {
                var checkOpt = {
                    isCheck: true,
                    name: '<input type="checkbox" value="main"/>',
                    field: 'columnField-check',
                    width: 40,
                    align: "center"
                };
                checkOpt = $.extend({}, _this.columnDefaults, checkOpt);
                columns.unshift(checkOpt);
            }
            // 添加操作列
            if (options.operation) {
                var operationOpt = {
                    isOperation: true,
                    name: '操作',
                    field: 'columnField-operation',
                    width: options.operationWidth,
                    align: "center"
                };
                operationOpt = $.extend({}, _this.columnDefaults, operationOpt);
                columns.push(operationOpt);
            }

            //添加列
            var colLength = columns.length;
            for (var ci = 0; ci < colLength; ci++) {
                var col = columns[ci];
                var width = col.width;
                var widthStr = '';
                var autoWidthClass = 'auto-width';
                if (width != null) {
                    width = typeof(width) == "number" ? width + "px" : width;
                    col.width = width;
                    widthStr = 'width:' + width + ';';
                    if (width.indexOf('%') < 0) {
                        autoWidthClass = "";
                    }
                }
                col.widthStr = widthStr;
                col.autoWidthClass = autoWidthClass;
                var title = col.title ? col.title : $('<div>' + col.name + '</div>').text();
                var $th = $('<th class="' + autoWidthClass + '" style="' + widthStr + '" title="' + title + '">' + col.name + '</th>');
                $th.data("colOpt", col);
                $thead.find("tr").append($th);
            }
            $top.find('table').html($thead);

            //载入数据
            _this.load(tableData);
            //事件绑定
            /*
             $ele     //表格
             $thead   //表头
             $tbody   //表体
             */
            // checkbox事件绑定 checkbox过小，是否可以考虑把事件绑定到th td上。
            if (options.showCheckbox) {
                $thead.find('tr th input[type=checkbox][value=main]').iCheck({
                    checkboxClass: 'icheckbox_square-blue',
                    radioClass: 'iradio_square-blue',
                    increaseArea: '20%' // optional</span>
                }).on('ifChecked', function (event) {
                    $('td.w-table-check input[type=checkbox]').iCheck('check');
                }).on('ifUnchecked', function () {
                    $('td.w-table-check input[type=checkbox]').iCheck('uncheck');
                });
            }

            $center.on('scroll', function () {
                var sLeft = $(this).scrollLeft();
                $top.scrollLeft(sLeft);
            });

            computeHeight();
            computeCellWidth();
            //var st = null;
            $(window).on('resize', function () {
                computeHeight();
                computeCellWidth();
                /*if (st)window.clearTimeout(st);
                 st = setTimeout(function () {
                 computeHeight();
                 }, 100);*/

            });
            function computeHeight() {
                var $headTable = $top.find('table');
                var wrapHeight = $wrap.height();
                var headHeight = $headTable.height();
                $center.css({
                    height: (wrapHeight - headHeight) + 'px'
                });
            }

            function computeCellWidth() {
                var $ths = $top.find('table th');
                var totalWidth = 0;
                var tableWidth = $top.find('table').width();
                $ths.each(function (k, v) {
                    var colOpt = $(v).data('colOpt');
                    var width = colOpt.width;
                    if (colOpt.autoWidthClass) {
                        width = colOpt.minWidth;
                    }
                    width = parseInt(width);
                    totalWidth += width;
                });
                if (tableWidth < totalWidth) {
                    $ths.each(function (k, v) {
                        var $th = $(v);
                        if (!$th.hasClass('auto-width')) {
                            return true;
                        }
                        var colOpt = $th.data('colOpt');
                        var minWidth = parseInt(colOpt.minWidth) + 'px';
                        $th.css('width', minWidth)
                        $center.find('table tr td:eq(' + k + ')').css('width', minWidth);
                    });
                } else {
                    $ths.each(function (k, v) {
                        var $th = $(v);
                        if (!$th.hasClass('auto-width')) {
                            return true;
                        }
                        var colOpt = $th.data('colOpt');
                        $th.css('width', colOpt.width);
                        $center.find('table tr td:eq(' + k + ')').css('width', colOpt.width);
                    });
                }
                $ths.each(function (k, v) {
                    var $th = $(v);
                    var colOpt = $th.data('colOpt');
                    var width = $th.width();
                    if (colOpt.autoWidthClass) {
                        var minWidth = parseInt(colOpt.minWidth);
                        if (width < minWidth) {
                            $th.css('width', minWidth);
                            $center.find('table tr td:eq(' + k + ')').css('width', minWidth);
                        }
                    }
                });
            }

            return $wrap;
        },
        load: function (tableData, rowIndexStart) {
            /*
             * 载入数据
             *
             * */
            var _this = this;
            var $wrap = _this.$element;
            var $top = $wrap.find('.top');
            var $dataTable = _this.$element.find('.center table');
            var options = _this.options;
            var columns = options.columns;
            options.rowIndexStart = rowIndexStart ? rowIndexStart : options.rowIndexStart;
            var $tbody = $dataTable.find("tbody");
            if ($tbody.length <= 0) {
                $tbody = $('<tbody></tbody>');
                $dataTable.append($tbody);
            } else {
                //清空数据
                $tbody.html('');
            }
            //添加数据
            var rowsLength = tableData.length;
            for (var rowIndex = 0; rowIndex < rowsLength; rowIndex++) {
                var rowData = tableData[rowIndex];
                var $tr = $('<tr></tr>');
                $tr.data("rowData", rowData);
                //添加数据
                var columnLength = columns.length;
                for (var i = 0; i < columnLength; i++) {
                    var col = columns[i];
                    var field = col.field;
                    var align = col.align;
                    var width = col.width;
                    var valueFilter = col.valueFilter;
                    var value = rowData[field];
                    var tdClass = 'w-table-cell';
                    if (col.isCheck) {
                        tdClass = 'w-table-check';
                        var primaryValue = rowData[options.primaryKey];
                        value = '<input type="checkbox" name="rowIndex" value="' + primaryValue + '">'
                    }
                    if (col.isIndex) {
                        tdClass = 'w-table-index';
                        value = rowIndex + parseInt(options.rowIndexStart);
                    }
                    if (col.isOperation) {
                        tdClass = 'w-table-operation';
                        value = options.operation(rowData, tableData);
                    }
                    value = valueFilter(value, rowData, tableData);
                    var title = ' title="' + $('<div>' + value + '</div>').text() + '" ';// value有可能是富文本。
                    if (typeof(value) == 'string' && value.indexOf('<img') >= 0) {
                        title = '';
                    }
                    var $td = $('<td class="' + tdClass + ' ' + col.autoWidthClass + '" style="' + col.widthStr + 'text-align:' + align + '" ' + title + '>' + value + '</td>');
                    $td.data("colOpt", col);
                    $tr.append($td);
                }

                $tbody.append($tr);
            }// 数据载入完毕
            //处理checkbox
            if (options.showCheckbox) {
                // 清空表头选框状态
                var mainCheck = $top.find('thead tr th input[type=checkbox][value=main]');
                mainCheck.iCheck('uncheck');
                //为表格中的选框初始化
                $('td.w-table-check input[type=checkbox]').iCheck({
                    checkboxClass: 'icheckbox_square-blue',
                    radioClass: 'iradio_square-blue',
                    increaseArea: '20%' // optional</span>
                }).on('ifChecked', function () {
                    var $this = $(this);
                    var primaryKeyValue = $this.val();
                    var rowData = $this.parents('tr').data('rowData');
                    var selectedRows = $wrap.data('selectedRows') || {};
                    selectedRows[primaryKeyValue] = rowData;
                    $wrap.data('selectedRows', selectedRows);
                }).on('ifUnchecked', function () {
                    var selectedRows = $wrap.data('selectedRows') || {};
                    var $this = $(this);
                    var primaryKeyValue = $this.val();
                    delete selectedRows[primaryKeyValue];
                });
                var selectedRows = $wrap.data('selectedRows') || {};
                for (var primaryKeyValue in selectedRows) {
                    $dataTable.find('td.w-table-check input[type=checkbox][value=' + primaryKeyValue + ']').iCheck('check');
                }
            }
            return _this.$element;

        },
        deleteRow: function ($row) {
            var _this = this;
            var $wrap = _this.$element;
            var selectedRows = $wrap.data('selectedRows');
            var primaryKeyValue = $row.find('td.w-table-check input[type=checkbox]').val();
            if (selectedRows) {
                delete selectedRows[primaryKeyValue];
                $wrap.data('selectedRows', selectedRows);
            }
            $row.remove();
            return $wrap;
        },
        deleteSelectedRows: function () {
            var _this = this;
            var $wrap = _this.$element;
            var $top = $wrap.find('.top');
            var $dataTable = $wrap.find('.center table');
            var selectedRows = $wrap.data('selectedRows') || {};
            for (var primaryKeyValue in selectedRows) {
                $dataTable.find('td.w-table-check input[type=checkbox][value=' + primaryKeyValue + ']').parents('tr').remove();
            }
            var mainCheck = $top.find('thead tr th input[type=checkbox][value=main]');
            mainCheck.iCheck('uncheck');
            $wrap.data('selectedRows', null);
            //_this.rebuildRowsIndex();
            return $wrap;
        },
        getSelectedRowsData: function () {
            /*
             * 获取选中的行
             * return：所欲选中的数据，包括翻页的数据
             * */
            var _this = this;
            var $wrap = _this.$element;
            return $wrap.data('selectedRows') || null;
        },
        rebuildRowsIndex: function () {
            /*
             * 由于删除,添加行,导致行的索引改变,需要重构跟索引相关的数据
             * */
            var _this = this;
            var $dataTable = _this.$element.find('.center table');
            var options = _this.options;
            $dataTable.find("tbody tr").each(function (k, v) {
                var newIndex = $(v).index();
                //更改显示的索引
                $(v).find("td.w-table-index").html(newIndex + options.rowIndexStart);
            });

        }
    };
    //在插件中使用wTable对象
    $.fn.wTable = function (options) {
        //jQuery对象不存在,直接返回
        if (this.length <= 0) return this;
        //创建wTable的实体 使得同一个jQuery对象都使用同一个wTableObj实体,便于数据的存取
        if (!this.data("_wtObj_")) this.data("_wtObj_", new wTableObj(this, options));
        var wtObj = this.data("_wtObj_");

        if (options == undefined || typeof(options) == "object" && !$.isFunction(options)) {
            //所传参数为对象 初始化
            return wtObj.init();
        } else if (typeof(options) == "string") {
            //所传参数为字符串,执行相应的方法
            switch (options) {
                case "load":
                    //检测有没有其他参数
                    var tableData = arguments[1];
                    var rowIndexStart = arguments[2];
                    return wtObj.load(tableData, rowIndexStart);
                    break;
                case "getSelectedRowsCount":
                    var count = 0;
                    var rowsData = wtObj.getSelectedRowsData();
                    if (rowsData) {
                        for (var v in rowsData) {
                            count++;
                        }
                    }
                    return count;
                    break;
                case "getSelectedRowsData":
                    var rowsData = wtObj.getSelectedRowsData();
                    var hasProp = false;
                    for (var prop in rowsData) {
                        hasProp = true;
                        break;
                    }
                    if (hasProp) {
                        return rowsData;
                    } else {
                        return null;
                    }
                    break;
                case "getSelectedRowsPrimaryKey":
                    var rowsData = wtObj.getSelectedRowsData();
                    var values = null;
                    if (rowsData) {
                        values = [];
                        for (var v in rowsData) {
                            values.push(v);
                        }
                    }
                    if (values && values.length > 0) {
                        return values;
                    } else {
                        return null;
                    }
                    break;

                case "deleteSelectedRows":
                    return wtObj.deleteSelectedRows();
                    break;
                case "deleteRow":
                    return wtObj.deleteRow(arguments[1]);
                    break;
                default:
                    throw "No such method!";
                    return this
            }
        }
    }
})(jQuery, window, document);