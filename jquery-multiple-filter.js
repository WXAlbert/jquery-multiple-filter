(function($, window) {
    'use strict';
    window.jqMultipleFilter = window.jqMultipleFilter || jqMultipleFilter;

    function jqMultipleFilter(selector, config) {
        var $jqObj = $(selector),
            _config = $.extend(true, {
                containerClass: 'jmf-container',
                itemsContainerClass: 'jmf-items-container',
                selItemClass: 'jmf-select-item',
                selItemValClass: '',
                selItemOpespClass: 'jmf-select-opesp',
                selResultClass: 'jmf-select-result',
                selItemInputClass: 'jmf-item-input',
                selItemInputOkClass: '',
                seldItemClass: '',
                seldItemRmClass: 'jmf-selected-item-rm',
                togoBtnClass: 'jmf-togobtn',
                data: [],
                default: {},
                expand: true
            }, config),
            _selItemVal = 'jmf-select-value',
            _selItemInputOk = 'jmf-item-input-ok',
            _seldItem = 'jmf-selected-item',
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
                $('<div>').addClass(_config.selItemOpespClass).append($jmfTogoBtn)
            );
            $jqObj.addClass(_config.containerClass);
            $jqObj.append($result);

            $.each(_config.data, function(dt_i, dt_o) {
                var dt_html = dt_o.fieldText ? dt_o.fieldText : dt_o.field,
                    $dl = $('<dl>').addClass(_config.selItemClass).append(
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
                            seldTxt = itm_o.itemText ? itm_o.itemText : itm_o.item;
                            $seldItem.attr({title: seldTxt}).html(seldTxt);
                        itm_o['index'] = itm_i;
                        $seldItem.data(itm_o);

                        $dl.append(
                            $('<dd>').append($seldItem)
                        );
                    });
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
                    item_data = $this.parents('dl').data(),
                    item_val_data = $this.data(),
                    item_val = item_val_data.item;

                _addSeldDom(item_data, item_val);
            });

            // 选中[input]
            $jqObj.on('click', '.' + _selItemInputOk, function(e) {
                // console.log(e.target);
                var $this = $(this),
                    item_data = $this.parents('dl').data(),
                    item_val = $this.prev('input').val();
                if (item_val) {
                    _addSeldDom(item_data, item_val);
                }
            });

            // 删除
            $jqObj.on('click', '.' + _seldItem, function(e) {
                var $this = $(this),
                    item_data = $this.data();
                _config.data[item_data.index]['$$dl'].show();
                $this.parent('dd').remove();
            });

            // 折叠展开
            $jmfTogoBtn.bind('click', function(e) {
                $jmfTogoBtn.toggleClass('expand').toggleClass('collapse');
                $itemsContainer.slideToggle(500, 'swing');
                $itemsContainer.toggleClass('expand').toggleClass('collapse');
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
                    if (typeof data.value === 'object') {
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
                o.value = undefined;
                o['$$dl'].show();
            });

            for (oneSeld in seldData) {
                $.each(_config.data, function(i, o) {
                    if (o.field === oneSeld) {
                        _addSeldDom(o, seldData[oneSeld]);
                        return;
                    }
                });
            }
        }

        /*
         * item_data: Object    _config.data 行的数据
         * item_val: String     select的key 或 input的value
         */
        function _addSeldDom(item_data, item_val) {
            var dt_html = item_data.fieldText ? item_data.fieldText : item_data.field,
                $seldItemRm = $('<em>').addClass(_config.seldItemRmClass).text('x');

            // 字段类型为input
            if (_config.data[item_data.index]['type'] === 'input') {
                dt_html = dt_html + '：' + item_val;
                item_data['value'] = item_val;

                // 默认字段类型为select，传入字段选中值的key
            } else {
                $.each(_config.data[item_data.index].items, function(i, o) {
                    if (o.item === item_val) {
                        dt_html = dt_html + '：' + (o.itemText ? o.itemText : o.item);
                        item_data['value'] = o;
                        return;
                    }
                });
            }

            // 当setSeld的值没有匹配到备选值则跳过
            if (!item_data['value']) {
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


    $.fn.jqMultipleFilter = function(config){
        var $this = $(this);
        return jqMultipleFilter($this.selector, config);
    };

})(jQuery, window);