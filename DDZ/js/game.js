$(function () {
    // 1、生成扑克
    // 初始化扑克数量
    // 默认值
    // 智能出牌
    var Ai = false;
    // 初始化音乐
    var music = [];
    for (var i = 0; i < $('.music').children().length; i++) {
        music[i] = document.getElementsByTagName('audio')[i];
    }
    //斗地主主题曲
    music[46].play();

    function musicPlay() {
        music[46].play();
    }

    //每100秒就重新开启主题音乐
    var Music = setInterval(musicPlay, 108000);
    //默认值
    $('.bottomTotal').css({'left': ($(window).width() - $('.bottomTotal').width()) / 2})
    $('#PromptBox').css({
        'left': ($(window).width() - $('#PromptBox').width()) / 4,
        'top': ($(window).height() - $('#PromptBox').height()) / 2
    });
    $('.gameOver').css({
        'left': ($(window).width() - $('.gameOver').width()) / 2,
        'top': ($(window).height() - $('.gameOver').height()) / 3
    });
    $('.hideBox').css({'width': $(window).width(), 'height': $(window).height()});

    $('.btnBG').css('left', ($(window).width() - $('.btnBG').width()) / 2);
    $('.aboutWe').css({
        'left': ($(window).width() - $('.aboutWe').width()) / 2,
        'top': ($(window).height() - $('.aboutWe').height()) / 1.4
    });
    $('.beginGame').css('height', $(window).height());
    $('.getGame').css({'height': $(window).height(), 'width': $(window).width()});
    $('.landPoker').css('left', ($(window).width() - $('.landPoker').width()) / 2);

    // $('.getGameBtn').css('left', ($(window).width() - $('.getGameBtn').width()) / 2);
    $('.beginGameBtn').css('left', ($(window).width() - $('.beginGameBtn').width()) / 2);
    // console.log($(document).width()/4);
    $('.gameChoseBtn').on('click', function () {
        $(this).parent().stop().fadeOut(500);
        $('.hideBox').stop().fadeOut(500);
    })

    $('.aboutWe li').hover(function () {
        $(this).css({'color': '#ccc', 'list-style': 'inside'});
    }, function () {
        $(this).css({'color': '#fff', 'list-style': 'none'});
    })

    $('.startGame').hide();
    // gameOver();

    //显示器窗口发生变化 执行的方法
    $(window).resize(function () {
        $('.bottomTotal').css({'left': ($(window).width() - $('.bottomTotal').width()) / 2})
        $('.beginGameBtn').css('left', ($(window).width() - $('.beginGameBtn').width()) / 2);
        $('.getGame').css({'height': $(window).height(), 'width': $(window).width()});
        $('.landPoker').css('left', ($(window).width() - $('.landPoker').width()) / 2);
        $('.btnBG').css('left', ($(window).width() - $('.btnBG').width()) / 2);
    })
    //进入游戏
    $('.aboutBtn').click(function () {
        $('.aboutWe').stop().fadeToggle(500);
    })
    //点击开始游戏
    $('.getGameBtn').click(function () {
        $('.btnBG').hide();
        $('.aboutWe').hide();
        $('.getGame').animate({
            'left': '30%', 'top': '8%', 'width': '800px', 'height': '800px',
            'border-radius': '50%', 'background-size': '200%'
        }, 500);
        $('.getGame').css({'transform': 'rotate(360deg)', 'transition': 'transform 2s'});
        $('.getGame').animate({'width': '0', 'height': '0', 'top': '50%', 'left': '50%',}, 1000);
        setTimeout(function () {
            $('.farmer').animate({'left': '0'}, 1500).animate({'left': '-50px'}, 300).animate({'left': '0'}, 500);
            $('.landlord').animate({'left': '0'}, 1500).animate({'left': '50px'}, 300).animate({'left': '0'}, 500);
            setTimeout(function () {
                $('.beginGameBtn').fadeIn();
            }, 1800)
            // $('.beginGame').hide();
        }, 500)

    });
    $('.beginGameBtn').click(function () {
        $(this).hide();
        $('.farmer').animate({'left': '-2000px'}, 1500);
        $('.landlord').animate({'left': '2000px'}, 1500);
        setTimeout(function () {
            $('.beginGame').hide();
            clearPoker();
            setTimeout(dealPoker, 1000);
        }, 1500);
        setTimeout(function () {
            $('.moveImg').fadeIn(500);
            moveGo();
            automo();
        }, 13000)

    });
    var all_poker = [];
    //所有玩家的属性
    var play = [
        {poker: [], role: 0, score: 10000},
        {poker: [], role: 0, score: 10000},
        {poker: [], role: 0, score: 10000}
    ];
    for (var i = 0; i < 3; i++) {
        // console.log($('.branch').eq(i).find('span'));
        $('.branch').eq(i).find('span').text(play[i].score);
    }

    //玩家选中的牌
    var select_poker = {
        'type': 0,
        'max': 0,
        'list': []
    };

    //已经打出去的牌
    var desktop = {
        'type': 0,
        'max': 0,
        'list': []
    };

    //当前可以出牌的玩家
    var game = {'present': '-1'};

    //洗牌点击数
    var click = 0;


    // setTimeout(function () {
    //     $('.moveImg').fadeIn(500);
    //     moveGo();
    //     automo();
    // }, 3000)

    // 1、生成扑克
    //初始化扑克数量
    for (var i = 1; i <= 13; i++) {
        for (var j = 0; j < 4; j++) {
            all_poker.push({number: i, color: j})
        }
    }
    //往扑克数量里面添加大小王
    all_poker.push({number: 14, color: 0});
    all_poker.push({number: 14, color: 1});

    //生成牌堆
    for (var i = 0; i < 54; i++) {
        $li = $('<li />');		// 通过JS生成一个JQ的HTML（DOM）对象
        $li.attr('class', 'back back' + i);
        $li.css({
            'left': -i / 5,
            'top': -i / 2
        });
        $('.all_poker').append($li);
    }
    // 2、洗牌
    // $('.startGame').click(function () {
    //     $(this).hide();
    //     clearPoker();
    //     setTimeout(function () {
    //         $('.beginGame').hide();
    //         clearPoker();
    //         setTimeout(dealPoker, 13000);
    //     },1500);
    // });

    //洗牌的方法
    function clearPoker() {

        //  打乱排序的方法
        for (var i = 0; i < 10; i++) {
            all_poker.sort(function (x, y) {
                return Math.random() - 0.5;
            })
        }

        //洗牌动画CSS3
        $('.all_poker li').css({'animation-play-state': 'running'});
        $('.all_poker').css({'animation-play-state': 'running'});
        // 原本动画


        // console.log(all_poker);
        // $all_poker = $('.all_poker');
        // $('.all_poker').detach();
        //
        // for (var i = 0; i < 3; i++) {
        //     $ul = $('<ul />');		// 通过JS生成一个JQ的HTML（DOM）对象
        //     $ul.attr('class', 'all_poker');
        //     $ul.css('top', -i * 270 + 'px');
        //     for (var j = 0; j < 18; j++) {
        //         $li = $('<li />');
        //         $li.attr('class', 'back');
        //         $li.css({
        //             'left': -j / 5,
        //             'top': -j / 2
        //         });
        //         $ul.append($li);
        //     }
        //     $('.mid_top').append($ul);
        // }
        //
        // for (var i = 0; i < 8; i++) {
        //     $('.all_poker').eq(0).animate({'left': '-500px'}, 100).animate({'left': '0px'}, 100);
        //     $('.all_poker').eq(2).animate({'left': '500px'}, 100).animate({'left': '0px'}, 100);
        // }
        // //把临时的洗牌好的三组牌堆去掉
        // setTimeout(function () {
        //     $('.all_poker').remove();
        //     $('.mid_top').append($all_poker);
        // }, 1200)


        // 小人提示
        setTimeout(function () {
            $('.talkCase').fadeIn(1000);
            $('.talkCase').html('快点抢地主吧，这把稳');
        }, 2000);
    }

    //发牌方法
    function dealPoker(num) {
        music[47].play();
        num = num || 0;
        //发牌给左边玩家
        play[0].poker.push(all_poker.pop());
        $('.all_poker li:last').animate({'left': '-400px', 'top': '100px'}, 10);
        setTimeout(function () {
            $('.all_poker li:last').remove();
            //1 代表农民
            // music[47].play();
            var li = markPoker(play[0].poker[play[0].poker.length - 1], 1);
            $('.play_1').append(li).css({'top': '50px', 'left': ' -20px'});
            $('.play_1 li:last').animate({'top': num * 36 + 'px'});
        }, 15);
        //发牌给中间玩家
        setTimeout(function () {
            //all_poker最后一张添加到play上
            play[1].poker.push(all_poker.pop());
            $('.all_poker li:last').animate({'top': '350px'}, 10);
            setTimeout(function () {

                $('.all_poker li:last').remove();
                var li = markPoker(play[1].poker[play[1].poker.length - 1], 0);
                $('.play_2').append(li);
                $('.play_2 li:last').css('left', num * 50 + 'px');
                $('.play_2').css({'left': -num * 25 + 'px', 'top': '200px'});
            }, 15);
        }, 20);
        //发牌给右边玩家
        setTimeout(function () {
            play[2].poker.push(all_poker.pop());
            $('.all_poker li:last').animate({'left': '500px', 'top': '200px'}, 10);
            setTimeout(function () {
                $('.all_poker li:last').remove();
                //1 代表农民
                var li = markPoker(play[2].poker[play[2].poker.length - 1], 1);
                $('.play_3').append(li).css({'top': '50px', 'left': ' 20px'});
                $('.play_3 li:last').animate({'top': num * 36 + 'px'});
                if (++num < 17) {
                    dealPoker(num);
                }

                //发牌完成
                else {
                    $('.all_poker li:last').animate({'left': '-200px'}, 200);
                    $('.all_poker li:first').animate({'left': '200px'}, 200);
                    setTimeout(function () {
                        $('.play_2').animate({'left': 0 + 'px'}, 300);
                        $('.play_2 li').animate({'left': 0 + 'px'}, 300);
                        //发牌结束往一个方向拉回去
                        $('.play_1 li').animate({'top': 0 + 'px'}, 300);
                        // $('.play_3').animate({'top': $(document).height()/2 + 'px'}, 300);
                        $('.play_3 li').animate({'top': 0 + 'px'}, 300);
                    }, 500);
                    setTimeout(function () {
                        //第一位玩家的排序
                        $('.play_1 li').remove();
                        play[0].poker = pokerSort1(play[0].poker);
                        for (var i = 0; i < play[0].poker.length; i++) {
                            var li = markPoker(play[0].poker[i]);
                            $('.play_1').append(li);
                            $('.play_1').css({'top': 50 + 'px'});
                            $('.play_1 li:last').animate({'top': i * 36 + 'px'}, 500);
                        }
                        //第二位玩家的排序
                        $('.play_2 li').remove();
                        play[1].poker = pokerSort1(play[1].poker);
                        for (var i = 0; i < play[1].poker.length; i++) {
                            var li = markPoker(play[1].poker[i]);
                            $('.play_2').append(li);
                            $('.play_2').css({'left': -i * 25 + 'px'});
                            $('.play_2 li:last').animate({'left': i * 50 + 'px'}, 500);
                        }
                        //第三位玩家的排序
                        $('.play_3 li').remove();
                        play[2].poker = pokerSort1(play[2].poker);
                        for (var i = 0; i < play[2].poker.length; i++) {
                            var li = markPoker(play[2].poker[i]);
                            $('.play_3').append(li);
                            $('.play_3').css({'top': 50 + 'px'});
                            $('.play_3 li:last').animate({'top': i * 36 + 'px'}, 500);
                        }
                        //抢地主
                        getLandLord();
                    }, 1000)
                    //抢地主
                }
            }, 15);
        }, 40);

    }

    //生成牌正面
    function markPoker(play_total) {
        //play_total 传进来的最后一张牌
        //farmer 判断是否要正反面

        var color_arr = [
            [0, -181],
            [-139, -181],
            [0, 0],
            [-139, 0]
        ];
        var x = 0;
        var y = 0;
        if (play_total.number < 14) {
            x = color_arr[play_total.color][0];
            y = color_arr[play_total.color][1];
        } else {
            if (play_total.color == 0) {
                x = 0;
                y = 0;
            } else {
                x = -139;
                y = 0;
            }
        }
        var html = '';
        html = '<li data-poker="' + play_total.number + '_' + play_total.color + ' "style="width: 121px; height: 159px; background: url(./images/' + play_total.number + '.png) ' + x + 'px ' + y + 'px;"></li>';
        return html;
    }

    //把生成的牌进行排序 从大排到小
    function pokerSort(poker_num) {
        //poker_num传进来的所有牌
        poker_num.sort(function (x, y) {
            if (x.number == y.number) {
                return y.color - x.color;
            }
            else {
                return y.number - x.number;
            }
        });
        return poker_num;
    }

    //从小到大
    function pokerSort1(poker_num) {
        //poker_num传进来的所有牌
        poker_num.sort(function (x, y) {
            if (x.number == y.number) {
                return x.color - y.color;
            }
            else {
                return x.number - y.number;
            }
        });
        return poker_num;

    }

    //抢地主方法
    function getLandLord(start, number) {

        // 生成一个随机数 让抢地主的概率都一样
        // var start  = Math.round(Math.random()*2.5);
        // 给随机数start一个默认值 若有传值就用传进来的值
        // 给number一个默认值 若有传值就用传进来的值
        start = start || Math.round(Math.random() * 2.5);
        number = number || 0;
        //到谁抢地主
        if (start > 2) {
            start = 0;
        }
        //点击次数
        if (number > 2) {
            clearInterval(time);
            // 游戏结束---流局
            $('.hideBox').fadeIn(1000);
            // $('.well').css({'left': $(document).width() / 2.2 + 'px', 'top': $(document).height() / 2 + 'px'})
            $('.well').text('平局!');
            $('.btnTotal').hide();
            $('.btnTotal2').hide();
            $('.play_1').hide();
            $('.play_2').hide();
            $('.play_3').hide();
            $('.all_poker').hide();
            return;
        }

        //点击抢地主后 role属性就为1
        $('.btnTotal:eq(' + start + ') .btnLandlord').click(function () {
            // $('.talkCase').fadeIn(1000);
            $('.talkCase').fadeIn(1000);
            $('.talkCase').html('抢得好！');
            setTimeout(function () {
                $('.talkCase').fadeOut(1000);
            }, 2000);
            music[28].play();
            //点击抢地主后 role属性就为1
            play[start].role = 1;
            var oldNum = 500;
            for (var i = 0; i < 3; i++) {

                play[i].score = play[i].score - oldNum;
                $('.branch').eq(i).find('span').text(play[i].score);
                $('.bottomTotal').find('span').text(oldNum * 3);
            }
            //获取地主牌的数据
            play[start].poker = play[start].poker.concat(all_poker);
            //清除定时器
            clearInterval(time);
            $('.btnTotal').hide();
            //获取地主牌
            getLandlordPoker(start);
            setTimeout(function () {
                for (var i = 0; i < 3; i++) {
                    $('.play' + i + '_Img').fadeIn(1000);
                }
                $('.play' + start + '_Img').addClass('play_Img');
            }, 1000);
            return;
        });
        //倒计时时间
        var t = 5;
        $('.btnTotal').hide();
        $('.btnTotal').eq(start).fadeIn(1000);
        var time = setInterval(function () {
            var time1 = new Date();
            $('.time:eq(' + start + ')').html(t--);
            if (t < 0) {
                passClick();
                t = 3;
            }
        }, 1000);
        //不抢地主按钮
        $('.btnTotal:eq(' + start + ') .passLand').click(function () {
            $('.talkCase').fadeIn(1000);
            $('.talkCase').html('怂！这都不敢抢');
            setTimeout(function () {
                $('.talkCase').fadeOut(1000);
            }, 1000);
            // 不抢地主方法
            passClick();
        });

        //小人物
        // setTimeout(function () {
        //     $('.moveImg').fadeIn(500);
        //     moveGo();
        //     automo();
        // }, 3000)

        //不抢地主方法
        function passClick() {
            music[29].play();
            clearInterval(time);
            start++;
            number++;
            getLandLord(start, number);
        }
    }

    //获取地主牌
    function getLandlordPoker(play_index) {
        //删除原本的地主牌
        callTxt();
        $('.all_poker li').addClass('transform1');
        $('.all_poker li').css('transition', 'transform 0.5s');
        var arr = [];
        setTimeout(function () {
            $('.all_poker li').remove();
            for (var i = 0; i < 3; i++) {
                var li = markPoker(all_poker[i]);
                $('.all_poker').append(li);
                arr.push(all_poker[i]);
                $('.all_poker li').css({'transform': 'rotateY(90deg)'});
                $('.all_poker li').eq(0).css('left', 200);
                $('.all_poker li').eq(2).css('left', -200);
                $(".play").eq(play_index).append(li);
                //如果play_index=0  把牌传给左边玩家
                if (play_index == 0) {
                    $('.play:eq(0) li:last').css({'left': 20 + 'px', 'top': (i + 1) * 36 + 576 + 'px'});
                    $('.play:eq(0) li:last').animate({'left': 0}, 1000);
                    setTimeout(function () {
                        $('.play_1 li').remove();
                        play[0].poker = pokerSort1(play[0].poker);
                        for (var i = 0; i < play[0].poker.length; i++) {
                            var li = markPoker(play[0].poker[i]);
                            $('.play_1').append(li);
                            $('.play_1').css({'left': '-20px'});
                            $('.play_1 li:last').animate({'top': i * 36 + 'px'}, 500);
                        }
                    }, 2000);
                }
                //如果play_index=1  把牌传给中间玩家
                else if (play_index == 1) {
                    $('.play:eq(1) li:last').css({'left': (i + 1) * 50 + 800 + 'px', 'top': '-20px'});
                    $('.play:eq(1)').css({'left': -(i + 1) * 25 - 400 + 'px'});
                    $('.play:eq(1) li:last').animate({'top': 0}, 1000);
                    setTimeout(function () {
                        $('.play_2 li').remove();
                        play[1].poker = pokerSort1(play[1].poker);
                        for (var i = 0; i < play[1].poker.length; i++) {
                            var li = markPoker(play[1].poker[i]);
                            $('.play_2').append(li);
                            $('.play_2').css({'left': -i * 25 + 'px'});
                            $('.play_2 li:last').animate({'left': i * 50 + 'px'}, 500);
                        }
                    }, 2000);
                }
                //如果play_index=2  把牌传给右边玩家
                else if (play_index == 2) {
                    $('.play:eq(2) li:last').css({'left': -20 + 'px', 'top': (i + 1) * 36 + 576 + 'px'});
                    $('.play:eq(2) li:last').animate({'left': 0}, 1000);
                    setTimeout(function () {
                        $('.play_3 li').remove();
                        play[2].poker = pokerSort1(play[2].poker);
                        for (var i = 0; i < play[2].poker.length; i++) {
                            var li = markPoker(play[2].poker[i]);
                            $('.play_3').append(li);
                            $('.play_3').css({'left': '20px'});
                            $('.play_3 li:last').animate({'top': i * 36 + 'px'}, 500);
                        }
                    }, 2000);
                }
            }
            //地主牌切换动画效果
            setTimeout(function () {
                $('.all_poker li').css({'transform': 'rotateY(0deg)'});
                $('.all_poker li').css({'transition': 'transform 1s'});
            }, 300);
            var color_arr = [
                [0, -181],
                [-139, -181],
                [0, 0],
                [-139, 0]
            ];
            var x = 0;
            var y = 0;
            setTimeout(function () {
                for (var i = 0; i < 3; i++) {
                    if (arr[i].number < 14) {
                        x = color_arr[arr[i].color][0];
                        y = color_arr[arr[i].color][1];
                    } else {
                        if (arr[i].color == 0) {
                            x = 0;
                            y = 0;
                        } else {
                            x = -139;
                            y = 0;
                        }
                    }
                    $('.all_poker li').eq(i).addClass('border');
                    $('.all_poker li').eq(i).css({'background': 'url(./images/' + arr[i].number + '.png) ' + x + 'px ' + y + 'px '});
                    $('.all_poker li').eq(i).animate({
                        'width': '70px',
                        'height': '90px'
                    })
                }
            }, 1000);
            //让地主牌回到最顶上
            setTimeout(function () {
                $('.landPoker').stop().animate({'top': -20}, 500);
                $('.all_poker li').eq(0).stop().animate({'left': '110px'}, 1000);
                $('.all_poker li').eq(1).stop().animate({'left': '28px'}, 1000);
                $('.all_poker li').eq(2).stop().animate({'left': '-54px'}, 1000);
                $('.all_poker').animate({'top': '-100px'}, 1000);
                setTimeout(function () {
                    var clone = $('.all_poker').children().clone();
                    $('.landPoker').html(clone);
                    $('.landPoker li').eq(2).css({'top': '20px', 'left': 10});
                    $('.landPoker li').eq(1).css({'top': '20px', 'left': 90});
                    $('.landPoker li').eq(0).css({'top': '20px', 'left': 170});
                    $('.all_poker li').remove();
                }, 1000)
            }, 2000);


        }, 300);
        game.present = play_index;
        setTimeout(function () {
            startGame(-1);
        }, 2500);

    }

    //小人所有消息框
    var callTotal = [
        '瓜子辣条，买不起的抬jio!',
        '小卖部斗地主!',
        '德汉又偷懒了,扣工资!',
        '黎宁动画骚得一批!',
        '不要把鼠标放在我身上!',
        '小卖部老板就是我!',
        '闲来无事不如斗地主!',
        '抬jio抬jio抬jio!',
        '要给范鸿楷加工资!',
        '这辈子不可能打斗地主的!',
        '只要不死，代码不止'
    ];

    //定时器 定时开启小人的消息
    var timer3 = 0;

    function callTxt() {
        var is = Math.floor(Math.random() * 11.5);
        clearInterval(timer3);
        timer3 = setInterval(function () {
            $('.talkCase').fadeIn(1000);
            $('.talkCase').html(callTotal[is]);
            setTimeout(function () {
                $('.talkCase').fadeOut(1000);
            }, 2000);
        }, 8000)
    }

    //游戏开始
    function startGame(cancel_num) {
        // cancel_num = cancel_num||-1;
        if (cancel_num == 2 || cancel_num == -1) {
            $('.btnTotal2').hide();

            $('.btnTotal2').eq(game.present).fadeIn(1500);
            // $('.btnTotal2').eq(game.present).find('.passPoker').
            $('.btnTotal2').eq(game.present).find('.passPoker').hide();
            if (Ai) {
                $('.btnTotal2').eq(0).find('.tip').hide();
                $('.btnTotal2').eq(2).find('.tip').hide();
            }
        }
        else {

            //cancel_num 当前出牌的玩家
            $('.btnTotal2').hide();
            $('.btnTotal2').eq(game.present).fadeIn(1500);
            $('.btnTotal2').eq(game.present).find('.passPoker').show();
            if (Ai) {
                $('.btnTotal2').eq(0).find('.tip').hide();
                $('.btnTotal2').eq(2).find('.tip').hide();
            }
        }
        presentClick(cancel_num);
        console.log(desktop);
        // serCh(play[game.present].poker);
    }

    // gameOver();
    //选择牌

    var timer1 = 0;

    //当前出牌的玩家
    function presentClick(cancel_num) {

        timerGo();

        function timerGo() {
            var ti = 15;
            clearInterval(timer1);
            timer1 = setInterval(function () {
                // ti--;
                if (ti < 0) {
                    // ti = 15;
                    $('.btnTotal2').eq(game.present).find('.passPoker').click();
                    $('.btnTotal2').eq(game.present).find('.time1').text(ti--);
                }
                else {
                    $('.btnTotal2').eq(game.present).find('.time1').text(ti--);
                }
            }, 1000);
        };
        

        $('.play').eq(game.present).on('click', 'li', function () {
            //当前选中的牌
            var str = $(this).attr('data-poker');
            var arr = str.split('_');
            var poker = {'number': arr[0], 'color': arr[1]};

            //让点击的牌出列
            if ($(this).hasClass('select' + game.present + '')) {
                $(this).removeClass('select' + game.present + '');
                //遍历所有牌 找到当前再次点击将其删除
                for (var i = 0; i < select_poker.list.length; i++) {
                    if (select_poker.list[i].number == poker.number &&
                        select_poker.list[i].color == poker.color) {
                        select_poker.list.splice(i, 1);
                        break;
                    }
                }
            }
            else {
                //选择的牌插入select_poker
                $(this).addClass('select' + game.present + '');
                // console.log(poker);
                select_poker.list.push(poker);
            }
            // console.log(select_poker.list);
        });
        $('.btnTotal2').eq(game.present).on('click', '.outPoker', function () {

            /*
        牌型代码表
        1       单张
        2       对子
        3       三张
        4       三带一
        5       三带二
        6       顺子
        7       四带二
        8       四带四
        9       四带六
        33       三张*n
        44       三带一*n
        55       三带二*n
        66       连对
        100       炸弹
        110       王炸
    */

            if (select_poker.list.length == 0) {
                $('#PromptBox').show();
                $('.wrongBox').stop().fadeIn(1000).stop().fadeOut(1000);
                setTimeout(function () {
                    $('#PromptBox').hide();
                }, 2000)

            }
            else {
                console.log(select_poker);
                //  判断能否出牌 ——————————————————————————————————————————
                if (checkPoker() && checkPokerVS()) {
                    desktop.type = 0;
                    desktop.max = 0;
                    desktop.list = [];
                    // for (x in select_poker) {
                    //     desktop[x] = select_poker[x];
                    // }
                    // 清除上一个玩家的出的牌面


                    desktop.max = select_poker.max;
                    desktop.type = select_poker.type;
                    var temp_obj = {};
                    for (var i = 0; i < select_poker.list.length; i++) {
                        temp_obj = {'number': select_poker.list[i].number, 'color': select_poker.list[i].color};
                        desktop.list.push(temp_obj);
                    }
                    // console.log(desktop);
                    // return false;
                    removePoker(play[game.present].poker, select_poker.list);
                    $('.play').eq(game.present).find('li').remove();
                    if (play[game.present].poker.length == 0) {
                        $('.talkCase').fadeIn(500);
                        $('.talkCase').html('没得玩咯');
                        setTimeout(function () {
                            $('.talkCase').fadeOut(1000);
                        }, 1000);
                        // gameOver();
                        $('.hideBox').fadeIn(1000);
                        if (play[game.present].role == 1) {
                            $('.well').text('');
                            $('.gameOver').css('background', 'url("./images/地主胜利.png")no-repeat center/100%');
                        }
                        else {
                            $('.well').text('');
                            $('.gameOver').css('background', 'url("./images/农民胜利.png")no-repeat center/100%');
                        }
                        clearInterval(timer2);
                        clearInterval(timer3);
                        clearInterval(timer1);
                        $('.btnTotal').hide();
                        $('.btnTotal2').hide();
                        $('.play_1').hide();
                        $('.play_2').hide();
                        $('.play_3').hide();
                        $('.all_poker').hide();
                    }


                    // 动画方法
                    if (select_poker.type == 6 ||
                        select_poker.type == 33 ||
                        select_poker.type == 44 ||
                        select_poker.type == 55 ||
                        select_poker.type == 66 ||
                        select_poker.type == 100 ||
                        select_poker.type == 110) {
                        effects();
                    }
                    //打完重新生成牌
                    for (var i = 0; i < play[game.present].poker.length; i++) {
                        var li = markPoker(play[game.present].poker[i]);
                        play[game.present].poker = pokerSort1(play[game.present].poker);
                        if (game.present == 0) {
                            $('.play_1').append(li);
                            $('.play_1').css({'top': 50 + 'px'});
                            $('.play_1 li:last').css({'top': i * 36 + 'px'});
                        }
                        else if (game.present == 1) {
                            $('.play_2').append(li);
                            $('.play_2').css({'left': -i * 25 + 'px'});
                            $('.play_2 li:last').css({'left': i * 50 + 'px'});
                        }
                        else {
                            $('.play_3').append(li);
                            $('.play_3 li:last').css('top', i * 36 + 'px');
                            $('.play_3').css({'top': '50px'});
                        }
                    }

                    desktop.list = pokerSort1(desktop.list);

                    var color_arr = [
                        [0, -181],
                        [-139, -181],
                        [0, 0],
                        [-139, 0]
                    ];
                    var x = 0;
                    var y = 0;
                    for (var i = 0; i < desktop.list.length; i++) {
                        if (Number(desktop.list[i].number) < 14) {
                            x = color_arr[Number(desktop.list[i].color)][0];
                            y = color_arr[Number(desktop.list[i].color)][1];
                        } else {
                            if (Number(desktop.list[i].color) == 0) {
                                x = 0;
                                y = 0;
                            } else {
                                x = -139;
                                y = 0;
                            }
                        }
                        var html = '';
                        html = '<li data-poker="' + Number(desktop.list[i].number) + '_' + Number(desktop.list[i].color) + ' "style="width: 121px; height: 159px; background: url(./images/' + Number(desktop.list[i].number) + '.png) ' + x + 'px ' + y + 'px;"></li>';
                        $('.all_poker').append(html).css({
                            'top': '300px',
                            'left': -i * 25 + 'px',
                            'perspective': '400px'
                        });
                        $('.all_poker li:last').css({'left': i * 50 + 'px'});
                        $('.all_poker li:last').css({'transform': ' rotateX(45deg)'});
                    }
                    game.present = (++game.present > 2) ? 0 : game.present;
                    $('.play').off('click', 'li');
                    $('.btnTotal2').off('click');

                    startGame(0);

                    // 播放音乐
                    playMusic();


                }
                else {
                    //淡入淡出出牌错误
                    $('#PromptBox').stop().fadeIn().fadeOut(1200);
                    $('.wrongBox').stop().fadeIn().fadeOut(1000)
                }
            }
        });

        $('.btnTotal2').eq(game.present).on('click', '.passPoker', function () {
            //淡入淡出要不起
            music[31].play();
            //调用倒计时
            timerGo();
            $('.btnTotal2').eq(game.present).fadeIn(1500);
            $('#PromptBox').stop().fadeIn().fadeOut(1200);
            $('.passBox').stop().fadeIn().fadeOut(1000)
            select_poker.type = 0;
            select_poker.max = 0;
            select_poker.list = [];
            $('.play').eq(game.present).find('li').removeClass('select' + game.present + '')
            game.present++;
            cancel_num++;
            if (game.present > 2) {

                game.present = 0;


            }
            // 连续两不出牌把桌面的牌清空
            if (cancel_num == 2) {
                desktop.type = 0;
                desktop.max = 0;
                desktop.list = [];

                $('.btnTotal2:eq(' + game.present + ')').find('.passPoker').hide();
            }
            $('.play').off('click', 'li');
            $('.btnTotal2').off('click', '.passPoker');
            $('.btnTotal2').off('click', '.outPoker');
            $('.btnTotal2').off('click', '.tip');
            // console.log(cancel_num);
            startGame(cancel_num);
        });
        $('.btnTotal2').eq(game.present).on('click', '.tip', function () {
            tips = tipPoker();
            $('.play').eq(game.present).find('li').removeClass('select' + game.present + '');
            select_poker.list = [];
            select_poker.type = 0;
            select_poker.max = 0;
            for (let i = 0; i < tips.length; i++) {

                $('.play').eq(game.present).find('li:eq(' + tips[i] + ')').click();
            }
        });
    }

    function removePoker(obj, obj2) {
        for (var i = 0; i < obj.length; i++) {
            for (var j = 0; j < obj2.length; j++) {
                if (obj[i].number == obj2[j].number &&
                    obj[i].color == obj2[j].color) {
                    obj.splice(i, 1);
                    obj2.splice(j, 1);
                    removePoker(obj, obj2);
                }
            }
        }
        // return;
    }

    // 定义检查牌型的方法
    function checkPoker() {
        // 1、先对玩家选择的牌进行重新排序
        select_poker.list = pokerSort1(select_poker.list);

        /*
            牌型代码表
            1       单张
            2       对子
            3       三张
            4       三带一
            5       三带二
            6       顺子
            7       四带二
            8       四带四
            9       四带六
            33       三张*n
            44       三带一*n
            55       三带二*n
            66       连对
            100       炸弹
            110       王炸
        */
        // 根据选择牌的数量来再进行判断牌型
        switch (select_poker.list.length) {
            // 一张牌        单张
            case 1:
                select_poker.type = 1;							// 设置牌型为单张
                select_poker.max = select_poker.list[0].number; 	// 设置判断值为该牌的点数
                return true;
                break;
            // 两张牌        对子，王炸
            case 2:
                if (select_poker.list[0].number == select_poker.list[1].number) {
                    if (select_poker.list[0].number == 14) {
                        select_poker.type = 110;						// 设置牌型为王炸
                        select_poker.max = 14; 							// 设置判断值为该牌的点数
                        // console.log('王炸');
                        // setTimeout(function () {
                        //     music[40].play();
                        // },2000);
                    } else {
                        select_poker.type = 2;							// 设置牌型为对子
                        select_poker.max = select_poker.list[0].number; 	// 设置判断值为该牌的点数
                        // console.log('普通对子');
                    }
                    return true;
                }
                break;
            // 三张牌        三张
            case 3:
                if (select_poker.list[0].number == select_poker.list[2].number) {
                    select_poker.type = 3;							// 设置牌型为三张
                    select_poker.max = select_poker.list[0].number; 	// 设置判断值为该牌的点数
                    // console.log('三不带');
                    return true;
                }
                break;
            // 四张牌        炸弹、三带一
            case 4:
                // 判断是否为炸弹
                if (select_poker.list[0].number == select_poker.list[3].number) {
                    select_poker.type = 100;							// 设置牌型为炸弹
                    select_poker.max = select_poker.list[0].number; 	// 设置判断值为该牌的点数
                    // console.log('炸弹');
                    // setTimeout(function () {
                    //     music[39].play();
                    // },2000);
                    return true;
                }

                // 判断是否为三带一   	3334	3444	5559	 3666
                else if (select_poker.list[0].number == select_poker.list[2].number ||
                    select_poker.list[1].number == select_poker.list[3].number) {
                    select_poker.type = 4;							// 设置牌型为三带一
                    select_poker.max = select_poker.list[1].number; 	// 设置判断值为该牌的点数
                    // console.log('三带一');
                    // music[35].play();
                    return true;
                }

                break;
            // 五张牌        顺子、三带二
            case 5:
                // 判断是否为顺子
                if (checkStraight()) {
                    select_poker.type = 6;							// 设置牌型为顺子
                    select_poker.max = select_poker.list[0].number; 	// 设置判断值为该牌的点数
                    // console.log('顺子*5');
                    // music[32].play();
                    return true;
                }
                // 判断是否为三带二
                if (select_poker.list[0].number == select_poker.list[2].number &&   // 判断三带二的方法
                    select_poker.list[3].number == select_poker.list[4].number ||
                    select_poker.list[0].number == select_poker.list[1].number &&
                    select_poker.list[2].number == select_poker.list[4].number
                ) {
                    select_poker.type = 5;							// 设置牌型为三带二
                    select_poker.max = select_poker.list[2].number; 	// 设置判断值为该牌的点数
                    // console.log('三带二');
                    // music[36].play();
                    return true;
                }
                break;
            // 六张牌        顺子、3*连对、四带二、2*三张
            case 6:
                // 判断是否为顺子
                if (checkStraight()) {
                    select_poker.type = 6;							// 设置牌型为顺子
                    select_poker.max = select_poker.list[0].number; 	// 设置判断值为该牌的点数
                    // console.log('顺子*6');
                    // music[32].play();
                    return true;
                }

                // 判断是否为连对
                if (checkTwoPairs()) {
                    select_poker.type = 66;							// 设置牌型为连对
                    select_poker.max = select_poker.list[0].number; 	// 设置判断值为该牌的点数
                    // console.log('连对*3');
                    // music[33].play();
                    return true;
                }

                // 判断是否为四带二		333345	344445	345555
                if (select_poker.list[0].number == select_poker.list[3].number ||
                    select_poker.list[1].number == select_poker.list[4].number ||
                    select_poker.list[2].number == select_poker.list[5].number) {
                    select_poker.type = 7;							// 设置牌型为四带二
                    select_poker.max = select_poker.list[2].number; 	// 设置判断值为该牌的点数
                    // console.log('四带二');
                    // music[38].play();
                    return true;
                }

                // 判断是否为两组三张的飞机		555666		333444
                if (select_poker.list[0].number == select_poker.list[2].number &&
                    select_poker.list[0].number == select_poker.list[3].number - 1 &&
                    select_poker.list[3].number == select_poker.list[5].number) {
                    select_poker.type = 33;								// 设置牌型为二个三张的飞机
                    select_poker.max = select_poker.list[0].number; 	// 设置判断值为该牌的点数
                    // console.log('两组不带的飞机');
                    // music[34].play();
                    return true;
                }

                break;
            // 七张牌        顺子
            case 7:
                // 判断是否为顺子
                if (checkStraight()) {
                    select_poker.type = 6;							// 设置牌型为顺子
                    select_poker.max = select_poker.list[0].number; 	// 设置判断值为该牌的点数
                    console.log('顺子*7');
                    // music[32].play();
                    return true;
                }
                break;
            // 八张牌        顺子、4*连对、四带四、2*三带一
            case 8:
                // 判断是否为顺子
                if (checkStraight()) {
                    select_poker.type = 6;							// 设置牌型为顺子
                    select_poker.max = select_poker.list[0].number; 	// 设置判断值为该牌的点数
                    // console.log('顺子*8');
                    // music[32].play();
                    return true;
                }

                // 判断是否为连对
                if (checkTwoPairs()) {
                    select_poker.type = 66;							// 设置牌型为连对
                    select_poker.max = select_poker.list[0].number; 	// 设置判断值为该牌的点数
                    // console.log('连对*4');
                    // music[33].play();
                    return true;
                }

                // 判断是否为四带四		33334455	33444455	33445555
                if (select_poker.list[0].number == select_poker.list[3].number &&
                    select_poker.list[4].number == select_poker.list[5].number &&
                    select_poker.list[6].number == select_poker.list[7].number ||

                    select_poker.list[0].number == select_poker.list[1].number &&
                    select_poker.list[2].number == select_poker.list[5].number &&
                    select_poker.list[6].number == select_poker.list[7].number ||

                    select_poker.list[0].number == select_poker.list[1].number &&
                    select_poker.list[2].number == select_poker.list[3].number &&
                    select_poker.list[4].number == select_poker.list[7].number) {
                    select_poker.type = 8;							// 设置牌型为四带二
                    select_poker.max = select_poker.list[2].number; 	// 设置判断值为该牌的点数
                    // console.log('四带四');
                    // music[37].play();
                    return true;
                }

                // 判断是否为两个三带一的飞机		34777888	35556668	36667779
                if (select_poker.list[0].number == select_poker.list[2].number &&
                    select_poker.list[0].number == select_poker.list[3].number - 1 &&
                    select_poker.list[3].number == select_poker.list[5].number ||
                    select_poker.list[1].number == select_poker.list[3].number &&
                    select_poker.list[1].number == select_poker.list[4].number - 1 &&
                    select_poker.list[4].number == select_poker.list[6].number ||
                    select_poker.list[2].number == select_poker.list[4].number &&
                    select_poker.list[2].number == select_poker.list[5].number - 1 &&
                    select_poker.list[5].number == select_poker.list[7].number) {
                    select_poker.type = 44;								// 设置牌型为二个三带一的飞机
                    select_poker.max = select_poker.list[2].number; 	// 设置判断值为该牌的点数
                    // console.log('两组三带一的飞机');
                    // music[34].play();
                    return true;
                }


                break;
            // 九张牌        顺子、3*三张
            case 9:
                // 判断是否为顺子
                if (checkStraight()) {
                    select_poker.type = 6;							// 设置牌型为顺子
                    select_poker.max = select_poker.list[0].number; 	// 设置判断值为该牌的点数
                    // console.log('顺子*9');
                    // music[32].play();
                    return true;
                }

                // 判断是否为三个连续的三张
                if (checkThreeAirplane()) {
                    select_poker.type = 33;								// 设置牌型为三个三张的飞机
                    select_poker.max = select_poker.list[0].number; 	// 设置判断值为该牌的点数
                    // console.log('三组不带三张');
                    // music[34].play();
                    return true;
                }
                break;
            // 十张牌        顺子、5*连对、2*三带二、四带六
            case 10:
                // 判断是否为顺子
                if (checkStraight()) {
                    select_poker.type = 6;							// 设置牌型为顺子
                    select_poker.max = select_poker.list[0].number; 	// 设置判断值为该牌的点数
                    // console.log('顺子*10');
                    // music[32].play();
                    return true;
                }

                // 判断是否为连对
                if (checkTwoPairs()) {
                    select_poker.type = 66;							// 设置牌型为连对
                    select_poker.max = select_poker.list[0].number; 	// 设置判断值为该牌的点数
                    // console.log('连对*5');
                    // music[33].play();
                    return true;
                }

                // 判断是否为两个三带二的飞机		//   3344 777888	//   33 555666 88	//   666777 8899	下标：4
                if (select_poker.list[0].number == select_poker.list[1].number &&
                    select_poker.list[2].number == select_poker.list[3].number &&
                    select_poker.list[4].number == select_poker.list[6].number &&
                    select_poker.list[7].number == select_poker.list[9].number &&
                    select_poker.list[4].number == select_poker.list[7].number - 1 ||

                    select_poker.list[0].number == select_poker.list[1].number &&
                    select_poker.list[2].number == select_poker.list[4].number &&
                    select_poker.list[5].number == select_poker.list[7].number &&
                    select_poker.list[8].number == select_poker.list[9].number &&
                    select_poker.list[2].number == select_poker.list[5].number - 1 ||

                    select_poker.list[0].number == select_poker.list[2].number &&
                    select_poker.list[3].number == select_poker.list[5].number &&
                    select_poker.list[6].number == select_poker.list[7].number &&
                    select_poker.list[8].number == select_poker.list[9].number &&
                    select_poker.list[0].number == select_poker.list[3].number - 1) {
                    select_poker.type = 55;								// 设置牌型为二个三带二的飞机
                    select_poker.max = select_poker.list[4].number; 	// 设置判断值为该牌的点数
                    // console.log('两组三带二的飞机');
                    // music[34].play();
                    return true;
                }

                // 判断是否为四带六		3333444555	3334444555	3334445555
                if (select_poker.list[0].number == select_poker.list[3].number &&
                    select_poker.list[4].number == select_poker.list[6].number &&
                    select_poker.list[7].number == select_poker.list[9].number ||

                    select_poker.list[0].number == select_poker.list[2].number &&
                    select_poker.list[3].number == select_poker.list[6].number &&
                    select_poker.list[7].number == select_poker.list[9].number ||

                    select_poker.list[0].number == select_poker.list[2].number &&
                    select_poker.list[3].number == select_poker.list[5].number &&
                    select_poker.list[6].number == select_poker.list[9].number) {
                    select_poker.type = 9;							// 设置牌型为四带二
                    select_poker.max = select_poker.list[2].number; 	// 设置判断值为该牌的点数
                    // console.log('四带六');
                    // music[34].play();
                    return true;
                }

                break;
            // 十一张牌      顺子
            case 11:
                // 判断是否为顺子
                if (checkStraight()) {
                    select_poker.type = 6;							// 设置牌型为顺子
                    select_poker.max = select_poker.list[0].number; 	// 设置判断值为该牌的点数
                    // console.log('顺子*11');
                    // music[32].play();
                    return true;
                }
                break;
            // 十二张牌      顺子、6*连对、3*三带一、4*三张
            case 12:
                // 判断是否为顺子
                if (checkStraight()) {
                    select_poker.type = 6;							// 设置牌型为顺子
                    select_poker.max = select_poker.list[0].number; 	// 设置判断值为该牌的点数
                    // console.log('顺子*12');
                    // music[33].play();
                    return true;
                }

                // 判断是否为连对
                if (checkTwoPairs()) {
                    select_poker.type = 66;							// 设置牌型为连对
                    select_poker.max = select_poker.list[0].number; 	// 设置判断值为该牌的点数
                    // console.log('连对*6');
                    // music[33].play();
                    return true;
                }

                // 判断是否为四个连续的三张
                if (checkThreeAirplane()) {
                    select_poker.type = 33;								// 设置牌型为四个三张的飞机
                    select_poker.max = select_poker.list[0].number; 	// 设置判断值为该牌的点数
                    // console.log('四组连续的三张');
                    // music[34].play();
                    return true;
                }

                // 判断是否为三个三带一的飞机	   012 345 678 9TE 	下标：4
                if (	// 345 666777888
                select_poker.list[3].number == select_poker.list[5].number &&
                select_poker.list[6].number == select_poker.list[8].number &&
                select_poker.list[9].number == select_poker.list[11].number &&
                select_poker.list[3].number == select_poker.list[9].number - 2 ||
                // 34 666777888 J
                select_poker.list[2].number == select_poker.list[4].number &&
                select_poker.list[5].number == select_poker.list[7].number &&
                select_poker.list[8].number == select_poker.list[10].number &&
                select_poker.list[2].number == select_poker.list[5].number - 2 ||
                // 3 666777888 JQ
                select_poker.list[1].number == select_poker.list[3].number &&
                select_poker.list[4].number == select_poker.list[6].number &&
                select_poker.list[7].number == select_poker.list[9].number &&
                select_poker.list[1].number == select_poker.list[7].number - 2 ||
                // 666777888 JQK
                select_poker.list[0].number == select_poker.list[2].number &&
                select_poker.list[3].number == select_poker.list[5].number &&
                select_poker.list[6].number == select_poker.list[8].number &&
                select_poker.list[0].number == select_poker.list[6].number - 2) {
                    select_poker.type = 44;								// 设置牌型为三个三带一的飞机
                    select_poker.max = select_poker.list[4].number; 	// 设置判断值为该牌的点数
                    // console.log('三组三带一的飞机');
                    // music[34].play();
                    return true;
                }
                break;
            // 十四张牌      7*对子
            case 14:
                // 判断是否为连对
                if (checkTwoPairs()) {
                    select_poker.type = 66;							// 设置牌型为连对
                    select_poker.max = select_poker.list[0].number; 	// 设置判断值为该牌的点数
                    // console.log('连对*7');
                    // music[33].play();
                    return true;
                }
                break;
            // 十五张牌      5*三张、5*三带二
            case 15:
                // 判断牌型为五个三张的飞机
                if (checkThreeAirplane()) {
                    select_poker.type = 33;								// 设置牌型为五个三张的飞机
                    select_poker.max = select_poker.list[0].number; 	// 设置判断值为该牌的点数
                    // console.log('五组三带一');
                    // music[34].play();
                    return true;
                }

                // 判断牌型为三个三带二		666777888	33	44	55	  JJ QQ KK
                if (	//	334455 666777888	下标6开始判断
                select_poker.list[0].number == select_poker.list[1].number &&
                select_poker.list[2].number == select_poker.list[3].number &&
                select_poker.list[4].number == select_poker.list[5].number &&
                select_poker.list[6].number == select_poker.list[8].number &&
                select_poker.list[9].number == select_poker.list[11].number &&
                select_poker.list[12].number == select_poker.list[14].number &&
                select_poker.list[6].number == select_poker.list[12].number - 2 ||
                //	3344 666777888 JJ	下标4开始判断
                select_poker.list[0].number == select_poker.list[1].number &&
                select_poker.list[2].number == select_poker.list[3].number &&
                select_poker.list[4].number == select_poker.list[6].number &&
                select_poker.list[7].number == select_poker.list[9].number &&
                select_poker.list[10].number == select_poker.list[12].number &&
                select_poker.list[13].number == select_poker.list[14].number &&
                select_poker.list[4].number == select_poker.list[10].number - 2 ||
                //	33 666777888 JJQQ	下标2开始判断
                select_poker.list[0].number == select_poker.list[1].number &&
                select_poker.list[2].number == select_poker.list[4].number &&
                select_poker.list[5].number == select_poker.list[7].number &&
                select_poker.list[8].number == select_poker.list[10].number &&
                select_poker.list[11].number == select_poker.list[12].number &&
                select_poker.list[13].number == select_poker.list[14].number &&
                select_poker.list[2].number == select_poker.list[8].number - 2 ||
                //	666777888 JJQQKK	下标0开始判断
                select_poker.list[0].number == select_poker.list[2].number &&
                select_poker.list[3].number == select_poker.list[5].number &&
                select_poker.list[6].number == select_poker.list[8].number &&
                select_poker.list[9].number == select_poker.list[10].number &&
                select_poker.list[11].number == select_poker.list[12].number &&
                select_poker.list[13].number == select_poker.list[14].number &&
                select_poker.list[0].number == select_poker.list[6].number - 2) {
                    select_poker.type = 55;								// 设置牌型为三个三带二的飞机
                    select_poker.max = select_poker.list[7].number; 	// 设置判断值为该牌的点数
                    // console.log('三组三带二');
                    // music[34].play();
                    return true;
                }
                break;
            // 十六张牌      8*连对、4*三带一
            case 16:
                // 判断牌型为连对
                if (checkTwoPairs()) {
                    select_poker.type = 66;							// 设置牌型为连对
                    select_poker.max = select_poker.list[0].number; 	// 设置判断值为该牌的点数
                    // console.log('连对*8');
                    // music[33].play();
                    return true;
                }
                // 判断牌型为四个三带一		3456 777888999MMM JQKA    0123456789SYESSW
                if (	    //  777888999MMM JQKA
                select_poker.list[0].number == select_poker.list[2].number &&
                select_poker.list[3].number == select_poker.list[5].number &&
                select_poker.list[6].number == select_poker.list[8].number &&
                select_poker.list[9].number == select_poker.list[11].number &&
                select_poker.list[0].number == select_poker.list[9].number - 3 ||
                //  3 777888999MMM JQK
                select_poker.list[1].number == select_poker.list[3].number &&
                select_poker.list[4].number == select_poker.list[6].number &&
                select_poker.list[7].number == select_poker.list[9].number &&
                select_poker.list[10].number == select_poker.list[12].number &&
                select_poker.list[1].number == select_poker.list[10].number - 3 ||
                //  34 777888999MMM JQ
                select_poker.list[2].number == select_poker.list[4].number &&
                select_poker.list[5].number == select_poker.list[7].number &&
                select_poker.list[8].number == select_poker.list[10].number &&
                select_poker.list[11].number == select_poker.list[13].number &&
                select_poker.list[2].number == select_poker.list[11].number - 3 ||
                //  345 777888999MMM J
                select_poker.list[3].number == select_poker.list[5].number &&
                select_poker.list[6].number == select_poker.list[8].number &&
                select_poker.list[9].number == select_poker.list[11].number &&
                select_poker.list[12].number == select_poker.list[14].number &&
                select_poker.list[3].number == select_poker.list[12].number - 3 ||
                //  3456 777888999MMM
                select_poker.list[4].number == select_poker.list[6].number &&
                select_poker.list[7].number == select_poker.list[9].number &&
                select_poker.list[10].number == select_poker.list[12].number &&
                select_poker.list[13].number == select_poker.list[15].number &&
                select_poker.list[4].number == select_poker.list[13].number - 3) {
                    select_poker.type = 44;								// 设置牌型为三个三带一的飞机
                    select_poker.max = select_poker.list[5].number; 	// 设置判断值为该牌的点数
                    // music[34].play();
                    return true;
                }
                break;
            // 十八张牌      9*连对、6*三张
            case 18:
                // 判断牌型为连对
                if (checkTwoPairs()) {
                    select_poker.type = 66;							// 设置牌型为连对
                    select_poker.max = select_poker.list[0].number; 	// 设置判断值为该牌的点数
                    // console.log('连对*9');
                    // music[33].play();
                    return true;
                }

                // 判断牌型为六个三张的飞机
                if (checkThreeAirplane()) {
                    select_poker.type = 33;								// 设置牌型为六个三张的飞机
                    select_poker.max = select_poker.list[0].number; 	// 设置判断值为该牌的点数
                    // music[34].play();
                    return true;
                }
                break;
            // 二十张牌      10*连对、5*三带一、5*三带二
            case 20:
                // 判断牌型为连对
                if (checkTwoPairs()) {
                    select_poker.type = 66;							// 设置牌型为连对
                    select_poker.max = select_poker.list[0].number; 	// 设置判断值为该牌的点数
                    // console.log('连对*10');
                    // music[33].play();
                    return true;
                }

                // 判断牌型为五个三带一		3456s 777888999MMMJJJ QKA2G    0123 4567 89SY ESSW
                if (	// 777888999MMMJJJ QKA2G        0-5
                select_poker.list[0].number == select_poker.list[2].number &&
                select_poker.list[3].number == select_poker.list[5].number &&
                select_poker.list[6].number == select_poker.list[8].number &&
                select_poker.list[9].number == select_poker.list[11].number &&
                select_poker.list[12].number == select_poker.list[14].number &&
                select_poker.list[0].number == select_poker.list[12].number - 4 ||
                //  3 777888999MMMJJJ QKA2          1-4
                select_poker.list[1].number == select_poker.list[3].number &&
                select_poker.list[4].number == select_poker.list[6].number &&
                select_poker.list[7].number == select_poker.list[9].number &&
                select_poker.list[10].number == select_poker.list[12].number &&
                select_poker.list[13].number == select_poker.list[15].number &&
                select_poker.list[1].number == select_poker.list[13].number - 4 ||
                //  34 777888999MMMJJJ QKA         2-3
                select_poker.list[2].number == select_poker.list[4].number &&
                select_poker.list[5].number == select_poker.list[7].number &&
                select_poker.list[8].number == select_poker.list[10].number &&
                select_poker.list[11].number == select_poker.list[13].number &&
                select_poker.list[14].number == select_poker.list[16].number &&
                select_poker.list[2].number == select_poker.list[14].number - 4 ||
                //  345 777888999MMMJJJ QK         3-2
                select_poker.list[3].number == select_poker.list[5].number &&
                select_poker.list[6].number == select_poker.list[8].number &&
                select_poker.list[9].number == select_poker.list[11].number &&
                select_poker.list[12].number == select_poker.list[14].number &&
                select_poker.list[15].number == select_poker.list[17].number &&
                select_poker.list[3].number == select_poker.list[15].number - 4 ||
                //  3456 777888999MMMJJJ Q         4-1
                select_poker.list[4].number == select_poker.list[6].number &&
                select_poker.list[7].number == select_poker.list[9].number &&
                select_poker.list[10].number == select_poker.list[12].number &&
                select_poker.list[13].number == select_poker.list[15].number &&
                select_poker.list[16].number == select_poker.list[18].number &&
                select_poker.list[4].number == select_poker.list[16].number - 4 ||
                //  3456S 777888999MMMJJJ          5-0
                select_poker.list[5].number == select_poker.list[7].number &&
                select_poker.list[8].number == select_poker.list[10].number &&
                select_poker.list[11].number == select_poker.list[13].number &&
                select_poker.list[14].number == select_poker.list[16].number &&
                select_poker.list[17].number == select_poker.list[19].number &&
                select_poker.list[5].number == select_poker.list[17].number - 4) {
                    select_poker.type = 44;								// 设置牌型为五个三带一的飞机
                    select_poker.max = select_poker.list[5].number; 	// 设置判断值为该牌的点数
                    // music[34].play();
                    return true;
                }

                // 判断牌型为四个三带二   33 44 55 66  777888999MMM  JJ QQ KK AA
                if (	//	33445566  777888999MMM	 下标8开始判断
                select_poker.list[0].number == select_poker.list[1].number &&
                select_poker.list[2].number == select_poker.list[3].number &&
                select_poker.list[4].number == select_poker.list[5].number &&
                select_poker.list[6].number == select_poker.list[7].number &&
                select_poker.list[8].number == select_poker.list[10].number &&
                select_poker.list[11].number == select_poker.list[13].number &&
                select_poker.list[14].number == select_poker.list[16].number &&
                select_poker.list[17].number == select_poker.list[19].number &&
                select_poker.list[8].number == select_poker.list[17].number - 4 ||
                //	334455 777888999MMM JJ	 下标6开始判断
                select_poker.list[0].number == select_poker.list[1].number &&
                select_poker.list[2].number == select_poker.list[3].number &&
                select_poker.list[4].number == select_poker.list[5].number &&
                select_poker.list[6].number == select_poker.list[8].number &&
                select_poker.list[9].number == select_poker.list[11].number &&
                select_poker.list[12].number == select_poker.list[14].number &&
                select_poker.list[15].number == select_poker.list[17].number &&
                select_poker.list[18].number == select_poker.list[19].number &&
                select_poker.list[6].number == select_poker.list[15].number - 4 ||
                //	3344 777888999MMM JJQQ	 下标4开始判断
                select_poker.list[0].number == select_poker.list[1].number &&
                select_poker.list[2].number == select_poker.list[3].number &&
                select_poker.list[4].number == select_poker.list[6].number &&
                select_poker.list[7].number == select_poker.list[9].number &&
                select_poker.list[10].number == select_poker.list[12].number &&
                select_poker.list[13].number == select_poker.list[15].number &&
                select_poker.list[16].number == select_poker.list[17].number &&
                select_poker.list[18].number == select_poker.list[19].number &&
                select_poker.list[4].number == select_poker.list[13].number - 4 ||
                //	33 777888999MMM JJQQKK	 下标2开始判断
                select_poker.list[0].number == select_poker.list[1].number &&
                select_poker.list[2].number == select_poker.list[4].number &&
                select_poker.list[5].number == select_poker.list[7].number &&
                select_poker.list[8].number == select_poker.list[10].number &&
                select_poker.list[11].number == select_poker.list[13].number &&
                select_poker.list[14].number == select_poker.list[15].number &&
                select_poker.list[16].number == select_poker.list[17].number &&
                select_poker.list[18].number == select_poker.list[19].number &&
                select_poker.list[2].number == select_poker.list[11].number - 4 ||
                //	777888999MMM JJQQKKAA	下标0开始判断
                select_poker.list[0].number == select_poker.list[2].number &&
                select_poker.list[3].number == select_poker.list[5].number &&
                select_poker.list[6].number == select_poker.list[8].number &&
                select_poker.list[9].number == select_poker.list[11].number &&
                select_poker.list[12].number == select_poker.list[13].number &&
                select_poker.list[14].number == select_poker.list[15].number &&
                select_poker.list[16].number == select_poker.list[17].number &&
                select_poker.list[18].number == select_poker.list[19].number &&
                select_poker.list[0].number == select_poker.list[9].number - 4) {
                    select_poker.type = 55;								// 设置牌型为四个三带二的飞机
                    select_poker.max = select_poker.list[7].number; 	// 设置判断值为该牌的点数
                    // music[34].play();
                    return true;
                }
                break;



            // 默认false
            default:
                return false;
        }

        return false;
    }

// 定义检查牌型为顺子的方法	345 678 910J QKA	最多12位数
    function checkStraight() {
        // 判断最大的值不能大于12
        if (select_poker.list[select_poker.list.length - 1].number > 12) {
            console.log('不能带二');
            return false;
        }

        for (let i = 0; i < select_poker.list.length - 1; i++) {
            if (select_poker.list[i].number != select_poker.list[i + 1].number - 1) {
                return false;
            }
        }
        return true;
    }

// 定义检查牌型为连对的方法		3344556677		0123456789
    function checkTwoPairs() {

        // 判断最大的值不能大于12
        if (select_poker.list[select_poker.list.length - 1].number > 12) {
            return false;
        }

        // 单独判断每隔两位的相邻两位的值是相等的
        for (var i = 0; i < select_poker.list.length - 1; i += 2) {
            if (select_poker.list[i].number != select_poker.list[i + 1].number) {
                return false;
            }
        }

        switch (select_poker.list.length) {
            case 6:
                if (select_poker.list[0].number == select_poker.list[1].number &&
                    select_poker.list[0].number == select_poker.list[2].number - 1 &&
                    select_poker.list[0].number == select_poker.list[4].number - 2) {
                    return true;
                }
                break;
            case 8:
                if (select_poker.list[0].number == select_poker.list[1].number &&
                    select_poker.list[0].number == select_poker.list[2].number - 1 &&
                    select_poker.list[0].number == select_poker.list[4].number - 2 &&
                    select_poker.list[0].number == select_poker.list[6].number - 3) {
                    return true;
                }
                break;
            case 10:
                if (select_poker.list[0].number == select_poker.list[1].number &&
                    select_poker.list[0].number == select_poker.list[2].number - 1 &&
                    select_poker.list[0].number == select_poker.list[4].number - 2 &&
                    select_poker.list[0].number == select_poker.list[6].number - 3 &&
                    select_poker.list[0].number == select_poker.list[8].number - 4) {
                    return true;
                }
                break;
            case 12:
                if (select_poker.list[0].number == select_poker.list[1].number &&
                    select_poker.list[0].number == select_poker.list[2].number - 1 &&
                    select_poker.list[0].number == select_poker.list[4].number - 2 &&
                    select_poker.list[0].number == select_poker.list[6].number - 3 &&
                    select_poker.list[0].number == select_poker.list[8].number - 4 &&
                    select_poker.list[0].number == select_poker.list[10].number - 5) {
                    return true;
                }
                break;
            case 14:
                if (select_poker.list[0].number == select_poker.list[1].number &&
                    select_poker.list[0].number == select_poker.list[2].number - 1 &&
                    select_poker.list[0].number == select_poker.list[4].number - 2 &&
                    select_poker.list[0].number == select_poker.list[6].number - 3 &&
                    select_poker.list[0].number == select_poker.list[8].number - 4 &&
                    select_poker.list[0].number == select_poker.list[10].number - 5 &&
                    select_poker.list[0].number == select_poker.list[12].number - 6) {
                    return true;
                }
                break;
            case 16:
                if (select_poker.list[0].number == select_poker.list[1].number &&
                    select_poker.list[0].number == select_poker.list[2].number - 1 &&
                    select_poker.list[0].number == select_poker.list[4].number - 2 &&
                    select_poker.list[0].number == select_poker.list[6].number - 3 &&
                    select_poker.list[0].number == select_poker.list[8].number - 4 &&
                    select_poker.list[0].number == select_poker.list[10].number - 5 &&
                    select_poker.list[0].number == select_poker.list[12].number - 6 &&
                    select_poker.list[0].number == select_poker.list[14].number - 7) {
                    return true;
                }
                break;
            case 18:
                if (select_poker.list[0].number == select_poker.list[1].number &&
                    select_poker.list[0].number == select_poker.list[2].number - 1 &&
                    select_poker.list[0].number == select_poker.list[4].number - 2 &&
                    select_poker.list[0].number == select_poker.list[6].number - 3 &&
                    select_poker.list[0].number == select_poker.list[8].number - 4 &&
                    select_poker.list[0].number == select_poker.list[10].number - 5 &&
                    select_poker.list[0].number == select_poker.list[12].number - 6 &&
                    select_poker.list[0].number == select_poker.list[14].number - 7 &&
                    select_poker.list[0].number == select_poker.list[16].number - 8) {
                    return true;
                }
                break;
            case 20:
                if (select_poker.list[0].number == select_poker.list[1].number &&
                    select_poker.list[0].number == select_poker.list[2].number - 1 &&
                    select_poker.list[0].number == select_poker.list[4].number - 2 &&
                    select_poker.list[0].number == select_poker.list[6].number - 3 &&
                    select_poker.list[0].number == select_poker.list[8].number - 4 &&
                    select_poker.list[0].number == select_poker.list[10].number - 5 &&
                    select_poker.list[0].number == select_poker.list[12].number - 6 &&
                    select_poker.list[0].number == select_poker.list[14].number - 7 &&
                    select_poker.list[0].number == select_poker.list[16].number - 8 &&
                    select_poker.list[0].number == select_poker.list[18].number - 9) {
                    return true;
                }
                break;

            // 默认false
            default:
                return false;
        }
        return false;
    }

// 定义检查牌型为三不带飞机的方法		555666777		555666777888999
    function checkThreeAirplane() {

        // 判断最大的值不能大于12
        if (select_poker.list[select_poker.list.length - 1].number > 12) {
            return false;
        }

        // 使用遍历方法来判断每三位的值是相等的
        for (let i = 0; i < select_poker.list.length - 4; i += 3) {
            if (select_poker.list[i].number != select_poker.list[i + 3].number) {
                return false;
            }
        }

        switch (select_poker.list.length) {
            case 6:
                if (select_poker.list[0].number == select_poker.list[2].number &&
                    select_poker.list[3].number == select_poker.list[5].number &&
                    select_poker.list[0].number == select_poker.list[3].number - 1) {
                    return true;
                }
                break;
            case 9:
                if (select_poker.list[0].number == select_poker.list[2].number &&
                    select_poker.list[3].number == select_poker.list[5].number &&
                    select_poker.list[6].number == select_poker.list[8].number &&
                    select_poker.list[0].number == select_poker.list[6].number - 2) {
                    return true;
                }
                break;
            case 12:
                if (select_poker.list[0].number == select_poker.list[2].number &&
                    select_poker.list[3].number == select_poker.list[5].number &&
                    select_poker.list[6].number == select_poker.list[8].number &&
                    select_poker.list[9].number == select_poker.list[11].number &&
                    select_poker.list[0].number == select_poker.list[9].number - 3) {
                    return true;
                }
                break;
            case 15:
                if (select_poker.list[0].number == select_poker.list[2].number &&
                    select_poker.list[3].number == select_poker.list[5].number &&
                    select_poker.list[6].number == select_poker.list[8].number &&
                    select_poker.list[9].number == select_poker.list[11].number &&
                    select_poker.list[12].number == select_poker.list[14].number &&
                    select_poker.list[0].number == select_poker.list[12].number - 4) {
                    return true;
                }
                break;
            case 18:
                if (select_poker.list[0].number == select_poker.list[1].number &&
                    select_poker.list[3].number == select_poker.list[5].number &&
                    select_poker.list[6].number == select_poker.list[8].number &&
                    select_poker.list[9].number == select_poker.list[11].number &&
                    select_poker.list[12].number == select_poker.list[14].number &&
                    select_poker.list[15].number == select_poker.list[17].number &&
                    select_poker.list[0].number == select_poker.list[15].number - 5) {
                    return true;
                }
                break;

            // 默认false
            default:
                return false;
        }
        return true;
    }

    /*
          type    牌型代码表
           1        单张
           2        对子
           3        三张
           4        三带一
           5        三带二
           6        顺子
           7        四带二
           8        四带四
           9        四带六
           33       三张*n
           44       三带一*n
           55       三带二*n
           66       连对
           100      炸弹
           110      王炸
       */
// desktop 保存已经打的牌
// select_poker 是保存当前玩家选中的牌
    //  type相等   length相等
    function checkPokerVS() {
        //  desktop.list = pokerSort1(desktop.list);
        //  select_poker.list = pokerSort1(select_poker.list);
        //
        //  console.log(select_poker.list);
        //
        //  if(desktop.list.length == 0){
        //      return true;
        //  }
        //  if( desktop.type == select_poker.type &&
        //      desktop.length == select_poker.length ||
        //      desktop.max > select_poker.max){
        //      console.log('你出的牌大于上一家的牌，可以出');
        //      return true;
        //  }
        // return false;

        if (select_poker.type == 0) {
            return false;
        } else if (desktop.type == 0 || select_poker.type == 110 || select_poker.type == 100 && desktop.type != 100) {
            return true;
        } else if (select_poker.type == desktop.type && select_poker.list.length == desktop.list.length) {
            // 判断单张中的大小王
            if (Number(select_poker.list[0].number) == 14 && Number(desktop.list[0].number) == 14) {
                if (Number(select_poker.list[0].color) > Number(desktop.list[0].color)) {
                    return true;
                } else {
                    return false;
                }
            }
            else {
                console.log(Number(select_poker.max) > Number(desktop.max))
                if (Number(select_poker.max) > Number(desktop.max)) {
                    return true;
                } else {

                    return false;
                }
            }
            return false;
        }
    }

    //动画小人物
    var runNum = 0;
    var goNum = 0;
    var timer = 0;

    //小人动画
    function moveGo() {
        clearInterval(timer);
        timer = setInterval(function () {
            runNum++;
            goNum += 5;
            if (runNum == 5) {
                runNum = 0;
            }
            else {
                $('.smallChild').css('backgroundImage', "url('./images/小人" + runNum + ".png')");
            }
        }, 150);
    }

    var autoNum = 0;
    var timer2 = 0;

    function automo(autoNum) {
        clearInterval(timer2);
        timer2 = setInterval(function () {
            $('.smallChild').css('transform', ' rotateY(0deg)');
            $('.moveImg').stop().animate({'left': -$(window).width() / 2.4 + 'px'}, 4000);
            setTimeout(function () {
                $('.smallChild').css('transform', ' rotateY(180deg)');
                $('.moveImg').stop().animate({'left': $(window).width() / 1.3}, 4000);
                automo(autoNum);
            }, 4000);
        }, 4000);
    }

    //移入暂停人物
    $('.moveImg').hover(function () {
        clearInterval(timer);
        clearInterval(timer3);
        clearInterval(timer2);
        $('.talkCase').fadeIn(1000);
        $('.talkCase').html('不要把鼠标放我身上!');
    }, function () {
        $('.talkCase').fadeOut(1000);
        moveGo();
        callTxt();
        automo();
    });
    // gameOver();
    //定义游戏结束的方法
    //淡入淡出游戏结束
    function gameOver() {
        $('body').append('<div class="gameOver"><div/>');
        $('.gameOver').css({
            'left': ($(window).width() - $('.gameOver').width()) / 2,
            'top': -$(window).height()
        });
        $btn = $('<div />');
        $btn.attr('class', 'gameOverBtn');

        $a = $('<a/>');
        $a.attr('class', 'gameChoseBtn');
        $('.gameOver').append($btn).append($a);
        $('.gameChoseBtn').click(function () {
            $(this).parent().hide();
        });
    }

    //动画特效
    function effects() {
        $('#effects').fadeIn();
        switch (select_poker.type) {
            //顺子
            case 6:
                $('.straight').fadeIn().fadeOut(3000);
                $('.talkCase').fadeIn(500);
                $('.talkCase').html('顺子66666666');
                setTimeout(function () {
                    $('.talkCase').fadeOut(1000);
                }, 1000);

                break;
            //    飞机
            case 33:
            case 44:
            case 55:
                $('.plane').fadeIn().animate({'left': '10%'}, 2000).fadeOut().css({'left': '70%'});
                $('.talkCase').fadeIn(500);
                $('.talkCase').html('飞机咻咻咻');
                setTimeout(function () {
                    $('.talkCase').fadeOut(1000);
                }, 1500);
                break;
            case 66:
                //连队
                $('.evenOn').fadeIn().fadeOut(3000);
                $('.talkCase').fadeIn(500);
                $('.talkCase').html('连对2333333');
                setTimeout(function () {
                    $('.talkCase').fadeOut(1000);
                }, 1500);
                break;
            case 100:
                //炸弹
                $('.bomb').css({'left': ($(window).width() - $('.bomb').width()) / 2}).fadeIn().animate({'top': '40%'}, 1000).fadeOut().css({'top': '-300px'});
                $('.floor').css({'left': ($(window).width() - $('.floor').width()) / 2});
                setTimeout(function () {
                    $('.floor').fadeIn(500).fadeOut(1500);
                }, 2200);
                $('.talkCase').fadeIn(500);
                $('.talkCase').html('炸弹BOOM！');
                setTimeout(function () {
                    $('.talkCase').fadeOut(1000);
                }, 1000);
                break;
            case 110:
                //王炸
                $('.bombKing').css({'left': ($(window).width() - $('.bombKing').width()) / 2}).fadeIn().animate({'top': '-20%'}, 800).fadeOut().css({'top': '500px'});
                $('.floor').css({'left': ($(window).width() - $('.floor').width()) / 2}).fadeOut(500);
                $('.talkCase').fadeIn(500);
                $('.talkCase').html('这个你没得打了');
                setTimeout(function () {
                    $('.talkCase').fadeOut(1000);
                }, 1500);
                break;
        }
        //3秒后隐藏动画
        setTimeout(function () {
            $('#effects').hide();
        }, 3000)
    }

    //提示筛选判断
    // function serCh(Obj) {
    //     // obj = play[game.present].poker;
    //     $('.btnTotal2').eq(game.present).off('click','.tip');
    //     $('.autoText').off('click','.autoOutPoker');
    //     if (Obj == null) {
    //         return null;
    //     }
    //     var Ars = pokerSort(Obj)
    //     var Len = Obj.length;
    //     var Huo = false;       //是否存在火箭---
    //     var Dan = new Array(); //单牌
    //     var Dui = new Array(); //对子
    //     var San = new Array(); //三张
    //     var Siz = new Array(); //四张
    //     var Sun = new Array(
    //     ); //单顺
    //     var Sun2 = new Array();//双顺
    //     var Sun3 = new Array();//三顺
    //     var objT = [
    //         {type: 1, number: []},
    //         {type: 2, number: []},
    //         {type: 3, number: []},
    //         {type: 100, number: []},
    //         {type: 110, number: []},
    //         {type: 5, number: []}
    //     ]
    //     var min = [];
    //     if (Len > 1 && Ars[0].number == 14 && Ars[1].number == 14) Huo = true;  //牌面中已经排序过了 所以 如果有火箭 就在第1 和第2张中
    //     //判断单张
    //     for (var i = 0; i < Len; i++) {
    //         if (Dan.length == 0 || Ars[i].number != Dan[Dan.length - 1]) //如果没有加入 和 加入的不重复 就吧单牌加入进去
    //         {
    //             if (!(Huo && Ars[i].key == 4)) Dan.push(Ars[i].number);
    //             objT[0].number.push(Ars[i].number);
    //         }
    //     }
    //     //判断对子
    //     for (var i = 0; i < Len - 1; i++)
    //         if (Ars[i].number == Ars[i + 1].number) {
    //
    //             if (Dui.length == 0 || Ars[i].number != Dui[Dui.length - 1]) Dui.push(Ars[i].number);
    //             objT[1].number.push(Ars[i].number);
    //             i++;
    //         } //类似加入 对子
    //     for (var i = 0; i < Len - 2; i++) if (Ars[i].number == Ars[i + 1].number && Ars[i + 2].number == Ars[i].number) {
    //         if (San.length == 0 || Ars[i].number != San[San.length - 1]) San.push(Ars[i].number);
    //         objT[2].number.push(Ars[i].number);
    //         i += 2;
    //
    //     }//加入3张
    //     for (var i = 0; i < Len - 3; i++)
    //         if (Ars[i].number == Ars[i + 1].number && Ars[i + 2].number == Ars[i].number && Ars[i + 3].number == Ars[i].number) {
    //             if (Siz.length == 0 || Ars[i].number != Siz[Siz.length - 1]) Siz.push(Ars[i].number);
    //             objT[3].number.push(Ars[i].number);
    //             i += 3;
    //         }//加入4张
    //
    //     var poker1 = [];
    //     for (var i = 0; i < $('.play_' + (game.present + 1)).find('li').length; i++) {
    //         var str1 = $('.play_' + (game.present + 1)).find('li').eq(i).attr('data-poker');
    //         var arr1 = str1.split('_');
    //         poker1.push({
    //             'number': arr1[0],
    //             'color': arr1[1]
    //         });
    //     }
    //
    //     $('.btnTotal2').eq(game.present).on('click', '.tip', function () {
    //         renK();
    //         min=[];
    //     });
    //     //
    //
    //
    //
    //
    //
    //
    //
    //
    //     // if(Ai)
    //     // {
    //     //     // if(game.present == 1) {
    //     //     //     if (desktop.list.length == 0) {
    //     //     //         $('.play').eq(game.present).find('li:last').click();
    //     //     //         setTimeout(function () {
    //     //     //             $('.btnTotal2').eq(game.present).find('.outPoker').click();
    //     //     //             clearInterval(timer1);
    //     //     //         },2000);
    //     //     //     }
    //     //     //     else {
    //     //     //         setTimeout(function () {
    //     //     //             renK();
    //     //     //             if (min.length==0 && desktop.list.length!=0) {
    //     //     //                 $('.btnTotal2').eq(game.present).find('.passPoker').click();
    //     //     //             }
    //     //     //             else {
    //     //     //                 $('.btnTotal2').eq(game.present).find('.outPoker').click();
    //     //     //             }
    //     //     //         }, 2000);
    //     //     //         // $('.btnTotal2').eq(2).find('.tip').show();
    //     //     //         // $('.btnTotal2').eq(0).find('.tip').show();
    //     //     //     }
    //     //         // if(game.present!=1)
    //     //         // {
    //     //         //     $('.btnTotal2').eq(2).find('.tip').show();
    //     //         //     $('.btnTotal2').eq(0).find('.tip').show();
    //     //         // }
    //     //     }
    //     //     $('.autoText').find('span').text('机器人启用中...');
    //     //     $('.autoOutPoker').css({'background':'url("./images/设置1.png")no-repeat'});
    //     // }
    //     // else {
    //     //     $('.autoText').find('span').text('机器人已关闭');
    //     //     $('.autoOutPoker').css({'background': 'url("./images/设置2.png")no-repeat'});
    //     // }
    //     if(Ai)
    //     {
    //         if(game.present==0 || game.present==2) {
    //             if (desktop.list.length == 0) {
    //                 $('.play').eq(game.present).find('li:last').click();
    //                 setTimeout(function () {
    //                     $('.btnTotal2').eq(game.present).find('.outPoker').click();
    //                     clearInterval(timer1);
    //                 },2000);
    //             }
    //             else{
    //                 setTimeout(function () {
    //                     renK();
    //                     if (min.length==0 && desktop.list.length!=0) {
    //                         $('.btnTotal2').eq(game.present).find('.passPoker').click();
    //                     }
    //                     else {
    //                         $('.btnTotal2').eq(game.present).find('.outPoker').click();
    //                     }
    //
    //                 }, 2000);
    //             }
    //         }
    //     }
    //
    //     $('.autoText').on('click','.autoOutPoker',function () {
    //
    //         if(game.present==1)
    //         {
    //
    //             console.log(Ai);
    //             if(Ai)
    //             {
    //                 $('.autoText').find('span').text('机器人开启中...');
    //                 $('.autoOutPoker').css({'background':'url("./images/设置2.png")no-repeat'});
    //
    //
    //                 Ai = false;
    //                 // Ai = !Ai;
    //             }
    //             else{
    //                 $('.autoText').find('span').text('机器人已关闭');
    //                 $('.autoOutPoker').css({'background':'url("./images/设置1.png")no-repeat'});
    //                 Ai = true;
    //                 // Ai = !Ai;
    //             }
    //
    //         }
    //         else{
    //             return;
    //         }
    //
    //     })
    //
    //     function renK() {
    //         $('.btnTotal2').eq(game.present).off('click','.tip');
    //         $('.autoText').off('click','.autoOutPoker');
    //         for (var i = 0; i < objT.length; i++) {
    //             if (desktop.type == objT[i].type) {
    //                 for (var j = 0; j < objT[i].number.length; j++) {
    //                     if (objT[i].number[j] > desktop.max) {
    //                         for (var k = 0; k < poker1.length; k++) {
    //                             if (objT[i].number[j] == poker1[k].number) {
    //                                 min.push(k);
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //
    //         for (var i = 0; i < Dan.length; i++) {
    //             if (Dan[i] > 12) {
    //                 continue;
    //             } //A以上的不能顺
    //             if (Dan[i] < 4) {
    //                 break;
    //             }     //开头是 7 以下的也不能顺
    //             for (var k = i; k < Dan.length; k++) {
    //                 if (k + 1 == Dan.length || Dan[i] - Dan[k + 1] != k - i + 1) {
    //                     var len = k - i + 1;
    //                     if (len > 4) {
    //                         Sun.push({Max: Dan[i], Min: Dan[k], Len: len, number: []});
    //                     }
    //                     ;
    //                     i = k;
    //                     break;
    //                 }
    //             }
    //         }
    //
    //         if (min.length == 0) {
    //             $('.talkCase').fadeIn(1000);
    //             $('.talkCase').text('打不过了，怂了怂了！');
    //             setTimeout(function () {
    //                 $('.talkCase').fadeOut(1000);
    //             },2000)
    //         }
    //         else {
    //             $('.talkCase').fadeIn(1000);
    //             $('.talkCase').text('打得过啊，别怂！');
    //             setTimeout(function () {
    //                 $('.talkCase').fadeOut(1000);
    //             },2000)
    //         }
    //         switch (desktop.type) {
    //             case 0:
    //                 $('.talkCase').fadeIn(1000);
    //                 $('.talkCase').text('桌上都没牌，随便打！');
    //                 setTimeout(function () {
    //                     $('.talkCase').fadeOut(1000);
    //                 },2000)
    //                 break;
    //             case 1:
    //                 if (Number(poker1[0].number) == 14 && Number(desktop.list[0].number) == 14) {
    //                     if (Number(poker1[0].color) > Number(desktop.list[0].color)) {
    //                         $('.play_' + (game.present + 1)).find('li').eq(0).addClass('select' + (game.present));
    //                         select_poker.list.push(poker1[0]);
    //                         $('.talkCase').text('来个大鬼压死他！');
    //                     }
    //                 }
    //                 else {
    //                     $('.play_' + (game.present + 1)).find('li').eq(min[min.length - 1]).addClass('select' + (game.present));
    //                     select_poker.list.push(poker1[min[min.length - 1]]);
    //
    //                 }
    //                 break;
    //             case 2:
    //                 $('.play_' + (game.present + 1)).find('li').eq(min[min.length - 1]).addClass('select' + game.present);
    //                 $('.play_' + (game.present + 1)).find('li').eq(min[min.length - 2]).addClass('select' + game.present);
    //                 select_poker.list.push(poker1[min[min.length - 1]]);
    //                 select_poker.list.push(poker1[min[min.length - 2]]);
    //                 $('.talkCase').fadeIn(1000);
    //                 $('.talkCase').text('对子搞起来！');
    //                 setTimeout(function () {
    //                     $('.talkCase').fadeOut(1000);
    //                 },2000)
    //                 break;
    //             case 3:
    //                 $('.play_' + (game.present + 1)).find('li').eq(min[min.length - 1]).addClass('select' + game.present);
    //                 $('.play_' + (game.present + 1)).find('li').eq(min[min.length - 2]).addClass('select' + game.present);
    //                 $('.play_' + (game.present + 1)).find('li').eq(min[min.length - 3]).addClass('select' + game.present);
    //                 select_poker.list.push(poker1[min[min.length - 1]]);
    //                 select_poker.list.push(poker1[min[min.length - 2]]);
    //                 select_poker.list.push(poker1[min[min.length - 3]]);
    //                 $('.talkCase').fadeIn(1000);
    //                 $('.talkCase').text('3张打死他');
    //                 setTimeout(function () {
    //                     $('.talkCase').fadeOut(1000);
    //                 },2000)
    //                 break;
    //             case 100:
    //                 $('.play_' + (game.present + 1)).find('li').eq(min[min.length - 1]).addClass('select' + game.present);
    //                 $('.play_' + (game.present + 1)).find('li').eq(min[min.length - 2]).addClass('select' + game.present);
    //                 $('.play_' + (game.present + 1)).find('li').eq(min[min.length - 3]).addClass('select' + game.present);
    //                 $('.play_' + (game.present + 1)).find('li').eq(min[min.length - 4]).addClass('select' + game.present);
    //                 select_poker.list.push(poker1[min[min.length - 1]]);
    //                 select_poker.list.push(poker1[min[min.length - 2]]);
    //                 select_poker.list.push(poker1[min[min.length - 3]]);
    //                 select_poker.list.push(poker1[min[min.length - 4]]);
    //                 $('.talkCase').fadeIn(1000);
    //                 $('.talkCase').text('炸弹你就怂了？');
    //                 setTimeout(function () {
    //                     $('.talkCase').fadeOut(1000);
    //                 },2000)
    //                 break;
    //             case 110:
    //                 if (Huo) {
    //                     $('.talkCase').fadeIn(1000);
    //                     $('.talkCase').text('王炸，怂了吧！');
    //
    //                     setTimeout(function () {
    //                         $('.talkCase').fadeOut(1000);
    //                     },2000)
    //                 }
    //                 else {
    //                     return;
    //                 }
    //                 break
    //             default:
    //
    //                 break;
    //         }
    //
    //     };
    // }

    //音频播放
    function playMusic() {

        checkPokerAndPlayMusic()

        // 定义检查桌面牌型的方法	-----给声音方法
        function checkPokerAndPlayMusic() {
            // 1、先对玩家选择的牌进行重新排序
            desktop.list = pokerSort1(desktop.list);

            /*
                牌型代码表
                1       单张
                2       对子
                3       三张
                4       三带一
                5       三带二
                6       顺子
                7       四带二
                8       四带四
                9       四带六
                33       三张*n
                44       三带一*n
                55       三带二*n
                66       连对
                100       炸弹
                110       王炸
            */
            // 根据选择牌的数量来再进行判断牌型
            switch (desktop.list.length) {
                // 一张牌        单张
                case 1:
                    desktop.type = 1;							// 设置牌型为单张
                    desktop.max = desktop.list[0].number; 	// 设置判断值为该牌的点数
                    if (desktop.list[0].number == 1) {
                        music[2].play();
                    } else if (desktop.list[0].number == 2) {
                        music[3].play();
                    } else if (desktop.list[0].number == 3) {
                        music[4].play();
                    } else if (desktop.list[0].number == 4) {
                        music[5].play();
                    } else if (desktop.list[0].number == 5) {
                        music[6].play();
                    } else if (desktop.list[0].number == 6) {
                        music[7].play();
                    } else if (desktop.list[0].number == 7) {
                        music[8].play();
                    } else if (desktop.list[0].number == 8) {
                        music[9].play();
                    } else if (desktop.list[0].number == 9) {
                        music[10].play();
                    } else if (desktop.list[0].number == 10) {
                        music[11].play();
                    } else if (desktop.list[0].number == 11) {
                        music[12].play();
                    } else if (desktop.list[0].number == 12) {
                        music[0].play();
                    } else if (desktop.list[0].number == 13) {
                        music[1].play();
                    } else if (desktop.list[0].number == 14) {
                        if (desktop.list[0].color == 0) {
                            music[13].play();
                        } else {
                            music[14].play();
                        }
                    }
                    // return true;
                    break;
                // 两张牌        对子，王炸
                case 2:
                    if (desktop.list[0].number == desktop.list[1].number) {
                        if (desktop.list[0].number == 14) {
                            desktop.type = 110;						// 设置牌型为王炸
                            desktop.max = 14; 							// 设置判断值为该牌的点数
                            // console.log('王炸');
                            setTimeout(function () {
                                music[40].play();
                            }, 200);
                        } else {
                            desktop.type = 2;							// 设置牌型为对子
                            desktop.max = desktop.list[0].number; 	// 设置判断值为该牌的点数
                            // console.log('普通对子');
                            if (desktop.list[0].number == 1) {
                                music[17].play();
                            } else if (desktop.list[0].number == 2) {
                                music[18].play();
                            } else if (desktop.list[0].number == 3) {
                                music[19].play();
                            } else if (desktop.list[0].number == 4) {
                                music[20].play();
                            } else if (desktop.list[0].number == 5) {
                                music[21].play();
                            } else if (desktop.list[0].number == 6) {
                                music[22].play();
                            } else if (desktop.list[0].number == 7) {
                                music[23].play();
                            } else if (desktop.list[0].number == 8) {
                                music[24].play();
                            } else if (desktop.list[0].number == 9) {
                                music[25].play();
                            } else if (desktop.list[0].number == 10) {
                                music[26].play();
                            } else if (desktop.list[0].number == 11) {
                                music[27].play();
                            } else if (desktop.list[0].number == 12) {
                                music[15].play();
                            } else if (desktop.list[0].number == 13) {
                                music[16].play();
                            }
                        }
                        // return true;
                    }
                    break;
                // 三张牌        三张
                case 3:
                    if (desktop.list[0].number == desktop.list[2].number) {
                        desktop.type = 3;							// 设置牌型为三张
                        desktop.max = desktop.list[0].number; 	// 设置判断值为该牌的点数
                        // console.log('三不带');
                        // return true;
                    }
                    break;
                // 四张牌        炸弹、三带一
                case 4:
                    // 判断是否为炸弹
                    if (desktop.list[0].number == desktop.list[3].number) {
                        desktop.type = 100;							// 设置牌型为炸弹
                        desktop.max = desktop.list[0].number; 	// 设置判断值为该牌的点数
                        // console.log('炸弹');
                        setTimeout(function () {
                            music[39].play();
                        }, 1400);
                        // return true;
                    }

                    // 判断是否为三带一   	3334	3444	5559	 3666
                    else if (desktop.list[0].number == desktop.list[2].number ||
                        desktop.list[1].number == desktop.list[3].number) {
                        desktop.type = 4;							// 设置牌型为三带一
                        desktop.max = desktop.list[1].number; 	// 设置判断值为该牌的点数
                        // console.log('三带一');
                        music[35].play();
                        // return true;
                    }

                    break;
                // 五张牌        顺子、三带二
                case 5:
                    // 判断是否为顺子
                    if (checkStraight()) {
                        desktop.type = 6;							// 设置牌型为顺子
                        desktop.max = desktop.list[0].number; 	// 设置判断值为该牌的点数
                        // console.log('顺子*5');
                        music[32].play();
                        // return true;
                    }
                    // 判断是否为三带二
                    if (desktop.list[0].number == desktop.list[2].number &&   // 判断三带二的方法
                        desktop.list[3].number == desktop.list[4].number ||
                        desktop.list[0].number == desktop.list[1].number &&
                        desktop.list[2].number == desktop.list[4].number
                    ) {
                        desktop.type = 5;							// 设置牌型为三带二
                        desktop.max = desktop.list[2].number; 	// 设置判断值为该牌的点数
                        // console.log('三带二');
                        music[36].play();
                        // return true;
                    }
                    break;
                // 六张牌        顺子、3*连对、四带二、2*三张
                case 6:
                    // 判断是否为顺子
                    if (checkStraight()) {
                        desktop.type = 6;							// 设置牌型为顺子
                        desktop.max = desktop.list[0].number; 	// 设置判断值为该牌的点数
                        // console.log('顺子*6');
                        music[32].play();
                        // return true;
                    }

                    // 判断是否为连对
                    if (checkTwoPairs()) {
                        desktop.type = 66;							// 设置牌型为连对
                        desktop.max = desktop.list[0].number; 	// 设置判断值为该牌的点数
                        // console.log('连对*3');
                        music[33].play();
                        // return true;
                    }

                    // 判断是否为四带二		333345	344445	345555
                    if (desktop.list[0].number == desktop.list[3].number ||
                        desktop.list[1].number == desktop.list[4].number ||
                        desktop.list[2].number == desktop.list[5].number) {
                        desktop.type = 7;							// 设置牌型为四带二
                        desktop.max = desktop.list[2].number; 	// 设置判断值为该牌的点数
                        // console.log('四带二');
                        music[38].play();
                        // return true;
                    }

                    // 判断是否为两组三张的飞机		555666		333444
                    if (desktop.list[0].number == desktop.list[2].number &&
                        desktop.list[0].number == desktop.list[3].number - 1 &&
                        desktop.list[3].number == desktop.list[5].number) {
                        desktop.type = 33;								// 设置牌型为二个三张的飞机
                        desktop.max = desktop.list[0].number; 	// 设置判断值为该牌的点数
                        // console.log('两组不带的飞机');
                        music[34].play();
                        // return true;
                    }

                    break;
                // 七张牌        顺子
                case 7:
                    // 判断是否为顺子
                    if (checkStraight()) {
                        desktop.type = 6;							// 设置牌型为顺子
                        desktop.max = desktop.list[0].number; 	// 设置判断值为该牌的点数
                        console.log('顺子*7');
                        music[32].play();
                        // return true;
                    }
                    break;
                // 八张牌        顺子、4*连对、四带四、2*三带一
                case 8:
                    // 判断是否为顺子
                    if (checkStraight()) {
                        desktop.type = 6;							// 设置牌型为顺子
                        desktop.max = desktop.list[0].number; 	// 设置判断值为该牌的点数
                        // console.log('顺子*8');
                        music[32].play();
                        // return true;
                    }

                    // 判断是否为连对
                    if (checkTwoPairs()) {
                        desktop.type = 66;							// 设置牌型为连对
                        desktop.max = desktop.list[0].number; 	// 设置判断值为该牌的点数
                        // console.log('连对*4');
                        music[33].play();
                        // return true;
                    }

                    // 判断是否为四带四		33334455	33444455	33445555
                    if (desktop.list[0].number == desktop.list[3].number &&
                        desktop.list[4].number == desktop.list[5].number &&
                        desktop.list[6].number == desktop.list[7].number ||

                        desktop.list[0].number == desktop.list[1].number &&
                        desktop.list[2].number == desktop.list[5].number &&
                        desktop.list[6].number == desktop.list[7].number ||

                        desktop.list[0].number == desktop.list[1].number &&
                        desktop.list[2].number == desktop.list[3].number &&
                        desktop.list[4].number == desktop.list[7].number) {
                        desktop.type = 8;							// 设置牌型为四带二
                        desktop.max = desktop.list[2].number; 	// 设置判断值为该牌的点数
                        // console.log('四带四');
                        music[37].play();
                        // return true;
                    }

                    // 判断是否为两个三带一的飞机		34777888	35556668	36667779
                    if (desktop.list[0].number == desktop.list[2].number &&
                        desktop.list[0].number == desktop.list[3].number - 1 &&
                        desktop.list[3].number == desktop.list[5].number ||
                        desktop.list[1].number == desktop.list[3].number &&
                        desktop.list[1].number == desktop.list[4].number - 1 &&
                        desktop.list[4].number == desktop.list[6].number ||
                        desktop.list[2].number == desktop.list[4].number &&
                        desktop.list[2].number == desktop.list[5].number - 1 &&
                        desktop.list[5].number == desktop.list[7].number) {
                        desktop.type = 44;								// 设置牌型为二个三带一的飞机
                        desktop.max = desktop.list[2].number; 	// 设置判断值为该牌的点数
                        // console.log('两组三带一的飞机');
                        music[34].play();
                        // return true;
                    }


                    break;
                // 九张牌        顺子、3*三张
                case 9:
                    // 判断是否为顺子
                    if (checkStraight()) {
                        desktop.type = 6;							// 设置牌型为顺子
                        desktop.max = desktop.list[0].number; 	// 设置判断值为该牌的点数
                        // console.log('顺子*9');
                        music[32].play();
                        // return true;
                    }

                    // 判断是否为三个连续的三张
                    if (checkThreeAirplane()) {
                        desktop.type = 33;								// 设置牌型为三个三张的飞机
                        desktop.max = desktop.list[0].number; 	// 设置判断值为该牌的点数
                        // console.log('三组不带三张');
                        music[34].play();
                        // return true;
                    }
                    break;
                // 十张牌        顺子、5*连对、2*三带二、四带六
                case 10:
                    // 判断是否为顺子
                    if (checkStraight()) {
                        desktop.type = 6;							// 设置牌型为顺子
                        desktop.max = desktop.list[0].number; 	// 设置判断值为该牌的点数
                        // console.log('顺子*10');
                        music[32].play();
                        // return true;
                    }

                    // 判断是否为连对
                    if (checkTwoPairs()) {
                        desktop.type = 66;							// 设置牌型为连对
                        desktop.max = desktop.list[0].number; 	// 设置判断值为该牌的点数
                        // console.log('连对*5');
                        music[33].play();
                        // return true;
                    }

                    // 判断是否为两个三带二的飞机		//   3344 777888	//   33 555666 88	//   666777 8899	下标：4
                    if (desktop.list[0].number == desktop.list[1].number &&
                        desktop.list[2].number == desktop.list[3].number &&
                        desktop.list[4].number == desktop.list[6].number &&
                        desktop.list[7].number == desktop.list[9].number &&
                        desktop.list[4].number == desktop.list[7].number - 1 ||

                        desktop.list[0].number == desktop.list[1].number &&
                        desktop.list[2].number == desktop.list[4].number &&
                        desktop.list[5].number == desktop.list[7].number &&
                        desktop.list[8].number == desktop.list[9].number &&
                        desktop.list[2].number == desktop.list[8].number - 1 ||

                        desktop.list[0].number == desktop.list[2].number &&
                        desktop.list[3].number == desktop.list[5].number &&
                        desktop.list[6].number == desktop.list[7].number &&
                        desktop.list[8].number == desktop.list[9].number &&
                        desktop.list[0].number == desktop.list[6].number - 1) {
                        desktop.type = 55;								// 设置牌型为二个三带二的飞机
                        desktop.max = desktop.list[4].number; 	// 设置判断值为该牌的点数
                        // console.log('两组三带二的飞机');
                        music[34].play();
                        // return true;
                    }

                    // 判断是否为四带六		3333444555	3334444555	3334445555
                    if (desktop.list[0].number == desktop.list[3].number &&
                        desktop.list[4].number == desktop.list[6].number &&
                        desktop.list[7].number == desktop.list[9].number ||

                        desktop.list[0].number == desktop.list[2].number &&
                        desktop.list[3].number == desktop.list[6].number &&
                        desktop.list[7].number == desktop.list[9].number ||

                        desktop.list[0].number == desktop.list[2].number &&
                        desktop.list[3].number == desktop.list[5].number &&
                        desktop.list[6].number == desktop.list[9].number) {
                        desktop.type = 9;							// 设置牌型为四带二
                        desktop.max = desktop.list[2].number; 	// 设置判断值为该牌的点数
                        // console.log('四带六');
                        music[34].play();
                        // return true;
                    }

                    break;
                // 十一张牌      顺子
                case 11:
                    // 判断是否为顺子
                    if (checkStraight()) {
                        desktop.type = 6;							// 设置牌型为顺子
                        desktop.max = desktop.list[0].number; 	// 设置判断值为该牌的点数
                        // console.log('顺子*11');
                        music[32].play();
                        // return true;
                    }
                    break;
                // 十二张牌      顺子、6*连对、3*三带一、4*三张
                case 12:
                    // 判断是否为顺子
                    if (checkStraight()) {
                        desktop.type = 6;							// 设置牌型为顺子
                        desktop.max = desktop.list[0].number; 	// 设置判断值为该牌的点数
                        // console.log('顺子*12');
                        music[33].play();
                        // return true;
                    }

                    // 判断是否为连对
                    if (checkTwoPairs()) {
                        desktop.type = 66;							// 设置牌型为连对
                        desktop.max = desktop.list[0].number; 	// 设置判断值为该牌的点数
                        // console.log('连对*6');
                        music[33].play();
                        // return true;
                    }

                    // 判断是否为四个连续的三张
                    if (checkThreeAirplane()) {
                        desktop.type = 33;								// 设置牌型为四个三张的飞机
                        desktop.max = desktop.list[0].number; 	// 设置判断值为该牌的点数
                        // console.log('四组连续的三张');
                        music[34].play();
                        // return true;
                    }

                    // 判断是否为三个三带一的飞机	   012 345 678 9TE 	下标：4
                    if (	// 345 666777888
                    desktop.list[3].number == desktop.list[5].number &&
                    desktop.list[6].number == desktop.list[8].number &&
                    desktop.list[9].number == desktop.list[11].number &&
                    desktop.list[3].number == desktop.list[9].number - 2 ||
                    // 34 666777888 J
                    desktop.list[2].number == desktop.list[4].number &&
                    desktop.list[5].number == desktop.list[7].number &&
                    desktop.list[8].number == desktop.list[10].number &&
                    desktop.list[2].number == desktop.list[8].number - 2 ||
                    // 3 666777888 JQ
                    desktop.list[1].number == desktop.list[3].number &&
                    desktop.list[4].number == desktop.list[6].number &&
                    desktop.list[7].number == desktop.list[9].number &&
                    desktop.list[1].number == desktop.list[7].number - 2 ||
                    // 666777888 JQK
                    desktop.list[0].number == desktop.list[2].number &&
                    desktop.list[3].number == desktop.list[5].number &&
                    desktop.list[6].number == desktop.list[8].number &&
                    desktop.list[0].number == desktop.list[6].number - 2) {
                        desktop.type = 44;								// 设置牌型为三个三带一的飞机
                        desktop.max = desktop.list[4].number; 	// 设置判断值为该牌的点数
                        // console.log('三组三带一的飞机');
                        music[34].play();
                        // return true;
                    }
                    break;
                // 十四张牌      7*对子
                case 14:
                    // 判断是否为连对
                    if (checkTwoPairs()) {
                        desktop.type = 66;							// 设置牌型为连对
                        desktop.max = desktop.list[0].number; 	// 设置判断值为该牌的点数
                        // console.log('连对*7');
                        music[33].play();
                        // return true;
                    }
                    break;
                // 十五张牌      5*三张、5*三带二
                case 15:
                    // 判断牌型为五个三张的飞机
                    if (checkThreeAirplane()) {
                        desktop.type = 33;								// 设置牌型为五个三张的飞机
                        desktop.max = desktop.list[0].number; 	// 设置判断值为该牌的点数
                        // console.log('五组三带一');
                        music[34].play();
                        // return true;
                    }

                    // 判断牌型为三个三带二		666777888	33	44	55	  JJ QQ KK
                    if (	//	334455 666777888	下标6开始判断
                    desktop.list[0].number == desktop.list[1].number &&
                    desktop.list[2].number == desktop.list[3].number &&
                    desktop.list[4].number == desktop.list[5].number &&
                    desktop.list[6].number == desktop.list[8].number &&
                    desktop.list[9].number == desktop.list[11].number &&
                    desktop.list[12].number == desktop.list[14].number &&
                    desktop.list[6].number == desktop.list[12].number - 2 ||
                    //	3344 666777888 JJ	下标4开始判断
                    desktop.list[0].number == desktop.list[1].number &&
                    desktop.list[2].number == desktop.list[3].number &&
                    desktop.list[4].number == desktop.list[6].number &&
                    desktop.list[7].number == desktop.list[9].number &&
                    desktop.list[10].number == desktop.list[12].number &&
                    desktop.list[13].number == desktop.list[14].number &&
                    desktop.list[4].number == desktop.list[10].number - 2 ||
                    //	33 666777888 JJQQ	下标2开始判断
                    desktop.list[0].number == desktop.list[1].number &&
                    desktop.list[2].number == desktop.list[4].number &&
                    desktop.list[5].number == desktop.list[7].number &&
                    desktop.list[8].number == desktop.list[10].number &&
                    desktop.list[11].number == desktop.list[12].number &&
                    desktop.list[13].number == desktop.list[14].number &&
                    desktop.list[2].number == desktop.list[8].number - 2 ||
                    //	666777888 JJQQKK	下标0开始判断
                    desktop.list[0].number == desktop.list[2].number &&
                    desktop.list[3].number == desktop.list[5].number &&
                    desktop.list[6].number == desktop.list[8].number &&
                    desktop.list[9].number == desktop.list[10].number &&
                    desktop.list[11].number == desktop.list[12].number &&
                    desktop.list[13].number == desktop.list[14].number &&
                    desktop.list[0].number == desktop.list[6].number - 2) {
                        desktop.type = 55;								// 设置牌型为三个三带二的飞机
                        desktop.max = desktop.list[7].number; 	// 设置判断值为该牌的点数
                        // console.log('三组三带二');
                        music[34].play();
                        // return true;
                    }
                    break;
                // 十六张牌      8*连对、4*三带一
                case 16:
                    // 判断牌型为连对
                    if (checkTwoPairs()) {
                        desktop.type = 66;							// 设置牌型为连对
                        desktop.max = desktop.list[0].number; 	// 设置判断值为该牌的点数
                        // console.log('连对*8');
                        music[33].play();
                        // return true;
                    }
                    // 判断牌型为四个三带一		3456 777888999MMM JQKA    0123456789SYESSW
                    if (	    //  777888999MMM JQKA
                    desktop.list[0].number == desktop.list[2].number &&
                    desktop.list[3].number == desktop.list[5].number &&
                    desktop.list[6].number == desktop.list[8].number &&
                    desktop.list[9].number == desktop.list[11].number &&
                    desktop.list[0].number == desktop.list[9].number - 3 ||
                    //  3 777888999MMM JQK
                    desktop.list[1].number == desktop.list[3].number &&
                    desktop.list[4].number == desktop.list[6].number &&
                    desktop.list[7].number == desktop.list[9].number &&
                    desktop.list[10].number == desktop.list[12].number &&
                    desktop.list[1].number == desktop.list[10].number - 3 ||
                    //  34 777888999MMM JQ
                    desktop.list[2].number == desktop.list[4].number &&
                    desktop.list[5].number == desktop.list[7].number &&
                    desktop.list[8].number == desktop.list[10].number &&
                    desktop.list[11].number == desktop.list[13].number &&
                    desktop.list[2].number == desktop.list[11].number - 3 ||
                    //  345 777888999MMM J
                    desktop.list[3].number == desktop.list[5].number &&
                    desktop.list[6].number == desktop.list[8].number &&
                    desktop.list[9].number == desktop.list[11].number &&
                    desktop.list[12].number == desktop.list[14].number &&
                    desktop.list[3].number == desktop.list[12].number - 3 ||
                    //  3456 777888999MMM
                    desktop.list[4].number == desktop.list[6].number &&
                    desktop.list[7].number == desktop.list[9].number &&
                    desktop.list[10].number == desktop.list[12].number &&
                    desktop.list[13].number == desktop.list[15].number &&
                    desktop.list[4].number == desktop.list[13].number - 3) {
                        desktop.type = 44;								// 设置牌型为三个三带一的飞机
                        desktop.max = desktop.list[5].number; 	// 设置判断值为该牌的点数
                        music[34].play();
                        // return true;
                    }
                    break;
                // 十八张牌      9*连对、6*三张
                case 18:
                    // 判断牌型为连对
                    if (checkTwoPairs()) {
                        desktop.type = 66;							// 设置牌型为连对
                        desktop.max = desktop.list[0].number; 	// 设置判断值为该牌的点数
                        // console.log('连对*9');
                        music[33].play();
                        // return true;
                    }

                    // 判断牌型为六个三张的飞机
                    if (checkThreeAirplane()) {
                        desktop.type = 33;								// 设置牌型为六个三张的飞机
                        desktop.max = desktop.list[0].number; 	// 设置判断值为该牌的点数
                        music[34].play();
                        // return true;
                    }
                    break;
                // 二十张牌      10*连对、5*三带一、5*三带二
                case 20:
                    // 判断牌型为连对
                    if (checkTwoPairs()) {
                        desktop.type = 66;							// 设置牌型为连对
                        desktop.max = desktop.list[0].number; 	// 设置判断值为该牌的点数
                        // console.log('连对*10');
                        music[33].play();
                        // return true;
                    }

                    // 判断牌型为五个三带一		3456s 777888999MMMJJJ QKA2G    0123 4567 89SY ESSW
                    if (	// 777888999MMMJJJ QKA2G        0-5
                    desktop.list[0].number == desktop.list[2].number &&
                    desktop.list[3].number == desktop.list[5].number &&
                    desktop.list[6].number == desktop.list[8].number &&
                    desktop.list[9].number == desktop.list[11].number &&
                    desktop.list[12].number == desktop.list[14].number &&
                    desktop.list[0].number == desktop.list[12].number - 4 ||
                    //  3 777888999MMMJJJ QKA2          1-4
                    desktop.list[1].number == desktop.list[3].number &&
                    desktop.list[4].number == desktop.list[6].number &&
                    desktop.list[7].number == desktop.list[9].number &&
                    desktop.list[10].number == desktop.list[12].number &&
                    desktop.list[13].number == desktop.list[15].number &&
                    desktop.list[1].number == desktop.list[13].number - 4 ||
                    //  34 777888999MMMJJJ QKA         2-3
                    desktop.list[2].number == desktop.list[4].number &&
                    desktop.list[5].number == desktop.list[7].number &&
                    desktop.list[8].number == desktop.list[10].number &&
                    desktop.list[11].number == desktop.list[13].number &&
                    desktop.list[14].number == desktop.list[16].number &&
                    desktop.list[2].number == desktop.list[14].number - 4 ||
                    //  345 777888999MMMJJJ QK         3-2
                    desktop.list[3].number == desktop.list[5].number &&
                    desktop.list[6].number == desktop.list[8].number &&
                    desktop.list[9].number == desktop.list[11].number &&
                    desktop.list[12].number == desktop.list[14].number &&
                    desktop.list[15].number == desktop.list[17].number &&
                    desktop.list[3].number == desktop.list[15].number - 4 ||
                    //  3456 777888999MMMJJJ Q         4-1
                    desktop.list[4].number == desktop.list[6].number &&
                    desktop.list[7].number == desktop.list[9].number &&
                    desktop.list[10].number == desktop.list[12].number &&
                    desktop.list[13].number == desktop.list[15].number &&
                    desktop.list[16].number == desktop.list[18].number &&
                    desktop.list[4].number == desktop.list[16].number - 4 ||
                    //  3456S 777888999MMMJJJ          5-0
                    desktop.list[5].number == desktop.list[7].number &&
                    desktop.list[8].number == desktop.list[10].number &&
                    desktop.list[11].number == desktop.list[13].number &&
                    desktop.list[14].number == desktop.list[16].number &&
                    desktop.list[17].number == desktop.list[19].number &&
                    desktop.list[5].number == desktop.list[17].number - 4) {
                        desktop.type = 44;								// 设置牌型为五个三带一的飞机
                        desktop.max = desktop.list[5].number; 	// 设置判断值为该牌的点数
                        music[34].play();
                        // return true;
                    }

                    // 判断牌型为四个三带二   33 44 55 66  777888999MMM  JJ QQ KK AA
                    if (	//	33445566  777888999MMM	 下标8开始判断
                    desktop.list[0].number == desktop.list[1].number &&
                    desktop.list[2].number == desktop.list[3].number &&
                    desktop.list[4].number == desktop.list[5].number &&
                    desktop.list[6].number == desktop.list[7].number &&
                    desktop.list[8].number == desktop.list[10].number &&
                    desktop.list[11].number == desktop.list[13].number &&
                    desktop.list[14].number == desktop.list[16].number &&
                    desktop.list[17].number == desktop.list[19].number &&
                    desktop.list[8].number == desktop.list[17].number - 4 ||
                    //	334455 777888999MMM JJ	 下标6开始判断
                    desktop.list[0].number == desktop.list[1].number &&
                    desktop.list[2].number == desktop.list[3].number &&
                    desktop.list[4].number == desktop.list[5].number &&
                    desktop.list[6].number == desktop.list[8].number &&
                    desktop.list[9].number == desktop.list[11].number &&
                    desktop.list[12].number == desktop.list[14].number &&
                    desktop.list[15].number == desktop.list[17].number &&
                    desktop.list[18].number == desktop.list[19].number &&
                    desktop.list[6].number == desktop.list[15].number - 4 ||
                    //	3344 777888999MMM JJQQ	 下标4开始判断
                    desktop.list[0].number == desktop.list[1].number &&
                    desktop.list[2].number == desktop.list[3].number &&
                    desktop.list[4].number == desktop.list[6].number &&
                    desktop.list[7].number == desktop.list[9].number &&
                    desktop.list[10].number == desktop.list[12].number &&
                    desktop.list[13].number == desktop.list[15].number &&
                    desktop.list[16].number == desktop.list[17].number &&
                    desktop.list[18].number == desktop.list[19].number &&
                    desktop.list[4].number == desktop.list[13].number - 4 ||
                    //	33 777888999MMM JJQQKK	 下标2开始判断
                    desktop.list[0].number == desktop.list[1].number &&
                    desktop.list[2].number == desktop.list[4].number &&
                    desktop.list[5].number == desktop.list[7].number &&
                    desktop.list[8].number == desktop.list[10].number &&
                    desktop.list[11].number == desktop.list[13].number &&
                    desktop.list[14].number == desktop.list[15].number &&
                    desktop.list[16].number == desktop.list[17].number &&
                    desktop.list[18].number == desktop.list[19].number &&
                    desktop.list[2].number == desktop.list[11].number - 4 ||
                    //	777888999MMM JJQQKKAA	下标0开始判断
                    desktop.list[0].number == desktop.list[2].number &&
                    desktop.list[3].number == desktop.list[5].number &&
                    desktop.list[6].number == desktop.list[8].number &&
                    desktop.list[9].number == desktop.list[11].number &&
                    desktop.list[12].number == desktop.list[13].number &&
                    desktop.list[14].number == desktop.list[15].number &&
                    desktop.list[16].number == desktop.list[17].number &&
                    desktop.list[18].number == desktop.list[19].number &&
                    desktop.list[0].number == desktop.list[9].number - 4) {
                        desktop.type = 55;								// 设置牌型为四个三带二的飞机
                        desktop.max = desktop.list[7].number; 	// 设置判断值为该牌的点数
                        music[34].play();
                        // return true;
                    }
                    break;



                // 默认false
                default:
                    return;
            }

            // return false;
        }

        // 定义检查桌面牌型为顺子的方法	-----给声音方法
        function checkStraight() {
            // 判断最大的值不能大于12
            if (desktop.list[desktop.list.length - 1].number > 12) {
                return false;
            }

            for (let i = 0; i < desktop.list.length - 1; i++) {
                if (desktop.list[i].number != desktop.list[i + 1].number - 1) {
                    return false;
                }
            }
            return true;
        }

        // 定义检查桌面牌型为连对的方法	-----给声音方法
        function checkTwoPairs() {

            // 判断最大的值不能大于12
            if (desktop.list[desktop.list.length - 1].number > 12) {
                return false;
            }

            // 单独判断每隔两位的相邻两位的值是相等的
            for (var i = 0; i < desktop.list.length - 1; i += 2) {
                if (desktop.list[i].number != desktop.list[i + 1].number) {
                    return false;
                }
            }

            switch (desktop.list.length) {
                case 6:
                    if (desktop.list[0].number == desktop.list[1].number &&
                        desktop.list[0].number == desktop.list[2].number - 1 &&
                        desktop.list[0].number == desktop.list[4].number - 2) {
                        return true;
                    }
                    break;
                case 8:
                    if (desktop.list[0].number == desktop.list[1].number &&
                        desktop.list[0].number == desktop.list[2].number - 1 &&
                        desktop.list[0].number == desktop.list[4].number - 2 &&
                        desktop.list[0].number == desktop.list[6].number - 3) {
                        return true;
                    }
                    break;
                case 10:
                    if (desktop.list[0].number == desktop.list[1].number &&
                        desktop.list[0].number == desktop.list[2].number - 1 &&
                        desktop.list[0].number == desktop.list[4].number - 2 &&
                        desktop.list[0].number == desktop.list[6].number - 3 &&
                        desktop.list[0].number == desktop.list[8].number - 4) {
                        return true;
                    }
                    break;
                case 12:
                    if (desktop.list[0].number == desktop.list[1].number &&
                        desktop.list[0].number == desktop.list[2].number - 1 &&
                        desktop.list[0].number == desktop.list[4].number - 2 &&
                        desktop.list[0].number == desktop.list[6].number - 3 &&
                        desktop.list[0].number == desktop.list[8].number - 4 &&
                        desktop.list[0].number == desktop.list[10].number - 5) {
                        return true;
                    }
                    break;
                case 14:
                    if (desktop.list[0].number == desktop.list[1].number &&
                        desktop.list[0].number == desktop.list[2].number - 1 &&
                        desktop.list[0].number == desktop.list[4].number - 2 &&
                        desktop.list[0].number == desktop.list[6].number - 3 &&
                        desktop.list[0].number == desktop.list[8].number - 4 &&
                        desktop.list[0].number == desktop.list[10].number - 5 &&
                        desktop.list[0].number == desktop.list[12].number - 6) {
                        return true;
                    }
                    break;
                case 16:
                    if (desktop.list[0].number == desktop.list[1].number &&
                        desktop.list[0].number == desktop.list[2].number - 1 &&
                        desktop.list[0].number == desktop.list[4].number - 2 &&
                        desktop.list[0].number == desktop.list[6].number - 3 &&
                        desktop.list[0].number == desktop.list[8].number - 4 &&
                        desktop.list[0].number == desktop.list[10].number - 5 &&
                        desktop.list[0].number == desktop.list[12].number - 6 &&
                        desktop.list[0].number == desktop.list[14].number - 7) {
                        return true;
                    }
                    break;
                case 18:
                    if (desktop.list[0].number == desktop.list[1].number &&
                        desktop.list[0].number == desktop.list[2].number - 1 &&
                        desktop.list[0].number == desktop.list[4].number - 2 &&
                        desktop.list[0].number == desktop.list[6].number - 3 &&
                        desktop.list[0].number == desktop.list[8].number - 4 &&
                        desktop.list[0].number == desktop.list[10].number - 5 &&
                        desktop.list[0].number == desktop.list[12].number - 6 &&
                        desktop.list[0].number == desktop.list[14].number - 7 &&
                        desktop.list[0].number == desktop.list[16].number - 8) {
                        return true;
                    }
                    break;
                case 20:
                    if (desktop.list[0].number == desktop.list[1].number &&
                        desktop.list[0].number == desktop.list[2].number - 1 &&
                        desktop.list[0].number == desktop.list[4].number - 2 &&
                        desktop.list[0].number == desktop.list[6].number - 3 &&
                        desktop.list[0].number == desktop.list[8].number - 4 &&
                        desktop.list[0].number == desktop.list[10].number - 5 &&
                        desktop.list[0].number == desktop.list[12].number - 6 &&
                        desktop.list[0].number == desktop.list[14].number - 7 &&
                        desktop.list[0].number == desktop.list[16].number - 8 &&
                        desktop.list[0].number == desktop.list[18].number - 9) {
                        return true;
                    }
                    break;

                // 默认false
                default:
                    return false;
            }
            return false;
        }

        // 定义检查桌面牌型为三不带飞机的方法	-----给声音方法
        function checkThreeAirplane() {

            // 判断最大的值不能大于12
            if (desktop.list[desktop.list.length - 1].number > 12) {
                return false;
            }

            // 使用遍历方法来判断每三位的值是相等的
            for (let i = 0; i < desktop.list.length - 4; i += 3) {
                if (desktop.list[i].number != desktop.list[i + 3].number) {
                    return false;
                }
            }

            switch (desktop.list.length) {
                case 6:
                    if (desktop.list[0].number == desktop.list[2].number &&
                        desktop.list[3].number == desktop.list[5].number &&
                        desktop.list[0].number == desktop.list[3].number - 1) {
                        return true;
                    }
                    break;
                case 9:
                    if (desktop.list[0].number == desktop.list[2].number &&
                        desktop.list[3].number == desktop.list[5].number &&
                        desktop.list[6].number == desktop.list[8].number &&
                        desktop.list[0].number == desktop.list[6].number - 2) {
                        return true;
                    }
                    break;
                case 12:
                    if (desktop.list[0].number == desktop.list[2].number &&
                        desktop.list[3].number == desktop.list[5].number &&
                        desktop.list[6].number == desktop.list[8].number &&
                        desktop.list[9].number == desktop.list[11].number &&
                        desktop.list[0].number == desktop.list[9].number - 3) {
                        return true;
                    }
                    break;
                case 15:
                    if (desktop.list[0].number == desktop.list[2].number &&
                        desktop.list[3].number == desktop.list[5].number &&
                        desktop.list[6].number == desktop.list[8].number &&
                        desktop.list[9].number == desktop.list[11].number &&
                        desktop.list[12].number == desktop.list[14].number &&
                        desktop.list[0].number == desktop.list[12].number - 4) {
                        return true;
                    }
                    break;
                case 18:
                    if (desktop.list[0].number == desktop.list[1].number &&
                        desktop.list[3].number == desktop.list[5].number &&
                        desktop.list[6].number == desktop.list[8].number &&
                        desktop.list[9].number == desktop.list[11].number &&
                        desktop.list[12].number == desktop.list[14].number &&
                        desktop.list[15].number == desktop.list[17].number &&
                        desktop.list[0].number == desktop.list[15].number - 5) {
                        return true;
                    }
                    break;

                // 默认false
                default:
                    return false;
            }
            return true;
        }

    }

    $('.gameOverBtn').click(function () {
        location.reload();
    });
    let tip = [];

    function addNum(arr, num) {
        for (var i = 0; i < num; i++) {
            arr.push(i);
        }
    }

    function tipPoker() {
        function getIndex() {
            let number;
            if (tip.length == 0) {
                number = 0;
            }
            else {
                number = Number(tip[0]) + 1;
                tip = [];
            }
            return number;
        }

        //定义一个空数组 排除大于13的数
        var puke = [];
        for (var i = 0; i < play[game.present].poker.length; i++) {
            if (play[game.present].poker[i].number < 13) {
                puke.push(play[game.present].poker[i]);
            }
        }

        switch (desktop.type) {
            case 0:
                tip.push(getIndex());
                break;

            //    单张提示
            case 1:
                //如果是大王  则直接判断花色
                if (desktop.max == 14 && play[game.present].poker[play[game.present].poker.length - 1].number == 14 &&
                    play[game.present].poker[play[game.present].poker.length - 1].color == 1) {
                    tip.push(play[game.present].poker.length - 1);
                }
                //判断单张大小
                for (let i = getIndex(); i < play[game.present].poker.length; i++) {
                    if (play[game.present].poker[i].number > Number(desktop.max)) {
                        // console.log(play[game.present].poker[i].number);
                        tip.push(i);
                        break;
                    }
                }
                break;
            //    对子提示
            case 2:
                for (var i = getIndex(); i < play[game.present].poker.length - 1; i++) {
                    if (play[game.present].poker[i].number > Number(desktop.max)
                        && play[game.present].poker[i].number == play[game.present].poker[i + 1].number) {
                        tip.push(i);
                        tip.push(i + 1);
                        break;
                    }
                }
                break;
            //    三张提示
            case 3:
                for (var i = getIndex(); i < play[game.present].poker.length - 2; i++) {
                    if (Number(play[game.present].poker[i].number) > Number(desktop.max) &&
                        Number(play[game.present].poker[i].number) == Number(play[game.present].poker[i + 2].number)) {
                        tip.push(i);
                        tip.push(i + 1);
                        tip.push(i + 2);
                        break;
                    }
                }
                break;
            //    三带一提示
            case 4:
                for (var i = getIndex(); i < play[game.present].poker.length - 2; i++) {  //先判断3张 再找一张最小的单牌 且不是跟三张那一张
                    if (Number(play[game.present].poker[i].number) > Number(desktop.max) &&
                        Number(play[game.present].poker[i].number) == Number(play[game.present].poker[i + 2].number)) {
                        tip.push(i);
                        tip.push(i + 1);
                        tip.push(i + 2);
                        (i == 0) ? tip.push(3) : tip.push(0);
                        break;
                    }
                }
                break;
            //    三带二提示
            case 5:
                for (var i = getIndex(); i < play[game.present].poker.length - 2; i++) {
                    if (Number(play[game.present].poker[i].number) > Number(desktop.max) &&
                        Number(play[game.present].poker[i].number) == Number(play[game.present].poker[i + 2].number)) {
                        for (var j = getIndex(); j < play[game.present].poker.length - 1; j++) {
                            if (i != j && i + 1 != j && i + 2 != j && play[game.present].poker[j].number == play[game.present].poker[j + 1].number) {
                                tip.push(i);
                                tip.push(i + 1);
                                tip.push(i + 2);
                                tip.push(j);
                                tip.push(j + 1);
                                break;
                            }
                        }
                    }
                }
                break;
            //    顺子提示
            case 6:
                for (var i = getIndex(); i < puke.length; i++) {
                    if (play[game.present].poker[i].number > desktop.max) {
                        var arr = [];
                        arr.push(i);
                        for (var j = i + 1; j < puke.length; j++) {
                            //要与arr数组里面的最后一个相等
                            if (play[game.present].poker[j].number - 1 == play[game.present].poker[arr[arr.length - 1]].number) {//如果后面的不相等 就返回 重新遍历
                                arr.push(j);
                                if (arr.length == desktop.list.length) {
                                    return arr;
                                    break;
                                }
                            }
                        }
                    }
                }
                break;
            //    连对
            case 66:
                for (var i = getIndex(); i < puke.length - 1; i++) {
                    if (desktop.max < play[game.present].poker[i].number && play[game.present].poker[i + 1].number == play[game.present].poker[i].number) {
                        var arrDui = [];
                        arrDui.push(i);
                        arrDui.push(i + 1);
                        //判断是否跟arr的最后一个加1
                        for (var j = i + 2; j < puke.length - 1; j++) {
                            if (play[game.present].poker[j].number == play[game.present].poker[j + 1].number &&
                                play[game.present].poker[j].number == Number(play[game.present].poker[arrDui[arrDui.length - 1]].number) + 1) {
                                arrDui.push(j);
                                arrDui.push(j + 1);
                                if (arrDui.length == desktop.list.length) {
                                    return arrDui;
                                    break;
                                }
                            }
                        }
                    }
                }
                break;
            //    炸弹
            case 100:
                for (var i = getIndex(); i < play[game.present].poker.length - 3; i++) {
                    if (play[game.present].poker[i].number > desktop.max &&
                        play[game.present].poker[i].number == play[game.present].poker[i + 3].number) {
                        tip.push(i);
                        tip.push(i + 1);
                        tip.push(i + 2);
                        tip.push(i + 3);
                        break;
                    }
                }
                break;

            //        飞机
            case 33:
                for (var i = getIndex(); i < puke.length - 2; i++) {
                    if (play[game.present].poker[i].number > desktop.max &&
                        play[game.present].poker[i].number == play[game.present].poker[i + 2].number) {
                        var arr = [];
                        arr.push(i);
                        arr.push(i + 1);
                        arr.push(i + 2);
                        for (var j = i + 2; j < puke.length - 2; j++) {
                            if (play[game.present].poker[j].number == play[game.present].poker[j + 2].number &&
                                play[game.present].poker[j].number == Number(play[game.present].poker[arr[arr.length - 1]].number) + 1) {
                                arr.push(j);
                                arr.push(j + 1);
                                arr.push(j + 2);
                                if (arr.length == desktop.list.length) {
                                    return arr;
                                    break;
                                }
                            }
                        }
                    }
                }
                break;
            //    飞机带单
            case 44:
                for (var i = getIndex(); i < puke.length; i++) {
                    if (play[game.present].poker[i].number > desktop.max &&
                        play[game.present].poker[i].number == play[game.present].poker[i + 2].number) {
                        var arr = [];
                        arr.push(i);
                        arr.push(i + 1);
                        arr.push(i + 2);
                        for (var j = i + 2; j < puke.length - 2; j++) {
                            if (play[game.present].poker[j].number == play[game.present].poker[j + 2].number &&
                                play[game.present].poker[j].number == Number(play[game.present].poker[arr[arr.length - 1]].number) + 1) {
                                arr.push(j);
                                arr.push(j + 1);
                                arr.push(j + 2);
                                if (i == 1) {
                                    arr.push(arr.length + 0);
                                    arr.push(arr.length + 1);
                                }
                                else {
                                    arr.push(0);
                                    arr.push(1);
                                }
                                if (arr.length == desktop.list.length) {
                                    return arr;
                                    break;
                                }
                            }
                        }
                    }
                }
                break;
            //    飞机带双
            case 55:
                for (var i = getIndex(); i < puke.length; i++) {
                    if (play[game.present].poker[i].number > desktop.max &&
                        play[game.present].poker[i].number == play[game.present].poker[i + 2].number) {
                        var arr = [];
                        arr.push(i);
                        arr.push(i + 1);
                        arr.push(i + 2);
                        for (var j = i + 2; j < puke.length - 2; j++) {
                            if (play[game.present].poker[j].number == play[game.present].poker[j + 2].number &&
                                play[game.present].poker[j].number == Number(play[game.present].poker[arr[arr.length - 1]].number) + 1) {
                                arr.push(j);
                                arr.push(j + 1);
                                arr.push(j + 2);
                                if (arr.length == (desktop.list.length / 5) * 3) {
                                    var num = [];//保存对子
                                    for (var n = 0; n < play[game.present].poker.length - 1; n++) {
                                        //对子的数值不能跟飞机的数值一样
                                        if (play[game.present].poker[i].number != play[game.present].poker[n].number &&
                                            play[game.present].poker[j].number != play[game.present].poker[n].number &&
                                            play[game.present].poker[n].number == play[game.present].poker[n + 1].number) {
                                            num.push(n);
                                            num.push(n + 1);
                                            n = n + 1;
                                            if (num.length == (desktop.list.length / 5) * 2) {
                                                arr = arr.concat(num); //连接数组
                                                return arr;
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                break;
        }
        if (tip.length == 0) {
            //炸弹
            if (100 > desktop.type) {
                for (var i = getIndex(); i < play[game.present].poker.length - 3; i++) {
                    if (play[game.present].poker[i].number == play[game.present].poker[i + 3].number) {
                        tip.push(i);
                        tip.push(i + 1);
                        tip.push(i + 2);
                        tip.push(i + 3);
                        return tip;
                        break;
                    }
                    else if (play[game.present].poker[play[game.present].poker.length - 1].number == 14 && play[game.present].poker[play[game.present].poker.length - 2].number == 14) {
                        tip.push(play[game.present].poker.length - 1);
                        tip.push(play[game.present].poker.length - 2);
                        return tip;
                    }
                }
            }
            else {
                if (play[game.present].poker[play[game.present].poker.length - 1].number == 14 && play[game.present].poker[play[game.present].poker.length - 2].number == 14) {
                    tip.push(play[game.present].poker.length - 1);
                    tip.push(play[game.present].poker.length - 2);
                    return tip;
                }
            }
        }
        else {
            console.log('你没有合适的牌');
        }
        return tip;

    }

});



