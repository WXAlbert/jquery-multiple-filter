/*
 * jquery-multiple-filter V0.2.0
 * (c) Copyright 2016 王雪承. All Rights Reserved.
 */
(function($, window) {
    'use strict';
    window.jqMultipleFilter = window.jqMultipleFilter || jqMultipleFilter;

    function jqMultipleFilter(selector, config) {
        var $jqObj = $(selector),
            _config = $.extend(true, {
                containerClass: 'jmf-container',
                itemsContainerClass: 'jmf-items-container',
                selItemClass: '',
                selItemValClass: '',
                selResultClass: 'jmf-select-result',
                selItemInputClass: 'jmf-item-input',
                selItemInputOkClass: 'jmf-btn',
                seldItemClass: '',
                seldItemRmClass: 'jmf-selected-item-rm',
                togoBtnClass: 'jmf-togobtn',
                itemMtpBtnClass: 'jmf-btn',
                itemMtpokBtnClass: 'jmf-btn',
                data: [],
                default: {},
                expand: true,
                onSelect: $.noop,
                onRemove: $.noop
            }, config),
            _selItem = 'jmf-select-item',
            _selItemVal = 'jmf-select-value',
            _selItemInputOk = 'jmf-item-input-ok',
            _seldItem = 'jmf-selected-item',
            _selOpesp = 'jmf-select-opesp',
            _selItemMtp = 'jmf-item-mtp',
            _selItemMtpok = 'jmf-item-mtpok',
            _selCheck = 'jmf-select-check',
            _modCheck = 'mod-check',
            $result = $('<dl>').addClass(_config.selResultClass).append(
                $('<dt>').text('已选择条件：')
            ),
            $itemsContainer = $('<div>').addClass(_config.itemsContainerClass).addClass(_config.expand ? 'expand' : 'collapse'),
            $jmfTogoBtn = $('<a>').addClass(_config.togoBtnClass).addClass(_config.expand ? 'expand' : 'collapse').append(
                $('<span>').addClass('expand').append(
                    $('<span>').text('显示筛选')
                )
            ).append(
                $('<span>').addClass('collapse').append(
                    $('<span>').text('收起筛选')
                )
            );

        if ($jqObj.length === 0) {
            console.error("jqMultipleFilter: can't find this jquery object");
        }

        var _this = new JqMultipleFilter();

        init();

        return _this;

        function init() {
            createDom();
            bind();
        }

        function createDom() {
            $result.append(
                $('<div>').addClass(_selOpesp).append($jmfTogoBtn)
            );
            $jqObj.addClass(_config.containerClass);
            $jqObj.append($result);

            $.each(_config.data, function(dt_i, dt_o) {
                var dt_html = dt_o.fieldText ? dt_o.fieldText : dt_o.field,
                    $dl = $('<dl>').addClass(_selItem).addClass(_config.selItemClass).append(
                        $('<dt>').html(dt_html + '：')
                    );
                dt_o['index'] = dt_i;
                dt_o['$$dl'] = $dl;
                $dl.data(dt_o);

                if (_config.default[dt_o.field]) {
                    _addSeldDom(dt_o, _config.default[dt_o.field]);
                }

                if (dt_o.type === 'input') {
                    $dl.append(
                        $('<dd>').append(
                            $('<input>').attr({
                                type: 'text'
                            }).addClass(_config.selItemInputClass).val(_config.default[dt_o.field] ? _config.default[dt_o.field] : '')
                        ).append(
                            $('<a>').addClass(_selItemInputOk).addClass(_config.selItemInputOkClass).text('确定')
                        )
                    );

                } else {
                    $.each(dt_o.items, function(itm_i, itm_o) {
                        var $seldItem = $('<a>').addClass(_selItemVal).addClass(_config.selItemValClass),
                            seldTxt = itm_o.itemText ? itm_o.itemText : itm_o.item,
                            $dd = $('<dd>');

                        $seldItem.attr({title: seldTxt}).html(seldTxt);

                        itm_o['index'] = itm_i;
                        $seldItem.data(itm_o);

                        $dd.append($seldItem);
                        if(dt_o.multiple){
                            $dd.append(
                                $('<label>').addClass(_selCheck).append(
                                    $('<input>').attr({type: 'checkbox', name: 'jmf-' + dt_o.field, value: itm_o.item})
                                ).append(seldTxt)
                            );
                        }
                        $dl.append($dd);
                    });
                    if(dt_o.multiple){
                        $dl.append(
                            $('<div>').addClass(_selOpesp).append(
                                $('<a>').addClass(_selItemMtp).addClass(_config.itemMtpBtnClass).text('多选')
                            ).append(
                                $('<a>').addClass(_selItemMtpok).addClass(_config.itemMtpokBtnClass).data({fieldName: 'jmf-' + dt_o.field}).text('确定')
                            )
                        );
                    }
                }

                $itemsContainer.append($dl);
            });
            $jqObj.append($itemsContainer);
        }

        function bind() {
            // 选中[select]
            $jqObj.on('click', '.' + _selItemVal, function(e) {
                // console.log(e.target);
                var $this = $(this),
                    item_data = $this.parents('.' + _selItem).data(),
                    item_val_data = $this.data(),
                    item_val = item_val_data.item;

                _addSeldDom(item_data, item_val);
                _config.onSelect(getSelected(), item_data, item_val);
            });

            // 选中[input]
            $jqObj.on('click', '.' + _selItemInputOk, function(e) {
                // console.log(e.target);
                var $this = $(this),
                    item_data = $this.parents('.' + _selItem).data(),
                    item_val = $this.prev('input').val();
                if (item_val) {
                    _addSeldDom(item_data, item_val);
                }
                _config.onSelect(getSelected(), item_data, item_val);
            });

            // 删除
            $jqObj.on('click', '.' + _seldItem, function(e) {
                var $this = $(this),
                    item_data = $this.data();

                _config.data[item_data.index]['$$dl'].show();
                $this.parent('dd').remove();
                _config.onRemove(getSelected(), item_data);
            });

            // 折叠展开
            $jmfTogoBtn.bind('click', function(e) {
                $jmfTogoBtn.toggleClass('expand').toggleClass('collapse');
                $itemsContainer.slideToggle(500, 'swing');
                $itemsContainer.toggleClass('expand').toggleClass('collapse');
            });

            // 多选
            $jqObj.on('click', '.' + _selItemMtp, function(e){
                var $this = $(this),
                    $selItem = $this.parents('.' + _selItem);
                $selItem.addClass(_modCheck);
            });

            // 多选确定
            $jqObj.on('click', '.' + _selItemMtpok, function(e){
                var $this = $(this),
                    feildName = $this.data('fieldName'),
                    $selItem = $this.parents('.' + _selItem),
                    item_data = $selItem.data(),
                    $ckd = $selItem.find('input[name=' + feildName + ']:checked'),
                    ckdArr = [];
                $selItem.removeClass(_modCheck);
                $.each($ckd, function(i ,o) {
                    var item_val_data = $(o).parent('.' + _selCheck).siblings('.' + _selItemVal).data(),
                        item_val = item_val_data.item;
                    ckdArr.push(item_val);
                });
                _addSeldDom(item_data, ckdArr);
                _config.onSelect(getSelected(), item_data, ckdArr);
            });
        }

        function JqMultipleFilter() {
            this.$jqObj = $jqObj;
            this.config = _config;
            this.getSelected = getSelected;
            this.setSelected = setSelected;
            return this;
        }

        function getSelected() {
            var result = {};
            $.each($(selector + ' .' + _seldItem), function(i, o) {
                var data = $(o).data();
                if (data.field) {
                    if($.isArray(data.value)){
                        result[data.field] = [];
                        $.each(data.value, function(i, o) {
                	            result[data.field].push({
                                key: o.item,
                                value: o.itemText
                            });
                        });
                    }else if($.isPlainObject(data.value)) {
                        result[data.field] = {
                            key: data.value.item,
                            value: data.value.itemText
                        };
                    } else {
                        result[data.field] = data.value;
                    }
                }
            });
            return result;
        }

        function setSelected(seldData) {
            var oneSeld,
                $resultItems = $result.children('dd').children('a');

            // 清空seld
            $.each($resultItems, function(i, o) {
                var $o = $(o);
                $o.remove();
            });

            $.each(_config.data, function(i, o) {
                if(o.multiple){
                    o['$$dl'].find('input[name=jmf-' + o.field + ']').prop('checked', false);
                }
                o.value = undefined;
                o['$$dl'].show();
            });

            for (oneSeld in seldData) {
                $.each(_config.data, function(i, o) {
                    if (o.field === oneSeld) {
                        if(o.multiple){
                            $.each(seldData[oneSeld], function(k, v) {
                            	   o['$$dl'].find('input[name=jmf-' + o.field + '][value=' + v + ']').prop('checked', true);
                            });
                        }
                        _addSeldDom(o, seldData[oneSeld]);
                        return;
                    }
                });
            }
        }

        /*
         * item_data: Object            _config.data 行的数据
         * item_val: String | Array     select的key 或 input的value, Array 时为select的key数组
         */
        function _addSeldDom(item_data, item_val) {
            var dt_html = item_data.fieldText ? item_data.fieldText : item_data.field,
                $seldItemRm = $('<em>').addClass(_config.seldItemRmClass).text('x'),
                temp_dt_html_arr = [];

            // 字段类型为input
            if (_config.data[item_data.index]['type'] === 'input') {
                dt_html = dt_html + '：' + item_val;
                item_data['value'] = item_val;

            // 默认字段类型为select，传入字段选中值的key
            } else {
                if($.isArray(item_val)){
                    item_data['value'] = [];
                    $.each(_config.data[item_data.index].items, function(i, o) {
                        $.each(item_val, function(k, v) {
                	            if (o.item === v) {
                                temp_dt_html_arr.push( o.itemText ? o.itemText : o.item );
                                item_data['value'].push(o);
                                item_val.splice(k, 1);
                                return;
                            }
                        });
                    });
                    dt_html = dt_html + '：' + temp_dt_html_arr.join(',');
                }else{
                    $.each(_config.data[item_data.index].items, function(i, o) {
                        if (o.item === item_val) {
                            dt_html = dt_html + '：' + (o.itemText ? o.itemText : o.item);
                            item_data['value'] = o;
                            return;
                        }
                    });
                }
            }

            // 当setSeld的值没有匹配到备选值则跳过
            if (!item_data['value'] || ($.isArray(item_data['value']) && item_data['value'].length === 0) || ($.isPlainObject(item_data['value']) && $.isEmptyObject(item_data['value']))) {
                return;
            }

            _config.data[item_data.index]['$$dl'].hide();

            if (_config.data[item_data.index]['type'] === 'input') {
                _config.data[item_data.index]['$$dl'].children('dd').children('input').val(item_val);
            }

            $result.append(
                $('<dd>').append(
                    $('<a>').addClass(_seldItem).addClass(_config.seldItemClass).attr({title: dt_html}).html(dt_html).data(item_data).append(
                        $seldItemRm
                    )
                )
            );
        }
    }

    // 挂载到jQuery
    $.fn.jqMultipleFilter = function(config){
        var $this = $(this);
        return jqMultipleFilter($this.selector, config);
    };

})(jQuery, window);