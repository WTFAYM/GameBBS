//实例一个模块，用来专门管理所有控制器
angular.module('Controllers', [])
    .controller('LoginController', ['$scope', '$http', '$rootScope', '$state', function ($scope, $http, $rootScope, $state) {
        $scope.title = "登录";
        $http.get('php/isLogin.php').then(function (response) {
            if (response.data.code == 1) {
                $state.go('mine');
            }
        });
        if ($rootScope.loginuser != null) {
            $scope.user = $rootScope.uid;
        } else {
            $scope.user = '';
        }
        $scope.login = function () {
            var user = $scope.user;
            var psw = $scope.psw;
            var remember = $scope.remember;

            if (user == null || psw == null) {
                return;
            }
            $http({
                method: 'post',
                url: 'php/login.php',
                data: {user: user, psw: psw}
            }).then(function (response) {
                if (response.data.code == 1) {
                    $rootScope.uid
                    if (remember) {
                        //记住标记
                        $rootScope.remember = true;
                    }
                    $state.go('mine');
                } else {
                    alert('用户名或密码错误！');
                }
            }, function (reject) {

            });
        };
    }])
    .controller('RegisterController', ['$scope', '$http', '$rootScope', '$state', function ($scope, $http, $rootScope, $state) {
        $scope.title = "注册";
        $scope.checkaccount = function () {
            var account = $scope.phone;
            if (account.length < 11) {
                return;
            }
            $http.post('php/checkaccount.php', {account: account}).then(function (reponse) {
                if (reponse.data.code == 0) {
                    //    用户已存在
                    alert("用户已存在")
                }
            }, function (error) {

            });
        };
        $scope.checkrepsw = function () {
            var user = $scope.user;
            var psw = $scope.psw;
            var repsw = $scope.repsw;
            if (psw != repsw) {
                $scope.wrongpsd = true;
                return;
            }
            $scope.wrongpsd = false;
        };
        $scope.register = function () {
            var user = $scope.phone;
            var psw = $scope.psw;
            var repsw = $scope.repsw;
            var gender = $scope.gender;
            if (psw != repsw) {
                return;
            }
            $http({
                method: 'post',
                url: 'php/register.php',
                data: {user: user, psw: psw, gender: gender}
            }).then(function (reponse) {
                if (reponse.data.code == 1) {
                    $state.go('mine');
                    $rootScope.uid = user;
                }
            })
        }
    }])
    .controller('DealPswController', ['$scope', '$http', '$rootScope', '$state', function ($scope, $http, $rootScope, $state) {
        $scope.title = "账号安全";
        $scope.checkOld = function () {
            var oldpsw = $scope.oldpsw;
            $http.post('php/checkPsw.php', {old: oldpsw}).then(function (response) {
                if (response.data.code == 0) {
                    alert("旧密码有错！");
                }
            });
        };
        $scope.checkrepsw = function () {
            var psw = $scope.psw;
            var repsw = $scope.repsw;
            if (psw != repsw) {
                $scope.wrongpsd = true;
                return;
            }
            $scope.wrongpsd = false;
        };
        $scope.changePsw = function () {
            var old = $scope.oldpsw;
            var psw = $scope.psw;
            var repsw = $scope.repsw;
            if (psw != repsw) {
                return;
            }
            if (old == psw) {
                alert("密码修改成功！");
                $state.go('mine');
                return;
            }
            $http({
                method: 'post',
                url: 'php/changPsw.php',
                data: {psw: psw}
            }).then(function (reponse) {
                if (reponse.data.code == 1) {
                    alert("密码修改成功！")
                    $state.go('mine');
                }
            })
        };
    }])
    .controller('MineController', ['$scope', '$http', '$rootScope', '$state', function ($scope, $http, $rootScope, $state) {
        $scope.title = "我的";
        var user;
        $http.get('php/isLogin.php').then(function (response) {
            if (response.data.code == 1) {
                $scope.exist = true;
                user = response.data.data;
                $scope.username = user.username;
                $scope.gender = user.gender;
                $scope.img = user.img;
                var uid = user.uid;
                $rootScope.uid = user.uid;
                $http({
                    method: 'post',
                    url: 'php/followCount.php',
                    data: {uid: uid}
                }).then(function (response) {
                    if (response.data.code == 1) {
                        $scope.followed = response.data.data[1];
                        $scope.follows = response.data.data[0];
                    }
                });
            }
            else {
                $scope.exist = false;
                $scope.gender = 0;
                $scope.followed = 0;
                $scope.follows = 0;
                $scope.img = "public/images/login.jpg";
            }
        });
        $scope.toFollows = function () {
            if ($scope.follows <= 0) {
                return;
            }
            $state.go('follows');
        };
        $scope.toFollowed = function () {
            if ($scope.followed <= 0) {
                return;
            }
            $state.go('followed');
        };
        //查看当前用户发布的攻略
        $scope.toStrategies = function () {
            if (user == null) {
                return;
            }
            $state.go('myStrategy');
        };
        //查看当前用户的评论
        $scope.toComment = function () {
            if (user == null) {
                return;
            }
            $state.go('myComment');
        };

        $scope.toSecurity = function () {
            if (user == null) {
                return;
            }
            $state.go('security');
        };
        $scope.toInfo = function () {
            if (user == null) {
                return;
            }
            $state.go('mineInfo');
        };
        $scope.signout = function () {
            $http.get('php/quit.php');
            $rootScope.uid = null;
            $scope.exist = false;
            $scope.gender = 0;
            $state.go('login');
        }
    }])

    .controller('FollowsController', ['$scope', '$http', '$state', function ($scope, $http, $state) {
        $scope.title = "我的关注";
        $scope.toUser = function (UserID) {
            //通用户uid进入到相应的user界面
            //使用$state.go('User',{uid:UserID})
            $state.go('user', {uid: UserID});
        };
        $scope.cancelFollow = function (uid, uname) {
            if (!confirm("确定取消关注用户" + uname + "？")) {
                return;
            }
            $http.post('php/cancelFollow.php', {uid: uid}).then(function (response) {
                if (response.data.code == 1) {
                    $scope.follows = response.data.data;
                }
            });
        };
        $http({
            method: 'post',
            url: 'php/getFollows.php',
            data: {type: 1}
        }).then(function (response) {
            if (response.data.code == 1) {
                $scope.follows = response.data.data;
            } else {

            }
        });
    }])
    .controller('FollowedController', ['$scope', '$http', '$state', function ($scope, $http, $state) {
        $scope.title = "关注我的";
        $scope.toUser = function (UserID) {
            //通用户uid进入到相应的user界面
            //使用$state.go('User',{uid:UserID})
            $state.go('user', {uid: UserID});
        }
        $http({
            method: 'post',
            url: 'php/getFollows.php',
            data: {type: 2}
        }).then(function (response) {
            if (response.data.code == 1) {
                $scope.follows = response.data.data;
            } else {

            }
        });
    }])
    .controller('MyStrategiesController', ['$scope', '$http', '$state', '$rootScope', function ($scope, $http, $state, $rootScope) {
        $scope.title = "我的攻略";
        var user = $rootScope.uid;
        if (user == null) {
            $http.get('php/isLogin.php').then(function (response) {
                if (response.data.code == 1) {
                    user = response.data.data.uid;
                }
            })
        }
        $http.post('php/getMyStrategies.php', {type: 1}).then(function (response) {
            if (response.data.code == 1) {
                $scope.strategies = response.data.data;
            }
        });
        $scope.toDetail = function (sid) {
            $state.go('strategy', {sid: sid});
        }
    }])
    .controller('MyCommentController', ['$scope', '$http', '$state', '$rootScope', function ($scope, $http, $state, $rootScope) {
        $scope.title = "回复过的攻略";
        var user = $rootScope.uid;
        if (user == null) {
            $http.get('php/isLogin.php').then(function (response) {
                if (response.data.code == 1) {
                    user = response.data.data.uid;
                }
            })
        }
        $http.post('php/getMyStrategies.php', {type: 2}).then(function (response) {
            if (response.data.code == 1) {
                $scope.strategies = response.data.data;
            }
        });
        $scope.toDetail = function (sid) {
            $state.go('strategy', {sid: sid});
        }
    }])
    .controller('UserController', ['$scope', '$http', '$state', '$stateParams', function ($scope, $http, $state, $stateParams) {
        $scope.title = "用户信息";
        var uid = $stateParams.uid;
        $scope.tofollow = function () {
            $http({
                method: 'post',
                url: 'php/follow.php',
                data: {uid: uid, type: 0}
            }).then(function (response) {
                if (response.data.code == 1) {
                    $scope.follow = 1;
                } else {
                    alert("您还没有登录！");
                }
            });
        };
        $scope.tocanFollow = function () {
            $http({
                method: 'post',
                url: 'php/follow.php',
                data: {uid: uid, type: 1}
            }).then(function (response) {
                if (response.data.code == 1) {
                    $scope.follow = 0;
                } else {
                    alert("您还没有登录！");
                }
            });
        };
        $scope.toDetail = function (sid) {
            $state.go('strategy', {sid: sid});
        };
        $http({
            method: 'post',
            url: 'php/getUserInfo.php',
            data: {uid: uid}
        }).then(function (response) {
            if (response.data.code == 1) {
                $scope.user = response.data.data;
                $scope.follow = response.data.data2;
                $scope.strategies = response.data.data3;
            } else {
                $scope.follow = 0;
            }
        });
    }])
    .controller('UserInfoController', ['$scope', '$http', '$state', function ($scope, $http, $state) {
        $scope.title = "个人资料";
        var user;
        $http.get('php/isLogin.php').then(function (response) {
            if (response.data.code == 1) {
                $scope.exist = true;
                user = response.data.data;
                $scope.username = user.username;
                $scope.gender = user.gender;
                $scope.img = user.img;
                var uid = user.uid;
            }
            else {
                $scope.gender = 0;
                $scope.img = "public/images/login.jpg";
            }
        });
        $scope.saveReport = function (ele) {
            $scope.files = ele.files;
            $scope.$apply(); //传播Model的变化。
            var fd = new FormData();
            var file = document.querySelector('input[type=file]').files[0];
            var filename = $scope.files[0].name;
            if (filename.length > 1 && filename) {
                var fsrc;
                fsrc = getFileUrl("myfile");
                convertImgToBase64(fsrc, function (base64Img) {
                    $http.post('php/uploadimg.php', {image: base64Img}).then(function (response) {
                        if (response.data.code == 100) {
                            $scope.img = response.data.data.url;
                        }
                    });
                });
            }
        };
        $scope.changInfo = function () {
            var username = $scope.username;
            var gender = $scope.gender;
            var img = $scope.img;
            if (username == user.username && gender == user.gender && img == user.img) {
                alert("修改成功！");
                $state.go('mine');
                return;
            }
            $http.post('php/updateInfo.php', {username: username, gender: gender, img: img}).then(function (response) {
                if (response.data.code == 1) {
                    alert("修改成功！");
                    $state.go('mine');
                }
            });
        }
    }])
    .controller('PlusController', ['$scope', '$http', '$state', function ($scope, $http, $state) {
        $scope.getTips = function () {
            var text = $scope.searchtext;
            if (text == null || text.length == 0) {
                return;
            }
            setTimeout(function () {
                if (text == $scope.searchtext) {
                    $http.post('php/getTip.php', {text: text}).then(function (response) {
                        if (response.data.code == 1) {
                            $scope.tips = response.data.data;
                        } else {
                            $scope.tips = null;
                        }
                    })
                }
                else {
                    return;
                }
            }, 700);
        };
        $scope.toStrategy = function (sid) {
            $state.go('strategy', {sid: sid});
        };
        $scope.search = function () {
            var text = $scope.searchtext;
            if (text == null || text.length == 0) {
                return;
            }
            $state.go('search', {search: text});
        };
    }])
    .controller('SearchController', ['$scope', '$http', '$state', '$rootScope', '$stateParams', function ($scope, $http, $state, $rootScope, $stateParams) {
        var stitle = $stateParams.search;
        $scope.searchtext = stitle;
        var user = $rootScope.uid;
        if (user == null) {
            $http.get('php/isLogin.php').then(function (response) {
                if (response.data.code == 1) {
                    user = response.data.data.uid;
                }
            })
        }
        $http.post('php/getStrategies.php', {type: 2, search: stitle}).then(function (response) {
            if (response.data.code == 1) {
                $scope.strategies = response.data.data;
                $scope.result = false;
            } else {
                $scope.result = true;
            }
        });
        $scope.getTips = function () {
            var text = $scope.searchtext;
            if (text == null || text.length == 0) {
                return;
            }
            setTimeout(function () {
                if (text == $scope.searchtext) {
                    $http.post('php/getTip.php', {text: text}).then(function (response) {
                        if (response.data.code == 1) {
                            $scope.tips = response.data.data;
                        } else {
                            $scope.tips = null;
                        }
                    })
                }
                else {
                    return;
                }
            }, 700);
        };
        $scope.search = function () {
            var text = $scope.searchtext;
            if (text == null || text.length == 0) {
                return;
            }
            $state.go('search', {search: text});
        }
        $scope.toUser = function (uid) {
            //通用户uid进入到相应的user界面
            //使用$state.go('User',{uid:UserID})
            if (user == uid)
                $state.go('mine');
            else
                $state.go('user', {uid: uid});
        };
        $scope.toDetail = function (sid) {
            $state.go('strategy', {sid: sid});
        }
    }])
    .controller('NoviceController', ['$scope', '$http', '$state', function ($scope, $http, $state) {
        $scope.title = "新手专区";

    }])
    .controller('MessageController', ['$scope', '$http', '$state', function ($scope, $http, $state) {
        $scope.title = "消息";
        var isLogin;
        $http.get('php/isLogin.php').then(function (response) {
            if (response.data.code == 1) {
                isLogin = true;
            }
            else {
                isLogin = false;
            }
        });
        $http.get('php/getNoReadComment.php').then(function (response) {
            if (response.data.code == 1) {
                $scope.commentCount = response.data.data.COUNT;
                if (response.data.data.COUNT == 0) {
                    $scope.unread = false;
                } else {
                    $scope.unread = true;
                }
            } else {
                $scope.unread = false;
            }
        });
        $scope.toUnRead = function () {
            if (isLogin) {
                $state.go('unread');
            }
        };
    }])
    .controller('UnreadController', ['$scope', '$http', '$state', function ($scope, $http, $state) {
        $scope.title = "未读留言";
        $http.get('php/getUnread.php').then(function (response) {
            if (response.data.code == 1) {
                $scope.strategies = response.data.data;
            } else {

            }
        });
        $scope.toDetail = function (sid) {
            $http.post('php/read.php', {sid: sid}).then(function (response) {
                if (response.data.code == 1) {

                }
            });
            $state.go('strategy', {sid: sid});
        }
    }])
    .controller('PublishController', ['$scope', '$http', '$state', function ($scope, $http, $state) {
        $scope.title = "发布攻略";
        //    发布攻略方法
        $scope.publish = function () {
            var title = $('#pub-title').val();
            var ta = $('#target').val();
            var content = $('#pub-content').html();
            if (title.length <= 0 || ta.length <= 0) {
                alert("标题或正文不能为空哦")
                return;
            }
            $http({
                method: 'post',
                url: 'php/publish.php',
                data: {title: title, content: content}
            }).then(function (response) {
                if (response.data.code == 1) {
                    alert("发表成功！");
                    $state.go('home');
                } else {
                    alert("你还没有登录，无法发布攻略哦！");
                    $state.go('login');
                }
            })
        };
    }])
    .controller('StrategiesController', ['$scope', '$http', '$state', '$rootScope', function ($scope, $http, $state, $rootScope) {
        $scope.title = "全部攻略";
        var user = $rootScope.uid;
        if (user == null) {
            $http.get('php/isLogin.php').then(function (response) {
                if (response.data.code == 1) {
                    user = response.data.data.uid;
                }
            })
        }
        $http.post('php/getStrategies.php', {type: 1}).then(function (response) {
            if (response.data.code == 1) {
                $scope.strategies = response.data.data;
            }
        });
        $scope.toUser = function (uid) {
            //通用户uid进入到相应的user界面
            //使用$state.go('User',{uid:UserID})
            if (user == uid)
                $state.go('mine');
            else
                $state.go('user', {uid: uid});
        };
        $scope.toDetail = function (sid) {
            $state.go('strategy', {sid: sid});
        }
    }])
    .controller('StrategyController', ['$scope', '$http', '$state', '$stateParams', '$rootScope', function ($scope, $http, $state, $stateParams, $rootScope) {
        //当攻略属于当前用户，用户可以删除本帖。
        $scope.title = "攻略";
        $scope.self = false;
        $scope.commenting = false;
        $scope.more = false;
        var page = 1;
        var user = $rootScope.uid;
        var sid = $stateParams.sid;
        if (user == null) {
            $http.get('php/isLogin.php').then(function (response) {
                if (response.data.code == 1) {
                    user = response.data.data.uid;
                }
            })
        }

        $scope.suid = user;

        $http.post('php/getStrategy.php', {sid: sid})
            .then(function (response) {
                if (response.data.code == 1) {
                    $scope.strategy = response.data.data;
                    $scope.commtent = response.data.data2;
                    if (response.data.data2 == null || response.data.data2.length < 10) {
                        $scope.more = false;
                    } else {
                        $scope.more = true;
                    }
                    var uid = $scope.strategy.uid;
                    if (uid == user) {
                        $scope.self = true;
                    } else {
                        $scope.self = false;
                        $http.post('php/isFollow.php', {uid: uid}).then(function (res) {
                            if (res.data.code == 1) {
                                $scope.follow = true;
                            } else {
                                $scope.follow = false;
                            }
                        })
                    }
                    if (response.data.data2 != null) {
                        $scope.comment = true;
                    }
                }
            });
        $scope.getMore = function () {
            page++;
            $http.post('php/getComment.php', {sid: sid, page: page}).then(function (response) {
                if (response.data.code == 1) {
                    $scope.commtent = response.data.data;
                    if (response.data.data.length < page * 10) {
                        $scope.more = false;
                    } else {
                        $scope.more = true;
                    }
                }
                else {
                    page = 1;
                }
            });
        };
        $scope.toUser = function (uid) {
            if (user == uid)
                $state.go('mine');
            else
                $state.go('user', {uid: uid});
        };
        $scope.deleteCom = function (cid) {
            if (!confirm("确定删除这条评论？")) {
                return;
            }
            $http.post('php/deleteComment.php',{sid: sid,cid:cid,page:page}).then(function (response) {
               if(response.data.code==1){
                   $scope.commtent = response.data.data;
                   alert("成功删除该评论");
               }
            });
        };
        $scope.tofollow = function (uid) {
            $http({
                method: 'post',
                url: 'php/follow.php',
                data: {uid: uid, type: 0}
            }).then(function (response) {
                if (response.data.code == 1) {
                    $scope.follow = true;
                } else {
                    alert("您还没有登录！");
                }
            });
        };
        $scope.toComment = function () {
            var content = $scope.content;
            if (content == null) {
                alert("内容为不能空！");
                return;
            }
            if (content.trim().length <= 0) {
                alert("内容为不能空(空格键也不行哦)！");
                $scope.content = "";
                return;
            }
            $http.post('php/comment.php', {sid: sid, content: content}).then(function (response) {
                if (response.data.code == 1) {
                    $scope.commtent = response.data.data;
                    $scope.commenting = false;
                    $scope.content = "";
                    $scope.comment = true;
                } else {
                    alert("登录后才能评论哦");
                }
            })
        }
    }])
    .controller('HomeController', ['$scope', '$http', '$state', '$rootScope', function ($scope, $http, $state, $rootScope) {
        $scope.title = "首页";
        var user = $rootScope.uid;
        $scope.more = true;
        var page = 1;
        if (user == null) {
            $http.get('php/isLogin.php').then(function (response) {
                if (response.data.code == 1) {
                    user = response.data.data.uid;
                }
            })
        }
        $http.post('php/getStrategies.php', {type: 0, page: 1}).then(function (response) {
            if (response.data.code == 1) {
                $scope.strategies = response.data.data;
                if (response.data.data.length < 5) {
                    $scope.more = false;
                } else {
                    $scope.more = true;
                }
            }
        });
        $scope.getMore = function () {
            page++;
            $http.post('php/getStrategies.php', {type: 0, page: page}).then(function (response) {
                if (response.data.code == 1) {
                    $scope.strategies = response.data.data;
                    if (response.data.data.length < page * 5) {
                        $scope.more = false;
                    } else {
                        $scope.more = true;
                    }
                } else {
                    page = 1;
                }
            })
        };
        $scope.toUser = function (uid) {
            //通用户uid进入到相应的user界面
            //使用$state.go('User',{uid:UserID})
            if (user == uid)
                $state.go('mine');
            else
                $state.go('user', {uid: uid});
        };
        $scope.getAllStrategies = function () {
            $state.go('strategies');
        }
        $scope.toDetail = function (sid) {
            $state.go('strategy', {sid: sid});
        }
    }]);