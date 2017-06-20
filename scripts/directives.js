angular.module('Directive', [])
    .directive('backButton', function () {
        return {
            restrict: 'C',
            link: function (scope, element, attrs) {
                element.bind('click', goBack);
                function goBack() {
                    history.back();
                    scope.$apply();
                }
            }
        }
    });
