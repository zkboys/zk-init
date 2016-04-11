/*
 * 需要修改BootStrap modal.js 的源码，解决隐藏弹框，body有滚动条时，弹框有个左移动的bug
 * */
;
(function ($, window, document, undefined) {
    function wModal(options) {
        var defaults = {
            title: '友情提示',
            content: '',
            buttons: ['<button type="button" class="btn btn-success w-sure" >确定</button>'],
            showAnimate: true,
            autoClose: true,
            size: 'sm',// sm md lg
            onOpened: function () {
            },
            onClosed: function () {
            },
            sureCallBack: function () {
            },
            cancelCallBack: function () {
            }

        };
        options = $.extend({}, defaults, options);
        options.size = 'modal-' + options.size;
        var fade = options.showAnimate ? "fade" : "";
        var wModal_id = "wModal" + ($(".wModal").length + 1);
        var modalHtml = ''
            + '<div class="modal wModal ' + fade + ' " id="' + wModal_id + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'
            + '<div class="modal-dialog ' + options.size + '">'
            + '<div class="modal-content">'
            + '<div class="modal-header">'
            + '<button type="button" class="close w-close" ><span aria-hidden="true">&times;</span><span class="sr-only">关闭</span></button>'
            + '<h4 class="modal-title" id="wModalLabel">' + options.title + '</h4>'
            + '</div>'
            + '<div class="modal-body">'
            + options.content
            + '</div>'
            + (function () {
                if (options.buttons && options.buttons.length > 0) {
                    return '<div class="modal-footer">'
                        + options.buttons.join("")
                        + '</div>'
                } else {
                    return "";
                }
            })()
            + '</div>'
            + '</div>'
            + '</div>';
        var $body = $('body');
        $body.append(modalHtml);
        var modal = $('#' + wModal_id), isSure, isCancel, isClose;
        var bodyOldOverFlow = $body.css('overflow');//修复BootStrap 弹框隐藏的时候，由于body滚动条切换时机不对（并不是在动画结束时切换），引起弹框左移bug。
        modal.modal({
            keyboard: true,
            backdrop: true,
            show: true
        });
        if (options.showAnimate) {
            modal.on('shown.bs.modal', function (e) {//非动画情况下，这个事件不触发
                options.onOpened.call(modal);
            });
        } else {
            options.onOpened.call(modal);
        }
        function getValue() {
            var value, $input = modal.find('input.modal-input'), $textarea = modal.find('textarea.modal-textarea');
            if ($input.length) {
                value = $input.val();
            }
            if ($textarea.length) {
                value = $textarea.val();
            }
            return value;
        }

        modal.on('hidden.bs.modal', function (e) {
            var value = getValue();
            if (isSure && options.autoClose) {
                options.sureCallBack.call(modal, value);
            }
            if (isCancel) {
                options.cancelCallBack.call(modal, value);
            }
            options.onClosed.call(modal, value);
            modal.remove();
        });
        modal.find(".w-sure").click(function () {
            isSure = true;
            if (options.autoClose) {
                modal.modal('hide');
            } else {
                var value = getValue();
                options.sureCallBack.call(modal, value);
            }
        });
        modal.find(".w-cancel").click(function () {
            isCancel = true;
            modal.modal('hide');

        });
        modal.find(".w-close").click(function () {
            isClose = true;
            modal.modal('hide');
        });
        return modal;
    }

    $.extend({//以下所有的回调方法中 $(this) 指向的是当前modal
        wModal: wModal,
        alert: function (text, title, callbackOk) {
            if (typeof title === 'function') {
                callbackOk = arguments[1];
                title = undefined;
            }
            wModal({
                title: title,
                content: text,
                sureCallBack: callbackOk
            });
        },
        alertSuccess: function (text, title, callbackOk) {
            if (typeof title === 'function') {
                callbackOk = arguments[1];
                title = undefined;
            }
            var content = '<div style="text-align: center"><span class="glyphicon glyphicon-ok" style="color:green;font-size:40px;"></span></div><div style="text-align: center;color:green;">' + text + '</div>';
            $.alert(content, title, callbackOk)
        },
        alertFail: function (text, title, callbackOk) {
            if (typeof title === 'function') {
                callbackOk = arguments[1];
                title = undefined;
            }
            var content = '<div style="text-align: center"><span class="glyphicon glyphicon-remove" style="color:red;font-size:40px;"></span></div><div style="text-align: center;color:red;">' + text + '</div>';
            $.alert(content, title, callbackOk)
        },
        confirm: function (text, title, callbackOk, callbackCancel) {
            if (typeof title === 'function') {
                callbackCancel = arguments[2];
                callbackOk = arguments[1];
                title = undefined;
            }
            wModal({
                title: title,
                content: text,
                buttons: [
                    '<button type="button" class="btn btn-success w-sure" >确定</button>',
                    '<button type="button" class="btn btn-danger w-cancel" >关闭</button>'
                ],
                sureCallBack: callbackOk,
                cancelCallBack: callbackCancel
            });
        },
        showPreloader: function () {//TODO 有待于优化，body滚动条的处理，参考BootStrap modal.js源码
            if ($('#pre-loader').length == 0) {// TODO 集体项目修改图片路径
                $('body').append('<div id="pre-loader" style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:9999;background:rgba(0,0,0,0.5);text-align:center;"><img src="../img/load.gif" style="position:absolute;top:50%;" alt=""/></div>')
            }
        },
        hidePreloader: function () {
            $('#pre-loader').remove();
        },
        toast: function (text, title, closeCallBack) {
            if (typeof title === 'function') {
                closeCallBack = arguments[1];
                title = undefined;
            }
            var modal = wModal({
                title: title,
                content: text,
                buttons: [],
                onClosed: closeCallBack
            });
            setTimeout(function () {
                modal.modal('hide');
            }, 1500);
        },
        toastSuccess: function (text, title, closeCallBack) {
            if (typeof title === 'function') {
                closeCallBack = arguments[1];
                title = undefined;
            }
            var content = '<div style="text-align: center"><span class="glyphicon glyphicon-ok" style="color:green;font-size:40px;"></span></div><div style="text-align: center;color:green;">' + text + '</div>';
            $.toast(content, title, closeCallBack);
        },
        toastFail: function (text, title, closeCallBack) {
            if (typeof title === 'function') {
                closeCallBack = arguments[1];
                title = undefined;
            }
            var content = '<div style="text-align: center;"><span class="glyphicon glyphicon-remove" style="color:red;font-size:40px;"></span></div><div style="text-align: center;color:red;">' + text + '</div>';
            $.toast(content, title, closeCallBack);
        },
        promptInput: function (text, title, callbackOk, callbackCancel) {
            if (typeof title === 'function') {
                callbackCancel = arguments[2];
                callbackOk = arguments[1];
                title = undefined;
            }
            var content = '<input class="modal-input" style="width:100%;" placeholder="' + text + '"/>';
            wModal({
                title: title,
                content: content,
                size: 'md',
                buttons: [
                    '<button type="button" class="btn btn-success w-sure" >确定</button>',
                    '<button type="button" class="btn btn-danger w-cancel" >关闭</button>'
                ],
                onOpened: function () {
                    $(this).find('input.modal-input').focus();
                },
                sureCallBack: callbackOk,
                cancelCallBack: callbackCancel
            });
        },
        promptTextArea: function (text, title, callbackOk, callbackCancel) {
            if (typeof title === 'function') {
                callbackCancel = arguments[2];
                callbackOk = arguments[1];
                title = undefined;
            }
            var content = '<div style="padding-bottom:5px;">' + text + '：</div><textarea class="modal-textarea" style="width:100%;" rows="8" placeholder="' + text + '"></textarea>';
            wModal({
                title: title,
                content: content,
                size: 'md',
                buttons: [
                    '<button type="button" class="btn btn-success w-sure" >确定</button>',
                    '<button type="button" class="btn btn-danger w-cancel" >关闭</button>'
                ],
                onOpened: function () {
                    $(this).find('textarea.modal-textarea').focus();
                },
                sureCallBack: callbackOk,
                cancelCallBack: callbackCancel
            });
        }
    })
})(jQuery, window, document);