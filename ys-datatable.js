
/*! YSDataTable 0.1
 * @author iyogesharma@gmail.com
 */

/**
 * @summary     DataTables plugin 
 * @description ease the process of initializing DataTables
 * @version    	0.1
 * @file        ys-dataTables.js
 * @author      Yogesh Sharma ( iyogesharma)
 * @contact     iyogesharma@gmail.com
 * @copyright   Copyright 2019 iyogesharma.
 *
 * This source file is free software, available under the following license:
 *   MIT license
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery', 'datatables.net'], function ($) {
			return factory($, window, document);
		});
	}
	else if (typeof exports === 'object') {
		// CommonJS
		module.exports = function (root, $) {
			if (!root) {
				root = window;
			}

			if (!$ || !$.fn.dataTable) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory($, root, root.document);
		};
	}
	else {
		// Browser
		factory(jQuery, window, document);
	}
}(function ($, window, document, undefined) {
	'use strict';
	var DataTable = $.fn.dataTable;

	/**
	* Convert string to camelCase text.
	*/
	var camelCase = function (str) {
		str = removeNonWord(str)
			.replace(/\-/g, ' ') //convert all hyphens to spaces
			.replace(/\s[a-z]/g, upperCase) //convert first char of each word to UPPERCASE
			.replace(/\s+/g, '') //remove spaces
			.replace(/^[A-Z]/g, lowerCase); //convert first char to lowercase
		return str;
	}

	/**
	 * Remove non-word chars.
	 */
	var removeNonWord = function (str) {
		return str.replace(/[^0-9a-zA-Z\xC0-\xFF \-]/g, '');
	}

	/**
	 * "Safer" String.toLowerCase()
	 */
	var lowerCase = function (str) {
		return str.toLowerCase();
	}

	/**
	 * "Safer" String.toUpperCase()
	 */
	var upperCase = function (str) {
		return str.toUpperCase();
	}

	/**
	* Convert to lower case, remove accents, remove non-word chars and
	* replace spaces with the specified delimeter.
	* Does not split camelCase text.
	*/
	var slugify = function (str, delimeter = "_") {
		str = removeNonWord(str)
			.trim()//should come after removeNonWord
			.replace(/ +/g, delimeter) //replace spaces with delimeter
			.toLowerCase();
		return str;
	}

	/**
	 * YSDataTables is a plug-in that helps to initailize datatables [DataTables.net](href="http://datatables.net).
	 * and make process of creation DataTables easier by reducing amount of script that we need to write.
	 * It automatically identify column names and basic column defs simply by adding few attributes to html tabl
	 *
	 * Note that the `YSDataTable` object is not a global variable but is aliased
	 * to `jQuery.fn.YSDataTable`  through which it may
	 * be  accessed.
	 *
	 *  @requires jQuery 1.7+ ,datatables.net
	 *
	 *  @example
	 *    // Basic initialisation
	 *    $(document).ready( function {
	 *      $('#example').YSDataTable();
	 *    } );
	 *
	 *  @example
	 *    // Initialisation with configuration options - in this case, disable
	 *    // pagination and sorting.
	 *    $(document).ready( function {
	 *      $('#example').YSDataTable( {
	 *        "paginate": false,
	 *        "sort": false
	 *      } );
	 *    } );
	 */
	var YSDataTable = function (options = {}) {
			let source = this.data('source'),
				header = {}, ajaxOption = {}, base_options = {};
			if (this.prop('rows') != null && this.prop('rows') != 'undefined') {
				if (source != 'undefined' && source != null) {
					source.type.toLowerCase() != "get" ? header = { 'X-CSRF-TOKEN': $('meta[name="csrsf-token"]').attr('content') } : '';
					ajaxOption.ajax = {
						type: source.type,
						url: source.url,
						header: header,
					};
					$.extend(options, ajaxOption);

					let base_options = {
						el: this,
						options: options

					}
					return new Table(base_options)
				}
				else if (options.ajax != 'undefined' && options.ajax != null) {
					let base_options = {
						el: this,
						options: options

					}
					return new Table(base_options)
				}
				else {
					return this.DataTable(options);
				}

			} else {
				throw new Error('Not able to fount table with given selector','Not Found');
			}
		}



	var Table = function ({ el, options },api=false) {
         this.el=el;
		/**
		 * Holds indexes of columns that are unSearchable
		 * @var {array} unSearchable
		 */
		this.unSearchable = [];

		/**
		 * Holds indexes of columns that are unSortable
		 * @var {array} unSortable
		 */
		this.unSortable = [];

		/**
		 * Holds indexes of columns that are exportable
		 * @var {array} exportable
		 */
		this.exportable = [];

		/**
		 * Checks whether columns array of column object is present
		 * in options object if present initialize @var {array} columns to it
		 * if not automatically generate column sarray from {HTMLTableHeaderCellElement}
		 */
		if (options.columns != 'undefined' && options.columns != null) {
			this.columns = options.columns;
		} else {
			this.columnNameCase = el.prop('tHead').attributes.case ? el.prop('tHead').attributes.case.value : 'lower';
			this.columns = this._getColumnsFromTable(el.prop('rows')[0]) || [];
		}

		/**
		 * Holds length of number of columns of Datatable
		 * @var {int}|null columns_length
		 */
		this.columns_length = this.columns.length || null;

		/**
		 * Holds ajax option of Datatable. if no ajax object
		 * is specified it wiill initialize default to empty object
		 * @var {object}|null ajax
		 */

		this.ajax = options.ajax || {};

		/**
		 * Holds buttons array pf object provided to YSDataTable
		 * and null of no buttons array provided
		 * This option is helpful if you want to customize
		 * buttons to be displayed on datatable
		 * @var {array}}|null Buttons
		 */
		this.Buttons = options.buttons || null;

		/**
		 * Default options that YSDataTable use to initialize DataTable
		 * You can overright/change this object to change default options for initialization
		 * @use {function} getDefaults() to get default options object
		 *
		 * @type {Object}
		*/
		this.defaults = {
			Buttons: [
				{
					extend: 'colvis',
					collectionLayout: 'relative three-column',
					postfixButtons: ['colvisRestore'],
					columns: ':gt(0)'
				},
				{
					'extend': 'copy',

					'exportOptions': {
						'columns': this.exportable || [0, ':visible']
					}
				},
				{
					'extend': 'excel',

					'exportOptions': {
						'columns': this.exportable || [0, ':visible']
					}
				},
				{
					'extend': 'csv',

					'exportOptions': {
						'columns': this.exportable || [0, ':visible']
					}
				},
				{
					'extend': 'print',

					'exportOptions': {
						'columns': this.exportable || [0, ':visible']
					},
				}
			],
			lengthMenu: [[25, 50, 100, 200, 500, 1000, 10000, -1], [25, 50, 100, 200, 500, 1000, 10000, 'All']],
			columnDefs:null,
			dom:'<"row"<"col-sm-2 "l><"col-sm-8"B><"col-sm-2"f>r>t<"row"<"col-sm-12"i>><"row"<"col-sm-12 center-block"p>>',
			paging:true,
			responsive:false,
			sort:true,
			info:true,
			searching: true,
			ordering:  true,
			scrollX:true,
			scrollY:false,
			lengthChange:true,
			processing:false,
			searching:true,
			stateSave:false,
			serverSide:true,
			autoWidth:true,
			filter:true,
			deferRender:false,
			destroy:false,
			paginate:true,
			retrieve:false
		};

		/**
		 * Checks whether options object contain addButtons object array
		 * anf if present concat it with default Buttons object array
		 * This option helps to add custom buttons to DataTable default buttons array
		 */
		if (options.addButtons != 'undefined' && options.addButtons != null) {
			this.defaults.Buttons = this.defaults.Buttons.concat(options.addButtons)
		}

		/**
		 * Checks whether options object contain removeButtons object
		 * and if present than remove the user specified buttons
		 * @return {void}         [description]
		 */
		if (options.removeButtons != 'undefined' && options.removeButtons != null) {
			this.removeButtons(options.removeButtons.target)
		}
		/**
		 * Datatable configuration options to initiaize datatable
		 * @see [function] getOptions() to get default options object
		 * @var {object} hold datatable configurations
		 */
		this.dtOptions = {
			columns: this.columns,
			columnDefs:options.columnDefs || this.defaults.columnDefs,
			serverSide: this.defaults.serverSide,
			ajax: this.ajax,
			buttons: this.Buttons || this.defaults.Buttons,
			dom: options.dom||this.defaults.dom,
			lengthMenu: options.lengthMenu || this.defaults.lengthMenu,
			paging:options.paging ||  this.defaults.paging,
			responsive:options.responsive ||  this.defaults.responsive,
			sort:options.sort ||  this.defaults.sort,
			info:options.info ||  this.defaults.info,
			searching:options.searching ||  this.defaults.searching,
			ordering:options.ordering ||  this.defaults.ordering,
			scrollX:options.scrollX ||  this.defaults.scrollX,
			scrollY:options.scrollY ||  this.defaults.scrollY,
			lengthChange:options.lengthChange ||  this.defaults.lengthChange,
			processing:options.processing ||  this.defaults.processing,
			stateSave:options.stateSave ||  this.defaults.stateSave,
			serverSide:options.serverSide ||  this.defaults.serverSide,
			autoWidth:options.autoWidth ||  this.defaults.autoWidth,
			filter:options.filter ||  this.defaults.filter,
			deferRender:options.deferRender ||  this.defaults.deferRender,
			destroy:options.destroy ||  this.defaults.destroy,
			paginate:options.paginate ||  this.defaults.paginate,
			retrieve:options.retrieve ||  this.defaults.retrieve,
		}

		let self=this;
		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
		* DataTables API
		*
		* For complete documentation, please refer to the docs/api directory or the
		* DataTables site
		*/
		DataTable.Api.register('api()',function(){
			return self;
		})

		DataTable.Api.register('class()',function(){
			return Table;
		})
		/**
		 * Initialize datatable with datatable configuration options
		 * @return {DataTable} object
		 */
		this.dTable= el.DataTable(this.dtOptions);
		return this.dTable;

	}

	/**
	* hold buttons index mapping for dataTable
	* @type {Object}
	* @static
	*/
	Table._BMAP={
		'colvis':0,
		'copy':1,
		'excel':2,
		'csv':3,
		'print':4,
	};


	Table.prototype = {
		/**
		 * Get all columns name from table thead child
		 * if thead contains case attribute than convert column names to
		 * taht case or else convert default to lower  case
		 * return an array of column name objects
		 * set unserchable ,unsortable and exportable columns of datatable
		 *
		 * @param {HTMLTableHeaderCellElement} tHead
		 */
		_getColumnsFromTable: function (tHead) {
			return Array.from(tHead.cells).map((th, index) => {
				th.attributes.sort?(!parseInt(th.attributes.search.value) ? this.unSearchable.push(index) : ''):'';
				th.attributes.search?(!parseInt(th.attributes.sort.value) ? this.unSortable.push(index) : ''):'';
				parseInt(th.attributes.export.value) ? this.exportable.push(index) : '';
				let columns={
					seachable:th.attributes.search?(parseInt(th.attributes.search.value)?true:false):DataTable.defaults.column.bSearchable,
					sortable:th.attributes.sort?(parseInt(th.attributes.sort.value)?true:false):DataTable.defaults.column.bSortable,
					visible:th.attributes.visible?(parseInt(th.attributes.visible.value)?true:false):DataTable.defaults.column.bVisible,
					class:th.attributes.dtClass?th.attributes.dtClass.value:DataTable.defaults.column.sClass,
					defaultContent:th.attributes.defaultContent?th.attributes.defaultContent.value:DataTable.defaults.column.sDefaultContent,
					render:th.dataset.render?eval(th.dataset.render):DataTable.defaults.column.mRender,
				};

				$.extend(columns,{data: th.dataset.name!="undefined" && th.dataset.name!=null ?this.slugify(th.dataset.name):this.slugify(th.innerHTML)})

				return columns;
			});
		},

		/**
		 * Return all columns of datatable
		 */
		getColumns: function () {
			return this.columns;
		},

		/**
		 * Return length of  number of comumns in datatable
		 */
		getColumnsLength: function () {
			return this.columns_length;
		},

		/**
		 * return all YSDatatable configuration options
		 * @return object
		 */
		getOptions: function () {
			return this.dtOptions;
		},

		/**
		 * return YSDatatable default configurtion options
		 * @return object
		 */
		getDefaults: function () {
			return this.defaults;
		},

		/**
		 * return buttons that datatable uses by default
		 * use this function if you want to know about hoe to create button object
		 * @return array
		 */
		getDefaultButtons: function () {
			return this.defaults.Buttons;
		},

		/**
		 * Removes user specified buttons from
		 * datatable default buttons array
		 * @param  {array} targets
		 * @return {void}
		 */
		removeButtons:function(targets){
			targets.map(target=>{
				delete this.defaults.Buttons[Table._BMAP[target]];
			});
		},

		/**
		* Convert to lower case, remove accents, remove non-word chars and
		* replace spaces with the specified delimeter.
		* Does not split camelCase text.
		*/
		slugify: function (str, delimeter = "_") {
			str = str.trim()//should come after removeNonWord
				.replace(/ +/g, delimeter)
			//replace spaces with delimeter
			this.columnNameCase != 'upper' ? str = str.toLowerCase() : '';
			return str;
		},

	}


	//YSDatatable as alias to $.fn.YSDatatable
	$.fn.YSDataTable = YSDataTable;

	return YSDataTable;
}));
