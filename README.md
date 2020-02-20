<p align="center">
	<img src="https://github.com/iYogesharma/ys-datatable/blob/master/logo.png" /></p>

[![Build Status](https://scrutinizer-ci.com/g/iYogesharma/ys-datatable/badges/build.png?b=master)](https://scrutinizer-ci.com/g/iYogesharma/ys-datatable/build-status/master)

## YSDataTable

<p>A plug-in that helps to initailize datatables [DataTables.net](href="http://datatables.net).</p>
<p>The plug-in make process of creation DataTables easier by reducing amount of script that we need to write</p>
<p>With YSDataTable you can  set most of DataTable options directly through html tags</p>

## Getting Started

First include script using script tag:

```jQuery
    <script src="your download folder/ys-datatable.js"></script>
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

```HTML
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
        <tbody></tbody>
    </table>
```
```HTML

    <script src="your download folder/ys-datatable.js"></script>
    <script>
        $(document).ready( function {

            $('#example').YSDataTable();

        } );

        var renderSerialNumber=function (data, type, row, meta){
            return meta.row + meta.settings._iDisplayStart + 1;
        }
    </script>
```
<p>property case in table <thead> is used by YSDataTAble to identify case of column names.It has two options lower or upper .By default it will convert column names to lower case.</p>

<p>data-source property of table tag is used to identify datatable ajax option.You can also define ajax option programmatically as : </p>

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
	    <tbody></tbody>
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
## License

The MIT License (MIT). Please see [License File](https://github.com/iYogesharma/ys-datatable/blob/master/LICENSE.md) for more information.
