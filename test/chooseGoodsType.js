/**
 * Created by lichao on 2016/6/7.
 */

'use strict';


/**
 * 传入参数
 * opts.$ele            jquery对象，将会在此下生产选择商品类型主题
 * opts.position        手动传入定位信息
 * opts.name            对应key键的input框name设置
 * opts.className       其他class选项
 * opts.callback        选择完毕后的回调函数
 *                          返回参数见_choosed 切 含有$ele 当前元素字段
 * @param opts
 * @constructor
 */

(function ($){

    function ChooseGoodsType(opts) {
        this.opation = $.extend({}, this.OPTS, opts);
        this.createElement();
        this.createType(0);
        this.positionInit();
        this.tabInit();
        this.domInit();
        this.setInputName();
    }


    ChooseGoodsType.prototype.OPTS = {
        $ele: $('body'),
        box: null,
        position: {
            top: 0,
            left: 0
        },
        className:"",
        name: {
            bigclassno: '',
            bigclass: '',
            middleclassno: '',
            middleclass: '',
            smallclassno: '',
            smallclass: ''
        },
        _choosed: {
            bigclassno: '',
            bigclass: '',
            middleclassno: '',
            middleclass: '',
            smallclassno: '',
            smallclass: ''
        },
        callback: null
    };

    ChooseGoodsType.prototype.setInputVal = function () {
        var that = this;
        var OPTS = that.opation;

        for (var key in OPTS._choosed) {
            OPTS.box.find('[_name="' + key + '"]').val(OPTS._choosed[key]);
        }
    };

    ChooseGoodsType.prototype.setInputName = function () {
        var that = this;
        var OPTS = that.opation;

        for (var key in OPTS.name) {
            OPTS.box.find('[_name="' + key + '"]').attr('name', OPTS.name[key]);
        }
    };


    ChooseGoodsType.prototype.positionInit = function () {
        var that = this;
        var OPTS = that.opation;

        if (!OPTS.position.top) {
            OPTS.position.top = OPTS.$ele.height();
        }

        OPTS.box.css({
            top: OPTS.position.top,
            left: OPTS.position.left
        })

    };

    ChooseGoodsType.prototype.createElement = function () {

        var OPTS = this.opation;
        // OPTS.$ele.append()

        OPTS.box = $('<div class="show_box '+OPTS.className+'">' +
            '    <ul class="show_box_title clearfix">' +
            '        <li class="active">大类</li>' +
            '        <li>中类</li>' +
            '        <li>小类</li>' +
            '    </ul>' +
            '    <ul class="show_box_content clearfix">' +
            '        <li class="active"></li>' +
            '        <li></li>' +
            '        <li></li>' +
            '    </ul>' +
            '    <input type="hidden" name="" _name="bigclassno">' +
            '    <input type="hidden" name="" _name="bigclass">' +
            '    <input type="hidden" name="" _name="middleclassno">' +
            '    <input type="hidden" name="" _name="middleclass">' +
            '    <input type="hidden" name="" _name="smallclassno">' +
            '    <input type="hidden" name="" _name="smallclass">' +
            '</div>');
        OPTS.$ele.append(OPTS.box);

    };

    ChooseGoodsType.prototype.tabInit = function () {
        var that = this;
        var OPTS = that.opation;
        OPTS.box.find('.show_box_title li').click(function () {
            that.chooseTab($(this).index());
            return false;
        })
    };

    ChooseGoodsType.prototype.chooseTab = function (index) {
        var that = this;
        var OPTS = that.opation;
        OPTS.box.find('.show_box_title li').removeClass('active');
        OPTS.box.find('.show_box_title li').eq(index).addClass('active');

        OPTS.box.find('.show_box_content li').removeClass('active');
        OPTS.box.find('.show_box_content li').eq(index).addClass('active');
    };

    ChooseGoodsType.prototype.getTypeEle = function (data) {
        var returnData = '';
        var that = this;
        if ($.isArray(data)) {
            for (var i = 0; i < data.length; i++) {
                returnData += that.getTypeEle(data[i]);
            }
        } else {
            returnData =
                '   <a href="javascript:;" data-no="' + (data.smallclassno || data.middleclassno || data.bigclassno) + '" >'
                + (data.smallclass || data.middleclass || data.bigclass) + '</a>'
        }
        return returnData;
    };

    ChooseGoodsType.prototype.domInit = function () {
        var that = this;
        var OPTS = this.opation;

        OPTS.$ele.click(function () {
            $('.show_box').removeClass('active');
            OPTS.box.addClass('active');

            return false;
        });

        $(document).click(function () {
            $('.show_box').removeClass('active');
        });

        OPTS.$ele.delegate('.show_box_content li', 'click', function () {
            return false;
        });


        OPTS.$ele.delegate('.show_box_content li:eq(0) a', 'click', function () {
            var no = $(this).attr('data-no');
            OPTS._choosed.bigclassno = no;
            OPTS._choosed.bigclass = $(this).html();
            OPTS._choosed.middleclassno = '';
            OPTS._choosed.middleclass = '';
            OPTS._choosed.smallclassno = '';
            OPTS._choosed.smallclass = '';
            that.createType(1, no);
        });

        OPTS.$ele.delegate('.show_box_content li:eq(1) a', 'click', function () {
            var no = $(this).attr('data-no');
            OPTS._choosed.middleclassno = no;
            OPTS._choosed.middleclass = $(this).html();
            OPTS._choosed.smallclassno = '';
            OPTS._choosed.smallclass = '';
            that.createType(2, no);
        });

        OPTS.$ele.delegate('.show_box_content li:eq(2) a', 'click', function () {
            var no = $(this).attr('data-no');
            OPTS._choosed.smallclassno = no;
            OPTS._choosed.smallclass = $(this).html();
            that.chooseOver();
        });
    };

    ChooseGoodsType.prototype.chooseOver = function () {
        var that = this;
        var OPTS = that.opation;
        that.setInputVal();
        that.close();
        OPTS._choosed.$ele = OPTS.$ele;
        OPTS.callback && OPTS.callback(OPTS._choosed)
    };

    ChooseGoodsType.prototype.close = function() {
        this.opation.box.removeClass('active');
    };

    ChooseGoodsType.prototype.createType = function (type, no) {
        var that = this;
        var OPTS = this.opation;
        type = parseInt(type);
        if (type == 0) {
            that.getData(null, function (data) {
                var type = that.getTypeEle(data.data);
                OPTS.$ele.find('.show_box_content li').eq(0).html(type);

                OPTS.$ele.find('.show_box_content li').eq(1).html('');
                OPTS.$ele.find('.show_box_content li').eq(2).html('');
                that.chooseTab(0);
            });


        } else if (type == 1) {
            that.getData({
                bigclassno: no
            }, function (data) {
                var type = that.getTypeEle(data.data);
                OPTS.$ele.find('.show_box_content li').eq(1).html(type);
                OPTS.$ele.find('.show_box_content li').eq(2).html('');
                that.chooseTab(1);
            });
        } else if (type == 2) {
            that.getData({
                middleclassno: no
            }, function (data) {
                var type = that.getTypeEle(data.data);
                OPTS.$ele.find('.show_box_content li').eq(2).html(type);
                that.chooseTab(2);
            });
        }
    };

    ChooseGoodsType.prototype.getData = function (data, cb) {
        $.ajax({
            url: PROTOCOL + HOST + ":" + PORT + "/" + CONTEXT_NAME + "/baseInstallPrice/queryBaseInstallPrice",
            type: "post",
            data: data,
            success: function (data) {
                cb && cb(data);
            }
        })
    };
    window.ChooseGoodsType = ChooseGoodsType;
    $.fn.chooseGoodsType = function(options){
        !options && (options = {});
        this.each(function(i,e){

            if($(e).data('chooseGoodsType')){
            }else{
                options.$ele = $(e);
                $(e).data('chooseGoodsType',new ChooseGoodsType(options));
            }
        });
    };
})(jQuery);