 var ConfirmDialog = function (data,type){

 var TYPE;
 var ICON ;
 var BTN_CLASS;

	 if ( type == 'SAVE'){
		 TYPE = 'green';
		 ICON =  'fa fa-save';
		 BTN_CLASS = 'btn-success';
	 }
	 else if ( type == 'DELETE'){
		 TYPE = 'red';
		 ICON =  'fa fa-trash';
		 BTN_CLASS = 'btn-danger';	 
	 }
	 else if ( type == 'APPROVE'){
		 TYPE = 'red';
		 ICON =  'fa fa-thumbs-up';
		 BTN_CLASS = 'btn-danger';	 
	 }
	 else
	 {
		 TYPE = 'red';
		 ICON =  'fa fa-warning';
		 BTN_CLASS = 'btn-warning';	
	 }
	 var DialogPromise = function (resolve, reject) {
	    
	     $.confirm({
	        title: data.title,
	        content:data.msg,
	        closeIcon : true,
	        type: TYPE,
	        icon: ICON,
	        offsetTop: 40,	      
	        bgOpacity :'0.7',
	        buttons: {  
	            ok: {
	                text: "<b> Yes </b>",	            
	                keys: ['enter'],
	                action: function(){	                    
	                     resolve(true); 	                    
	                }
	            },
	            no: function(){
	              text: "<b> No </b>",	                  
	                    reject(false); 
	            }
	        }
     });    
    
   };    
    return  new  Promise (DialogPromise);
 }