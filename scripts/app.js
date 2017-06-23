var App = angular.module('GameBBS', ['ui.router', 'Controllers', 'Directive','Services']);
//$http的传递参数处理
App.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function (data) {
        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var param = function (obj) {
            var query = '';
            var name, value, fullSubName, subName, subValue, innerObj, i;

            for (name in obj) {
                value = obj[name];

                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value !== undefined && value !== null) {
                    query += encodeURIComponent(name) + '='
                        + encodeURIComponent(value) + '&';
                }
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        };

        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
}]);
//路由管理
App.config(["$stateProvider", function ($stateProvider) {
    $stateProvider
        .state("index", {
            url: '',
            views: {
                'header': {
                    templateUrl: 'views/home_header.html',
                },
                'content': {
                    templateUrl: 'views/home_content.html',
                    controller: 'HomeController'
                }
            }
        })
        .state("home", {
            url: '/home',
            views: {
                'header': {
                    templateUrl: 'views/home_header.html',
                },
                'content': {
                    templateUrl: 'views/home_content.html',
                    controller: 'HomeController'
                }
            }
        })
        .state("plus", {
            url: '/plus',
            views: {
                'header': {
                    templateUrl: 'views/plus_header.html',
                    controller: 'PlusController'
                },
                'content': {
                    templateUrl: 'views/plus.html',
                    controller: 'PlusController'
                }
            }
        })
        .state("message", {
            url: '/message',
            views: {
                'header': {
                    templateUrl: 'views/mine_header.html',
                    controller: 'MessageController'
                },
                'content': {
                    templateUrl: 'views/message.html',
                    controller: 'MessageController'
                }
            }
        })
        .state("mine", {
            url: '/mine',
            views: {
                'header': {
                    templateUrl: 'views/withback_header.html',
                    controller: 'MineController'
                },
                'content': {
                    templateUrl: 'views/mine.html',
                    controller: 'MineController'
                }
            }
        })
        .state("login", {
            url: '/login',
            views: {
                'header': {
                    templateUrl: 'views/mine_header.html',
                    controller: 'LoginController'
                },
                'content': {templateUrl: 'views/login.html'}
            }
        })
        .state('register', {
            url: '/register',
            views: {
                'header': {
                    templateUrl: 'views/mine_header.html',
                    controller: 'RegisterController'
                },
                'content': {
                    templateUrl: 'views/register.html',
                }
            }
        })
        .state('publish', {
            url: '/publish',
            views: {
                'header': {
                    templateUrl: 'views/publish_header.html',
                    controller: 'PublishController'
                },
                'content': {
                    templateUrl: 'views/pub_strategy.html',
                    controller: 'PublishController'
                }
            }
        })
        .state('strategies', {
            url: '/strategies',
            views: {
                'header': {
                    templateUrl: 'views/withback_header.html',
                    controller: 'StrategiesController'
                },
                'content': {
                    templateUrl: 'views/strategies_list.html',
                    controller: 'StrategiesController'
                }
            }
        })
        .state('search',{
            url:'/search/:search',
            views: {
                'header': {
                    templateUrl: 'views/plus_header.html',
                    controller: 'SearchController'
                },
                'content': {
                    templateUrl: 'views/strategies_list.html',
                    controller: 'SearchController'
                }
            }
        })
        .state('novice',{
            url:'/novice',
            views: {
                'header': {
                    templateUrl: 'views/withback_header.html',
                    controller: 'NoviceController'
                },
                'content': {
                    templateUrl: 'views/novice.html',
                    controller: 'NoviceController'
                }
            }
        })
        .state('follows', {
            url: '/follows',
            views: {
                'header': {
                    templateUrl: 'views/withback_header.html',
                    controller: 'FollowsController'
                },
                'content': {
                    templateUrl: 'views/follow.html',
                    controller: 'FollowsController'
                }
            }
        })
        .state('followed', {
            url: '/followed',
            views: {
                'header': {
                    templateUrl: 'views/withback_header.html',
                    controller: 'FollowedController'
                },
                'content': {
                    templateUrl: 'views/followed.html',
                    controller: 'FollowedController'
                }
            }
        })
        .state("user", {
            url: '/user/:uid',
            views: {
                'header': {
                    templateUrl: 'views/withback_header.html',
                    controller: 'UserController'
                },
                'content': {
                    templateUrl: 'views/user.html',
                    controller: 'UserController'
                }
            }
        })
        .state("myStrategy", {
            url: '/myStrategy',
            views: {
                'header': {
                    templateUrl: 'views/withback_header.html',
                    controller: 'MyStrategiesController'
                },
                'content': {
                    templateUrl: 'views/myStrategies.html',
                    controller: 'MyStrategiesController'
                }
            }
        })
        .state("myComment", {
            url: '/myComment',
            views: {
                'header': {
                    templateUrl: 'views/withback_header.html',
                    controller: 'MyCommentController'
                },
                'content': {
                    templateUrl: 'views/myStrategies.html',
                    controller: 'MyCommentController'
                }
            }
        })
        .state("mineInfo", {
            url: '/mineInfo',
            views: {
                'header': {
                    templateUrl: 'views/withback_header.html',
                    controller: 'UserInfoController'
                },
                'content': {
                    templateUrl: 'views/user_info.html',
                    controller: 'UserInfoController'
                }
            }
        })
        .state("unread", {
            url: '/unread',
            views: {
                'header': {
                    templateUrl: 'views/withback_header.html',
                    controller: 'UnreadController'
                },
                'content': {
                    templateUrl: 'views/unread.html',
                    controller: 'UnreadController'
                }
            }
        })
        .state("security", {
            url: '/security',
            views: {
                'header': {
                    templateUrl: 'views/withback_header.html',
                    controller: 'DealPswController'
                },
                'content': {
                    templateUrl: 'views/deal_password.html',
                    controller: 'DealPswController'
                }
            }
        })
        .state("strategy", {
            url: '/strategy/:sid',
            views: {
                'header': {
                    templateUrl: 'views/withback_header.html',
                    controller: 'StrategyController'
                },
                'content': {
                    templateUrl: 'views/strategy.html',
                    controller: 'StrategyController'
                }
            }
        })
}]);