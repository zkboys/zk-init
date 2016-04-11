# BootStrap分页

## 安装：
bower install w-page

或

git clone https://github.com/zkboys/w-page.git
## 使用：
```
<script src="dist/js/w-page.min.js"></script>
<div id="pagination-container"></div>
$('#pagination-container').wPage({
    currentPage: 12,    // 当前页 默认 1
    totalPage: 108,     // 总页数 默认 1
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
});
$('.get-current').click(function () {
    var currentPage = $('#pagination-container').wPage('getCurrentPage');
    alert(currentPage);
});
$('.get-total').click(function () {
    var totalPage = $('#pagination-container').wPage('getTotalPage');
    alert(totalPage);
});
$('.set-current').click(function () {
    $('#pagination-container').wPage('setCurrentPage', 25);
});
$('.set-total').click(function () {
    $('#pagination-container').wPage('setTotalPage', 50);
});
```
