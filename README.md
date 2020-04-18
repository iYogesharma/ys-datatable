<p align="center">
	<img src="https://github.com/iYogesharma/ys-datatable/blob/master/logo.png" /></p>

[![Build Status](https://scrutinizer-ci.com/g/iYogesharma/ys-datatable/badges/build.png?b=master)](https://scrutinizer-ci.com/g/iYogesharma/ys-datatable/build-status/master)

## YSDataTable

<p>A plug-in that helps to initailize <a href= "https://datatables.net/" >DataTables</a>.The plug-in make process of creation DataTables easier by reducing amount of script that we need to write
With YSDataTable you can  set most of DataTable options directly through html tags.</p>

## Getting Started

First include script using script tag:

```jQuery
    <script src="your download folder/core.js"></script>
```

Basic initialisation :

```HTML
   $(document).ready( function {
       $('#example').YSDataTable();
    } );
```

Initialisation with configuration options

To show or hide HTML elements :

```HTML
  $(document).ready( function {
    $('#example').YSDataTable( {
        "paginate": false,
        "sort": false
    } );
  } );
```

## Requirements

- [JQuery](https://jquery.com/)
- [jQuery DataTables v1.10.x](http://datatables.net/)

#### Example

```html
  <table id="example" style="width:100%"  data-source='{"url": "/test/url","type": "get"}' >
    <thead class="bg-sky" case="upper">
        <tr>
            <th  export=1 data-render=renderSerialNumber>SR NO.</th>
            <th  export=1>Name</th>
            <th  export=1 data-name="Code" >Login Id</th>
            <th  export=1>Logo</th>
            <th  export=1>Email</th>
            <th  export=1 data-name="Number">Contact Number</th>
            <th  export=1>GSTIN</th>
            <th  export=1>Address</th>
            <th  search=0 sort=0 export=0>Active</th>
            <th  search=0 sort=0 export=0>Action</th>
        </tr>
    </thead>
  </table>
```

```javascript
  <script src="your download folder/core.js"></script>
  
  <script>
  
      $(document).ready( function {
          $('#example').YSDataTable();
      });

      var renderSerialNumber=function (data, type, row, meta){
          return meta.row + meta.settings._iDisplayStart + 1;
      }
      
  </script>
```

<p>property case in table is used by YSDataTAble to identify case of column names.It has two options lower or upper .By default it will convert column names to lower case.</p>

<p><b>data-source</b> property of table tag is used to identify datatable ajax option.You can also define ajax option programmatically as : </p>

```HTML
  $('#example').YSDataTable({
    ajax:{
        url: '/test/url',
        type:'get'
    }
  });

```

   <p> Beside these properties you can also define various DataTable column optons from table th tag : </p>
   
```HTML	
  <table id="example" style="width:100%"  data-source='{"url": "/test/url","type": "get"}' >
    <thead class="bg-sky" case="upper">
      <tr>
          <th  export=1 data-render=renderSerialNumber defaultContent="0">SR NO.</th>
          <th  export=1>Name</th>
          <th  export=1 data-name="Code" >Login Id</th>
          <th  export=1>Logo</th>
          <th  export=1 visible=0 dtClass="column-info">Email</th>
          <th  export=1 data-name="Number">Contact Number</th>
          <th  export=1>GSTIN</th>
          <th  export=1>Address</th>
          <th  search=0 sort=0 export=0>Active</th>
          <th  search=0 sort=0 export=0>Action</th>
      </tr>
    </thead>
  </table>
```
#### YSDataTable Buttons

<p>By default YSDataTable initialize DataTable with five default buttons print,escel,csv,copy and colvis.
You are free to remove any of these default button for a particular datatable instance by using YSDataTable 
removeButtons option </p>

```HTML
  $('#example').YSDataTable({
      removeButtons:{
          target:['print','csv']
      }
  });
```

<p> Similarly you can add new buttons to existing buttons of YSDataTable by using addButtons option<p>

```HTML
  $('#example').YSDataTable({
     addButtons:[
          {
              text: 'Example',
              action:function(){
                  console.log('Example)
              }
          },
          {
              text: 'Test',
              key:'t',
              action:function(){
                  console.log('Test')
              }
          }
     ]
  });
```

#### Server Side Export

You can also export data to csv/excel using server side export. YSDataTable provide option Export to do this.

```javascript
  $("#example").YSDataTable({
    Export: true
  });
```

```javascript
  $('#example').YSDataTable({
     Export:{
      uri: server side export uri
     }
  });
```

The uri option is optional with a default value ys-datatable/export if boolean value is provided


Besides uri option Export also contain <b>model & fun </b> options, wich represent model and function name. You can use these options to automate the process of server side export to all models

##### Example: 

Suppose you name the function which provide results as datatable() in each model. So you could use ys-datatable Export option like this:

```javascript
  $('#example').YSDataTable({
     Export:{
      model: 'App\\User',  //Model name with namespace
      fun: 'datatable'
      //you can also define uri here or can use its default value
     }
  });
```

and in controller you can write a global function which handle export functionality.


## License

The MIT License (MIT). Please see [License File](https://github.com/iYogesharma/ys-datatable/blob/master/LICENSE.md) for more information.
