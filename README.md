# 基于jQuery的多条件过滤插件
  当前最新版本 V0.2.0

jquery-multiple-filter 的目标：

> 提供直观的的搜索条件构造方式

## 使用

1. 下载后引入jQuery和jquery-multiple-filter插件

	```
	<link rel="jquery-multiple-filter.css">
  	<script src="jquery-1.12.1.js">
  	<script src="jquery-multiple-filter.js">
	```
2. 创建html容器

	```
	<div id="jmf"></div>
	```
3. 实例化jqMultipleFilter对象

	```
	var $jmf = $.jqMultipleFilter({
		data:[
            {
                type: 'select',
                field: 'hy', fieldText: '行业',
                items:[
                    {item: 'gc', itemText: '工程'},
                    {item: 'gx', itemText: '购销'},
                    {item: 'zl', itemText: '租赁'}
                ]
            },
            {
                type: 'select',
                field: 'lb', fieldText: '类别',
                items:[
                    {item: 'itb', itemText: 'IT采购(北京)'},
                    {item: 'ith', itemText: 'IT采购(杭州)'},
                    {item: 'itg', itemText: 'IT采购(广州)'}
                ]
            },
            {
                type: 'input',
                field: 'khmc', fieldText: '客户名称'
            },
            {
                type: 'input',
                field: 'cpmc', fieldText: '产品名称'
            }
        ],
        default: {hy: 'gc', khmc: '上海电力', lb: 'itb'},
        onSelect: function(data, item, val){
            console.log(data, item, val);
        },
        onRemove: function(data, item){
            console.log(data, item);
        }
	});
	```
## 参数

    | 字段 | 描述 | 默认值 |
    | --- | ----------- | ----------- |
    | `data` | 字段列表 `fieldList Array` |
    | `default` | 默认选中值 | {} |
    | `onSelect` | 选中事件回调 |  |
    | `onRemove` | 删除事件回调 |  |
    | `containerClass` |  | 'jmf-container` |
    | `itemsContainerClass` |  | `jmf-items-container` |
    | `selItemClass` |  | '' |
    | `selItemValClass` |  | '' |
    | `selResultClass` |  | 'jmf-select-result' |
    | `selItemInputClass` |  | 'jmf-item-input' |
    | `selItemInputOkClass` |  | 'jmf-btn' |
    | `seldItemClass` |  | '' |
    | `seldItemRmClass` |  | 'jmf-selected-item-rm' |
    | `togoBtnClass` |  | 'jmf-togobtn' |
    | `itemMtpBtnClass` |  | 'jmf-btn' |
    | `itemMtpokBtnClass` |  | 'jmf-btn' |

    | fieldList字段参数 | 描述 | 默认值 |
    | --- | ----------- | ----------- |
    | `type` | 字段过滤值输入方式"select"|"input" | "select" |
    | `field` | 字段实际值 |  |
    | `fieldText` | 字段显示值，当该字段不存在时，显示值默认为 `field` |  |
    | `items` | Items Array type为"select"时的备选条件，实际值为"item"，显示值为"itemText" |  |
