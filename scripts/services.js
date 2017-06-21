angular.module('Services', [])
    .filter('label',['$sce',function ($sce) {
        return function (html) {
            if (typeof html== 'string')   //判断类型为字符串
                return $sce.trustAsHtml(html);
            return html;
        }
    }]);