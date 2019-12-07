/*! YSDataTable 0.1
 * @author iyogesharma@gmail.com
 */

/**
 * @summary     DataTables plugin
 * @description ease the process of initializing DataTables
 * @version    0.1
 * @file        ys-dataTables.js
 * @author      Yogesh Sharma (iyogesharma)
 * @contact     iyogesharma@gmail.com
 * @copyright   Copyright 2019 iyogesharma.
 *
 * This source file is free software, available under the following license:
 * MIT license
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 */
/* global jQuery:readonly */
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['jquery', 'datatables.net'], ($) => factory($, window, document));
  } else if (typeof exports === 'object') {
    // CommonJS
    module.exports = function (root, $) {
      if (!root) {
        root = window;
      }

      if (!$ || !$.fn.dataTable) {
        // eslint-disable-next-line global-require
        $ = require('datatables.net')(root, $).$;
      }

      return factory($, root, root.document);
    };
  } else {
    // Browser
    factory(jQuery, window, document);
  }
}(($) => {
  const DataTable = $.fn.dataTable;

  /**
	 * Remove non-word chars.
	 */
  const removeNonWord = function (str) {
    return str.replace(/[^0-9a-zA-Z\xC0-\xFF \-]/g, '');
  };

  /**
	 * "Safer" String.toLowerCase()
	 */
  const lowerCase = function (str) {
    return str.toLowerCase();
  };

  /**
	 * "Safer" String.toUpperCase()
	 */
  const upperCase = function (str) {
    return str.toUpperCase();
  };

  /**
	* Convert string to camelCase text.
	*/
  // eslint-disable-next-line no-unused-vars
  const camelCase = function (str) {
    str = removeNonWord(str)
      .replace(/\-/g, ' ') // convert all hyphens to spaces
      .replace(/\s[a-z]/g, upperCase) // convert first char of each word to UPPERCASE
      .replace(/\s+/g, '') // remove spaces
      .replace(/^[A-Z]/g, lowerCase); // convert first char to lowercase
    return str;
  };

  /**
	* Convert to lower case, remove accents, remove non-word chars and
	* replace spaces with the specified delimeter.
	* Does not split camelCase text.
	*/
  // eslint-disable-next-line no-unused-vars
  const slugify = function (str, delimeter = '_') {
    str = removeNonWord(str)
      .trim()// should come after removeNonWord
      .replace(/ +/g, delimeter) // replace spaces with delimeter
      .toLowerCase();
    return str;
  };

  /**
	 * YSDataTables is a plug-in that helps to initailize datatables [DataTables.net](href="http://datatables.net).
	 * and make process of creation DataTables easier by reducing amount of script that we need.
	 * to write.It automatically identify column names and basic column defs simply by adding
	 * few attributes to html table.
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
  const YSDataTable = function (options = {}) {
    const source = this.data('source');
    let header = {}; const ajaxOption = {};
    if (this.prop('rows') !== null && this.prop('rows') !== undefined) {
      if (source !== undefined && source !== null) {
        // eslint-disable-next-line no-unused-expressions
        source.type.toLowerCase() !== 'get' ? header = { 'X-CSRF-TOKEN': $('meta[name="csrsf-token"]').attr('content') } : '';
        ajaxOption.ajax = {
          type: source.type,
          url: source.url,
          header,
        };
        $.extend(options, ajaxOption);

        const baseOptions = {
          el: this,
          options,

        };
        // eslint-disable-next-line no-use-before-define
        return new Table(baseOptions);
      }
      if (options.ajax !== undefined && options.ajax !== null) {
        const baseOptions = {
          el: this,
          options,

        };
        // eslint-disable-next-line no-use-before-define
        return new Table(baseOptions);
      }

      return this.DataTable(options);
    }
    throw new Error('Not able to found table with given selector', 'Not Found');
  };


  const Table = function ({ el, options }) {
    this.el = el;
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
		 * Case used for column names (values : upper/lower)
		 */
    this.columnNameCase = el.prop('tHead').attributes.case ? el.prop('tHead').attributes.case.value : 'lower';

    /**
		 * Default options that YSDataTable use to initialize DataTable
		 * You can overright/change this object to change default options for initialization
		 * @use {function} getDefaults() to get default options object
		 *
		 * @type {Object}
		*/
    this.defaults = {
      columns: this.getColumnsFromTable(el.prop('rows')[0]),
      buttons: [
        {
          extend: 'colvis',
          collectionLayout: 'relative three-column',
          postfixButtons: ['colvisRestore'],
          columns: ':gt(0)',
        },
        {
          extend: 'copy',

          exportOptions: {
            columns: this.exportable || [0, ':visible'],
          },
        },
        {
          extend: 'excel',

          exportOptions: {
            columns: this.exportable || [0, ':visible'],
          },
        },
        {
          extend: 'csv',

          exportOptions: {
            columns: this.exportable || [0, ':visible'],
          },
        },
        {
          extend: 'print',

          exportOptions: {
            columns: this.exportable || [0, ':visible'],
          },
        },
      ],
      lengthMenu: [[25, 50, 100, 200, 500, 1000, 10000, -1], [25, 50, 100, 200, 500, 1000, 10000, 'All']],
      columnDefs: null,
      dom: '<"row"<"col-sm-2 "l><"col-sm-8"B><"col-sm-2"f>r>t<"row"<"col-sm-12"i>><"row"<"col-sm-12 center-block"p>>',
      ajax: {},
      processing: false,
      serverSide: true,
    };

    /**
		 * Checks whether options object contain addButtons object array
		 * anf if present concat it with default Buttons object array
		 * This option helps to add custom buttons to DataTable default buttons array
		 */
    if (options.addButtons !== undefined && options.addButtons !== null) {
      this.defaults.buttons = this.defaults.buttons.concat(options.addButtons);
    }

    /**
		 * Checks whether options object contain removeButtons object
		 * and if present than remove the user specified buttons
		 * @return {void}         [description]
		 */
    if (options.removeButtons !== undefined && options.removeButtons !== null) {
      this.removeButtons(options.removeButtons.target);
    }
    /**
		 * Datatable configuration options to initiaize datatable
		 * @see [function] getOptions() to get default options object
		 * @var {object} hold datatable configurations
		 */
    this.dtOptions = $.extend({}, this.defaults, options);

    const self = this;
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
		* DataTables API
		*
		* For complete documentation, please refer to the docs/api directory or the
		* DataTables site
		*/
    DataTable.Api.register('api()', () => self);

    DataTable.Api.register('class()', () => Table);
    /**
		 * Initialize datatable with datatable configuration options
		 * @return {DataTable} object
		 */
    this.dTable = el.DataTable(this.dtOptions);
    return this.dTable;
  };

  /**
	* hold buttons index mapping for dataTable
	* @type {Object}
	* @static
	*/
  Table.BMAP = {
    colvis: 0,
    copy: 1,
    excel: 2,
    csv: 3,
    print: 4,
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
    getColumnsFromTable(tHead) {
      return Array.from(tHead.cells).map((th, index) => {
        if (th.attributes.sort && parseInt(th.attributes.search.value, 10) !== 1) {
          this.unSearchable.push(index);
        }

        if (th.attributes.search && parseInt(th.attributes.sort.value, 10) !== 1) {
          this.unSortable.push(index);
        }

        if (th.attributes.export) {
          // eslint-disable-next-line eqeqeq
          // eslint-disable-next-line radix
          if (parseInt( th.attributes.export.value) === 1 || th.attributes.export.value == 'true') {
            this.exportable.push(index);
          }
        } else {
          this.exportable.push(index);
        }

        const columns = {

          seachable: th.attributes.search ? (!!parseInt(th.attributes.search.value, 10)) : true,

          sortable: th.attributes.sort ? (!!parseInt(th.attributes.sort.value, 10)) : true,

          visible: th.attributes.visible ? (!!parseInt(th.attributes.visible.value, 10)) : true,

          class: th.attributes.dtClass ? th.attributes.dtClass.value : '',

          defaultContent: th.attributes.defaultContent ? th.attributes.defaultContent.value : null,

          // eslint-disable-next-line no-eval
          render: th.dataset.render ? eval(th.dataset.render) : null,
        };

        $.extend(columns, {
          data: th.dataset.name !== undefined && th.dataset.name !== null
            ? this.slugify(th.dataset.name) : this.slugify(th.innerHTML),
        });

        return columns;
      });
    },

    /**
		 * Return all columns of datatable
		 */
    getColumns() {
      return this.defaults.columns;
    },

    /**
		 * Return length of  number of comumns in datatable
		 */
    getColumnsLength() {
      return this.defaults.columns.length;
    },

    /**
		 * return all YSDatatable configuration options
		 * @return object
		 */
    getOptions() {
      return this.dtOptions;
    },

    /**
		 * return YSDatatable default configurtion options
		 * @return object
		 */
    getDefaults() {
      return this.defaults;
    },

    /**
		 * return buttons that datatable uses by default
		 * use this function if you want to know about hoe to create button object
		 * @return array
		 */
    getDefaultButtons() {
      return this.defaults.buttons;
    },

    /**
		 * Removes user specified buttons from
		 * datatable default buttons array
		 * @param  {array} targets
		 * @return {void}
		 */
    removeButtons(targets) {
      targets.map((target) => delete this.defaults.buttons[Table.BMAP[target]]);
    },

    /**
		* Convert to lower case, remove accents, remove non-word chars and
		* replace spaces with the specified delimeter.
		* Does not split camelCase text.
		*/
    slugify(str, delimeter = '_') {
      str = str.trim()
        .replace(/ +/g, delimeter);
      // replace spaces with delimeter
      // eslint-disable-next-line no-unused-expressions
      this.columnNameCase !== 'upper' ? str = str.toLowerCase() : '';
      return str;
    },

  };


  // YSDatatable as alias to $.fn.YSDatatable
  $.fn.YSDataTable = YSDataTable;

  return YSDataTable;
}));
