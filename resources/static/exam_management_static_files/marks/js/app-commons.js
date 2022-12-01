//global variables and fns
	
	/* base url for mark management */

	var MARKS_CONFIG_URL = "mark-config/api/v1/academics/marks-management/evaluation-types-program/program-id/";
	var MARKS_CONFIG_viva = "mark-config/api/v1/academics/mark-management/getMarkConfigByPgmId/";
	var EXAM_NAME_URL = "exam-management/api/v1/";
	var BASE_URL = "mark-management/api/v1/academics/mark-management/";
	var PROXY_URL= "marks_report_proxy/api/v1/academics/mark-management/";
	var PANEL_MANAGEMENT = "PanelManagement/api/v1/academics/";
	var localJSON = { "studentId":'', "studentName":'', "report":0,  "viva":0, "isPresent":'' };
	var EXTERNAL_MAX_MARK = 50;
	var MODERATION = 18;
	var EVALUATION_ID = 28;
	
	/* fn to convert form data to json */
	$.fn.serializeObject = function()
	{
	    var o = {};
	    var a = this.serializeArray();
	    $.each(a, function() {
	        if (o[this.name] !== undefined) {
	            if (!o[this.name].push) {
	                o[this.name] = [o[this.name]];
	            }
	            o[this.name].push(this.value || '');
	        } else {
	            o[this.name] = this.value || '';
	        }
	    });
	    return o;
	 };

 
 	$('.datepicker').datepicker({
	    format: 'yyyy-mm-dd',							   
		autoclose:true,
		clearBtn:true,
		pickerPosition: "bottom-left"
	});  
	
	$('.datepicker-month-year').datepicker({
	    format: 'M-yyyy',	
	    startView: "months", 
        minViewMode: "months",						   
		autoclose:true,
		clearBtn:true
	});
	
	
	
    
     /**
    *  Get the logged in student details
    **/
         
   function getStudentInfo(studentId)
	{
       var studentData = {};       
	    $.ajax({
	   		url: "students/getStudentsDetails-V3",
	   		method: 'GET',
	   		async:false,
	   		data:{"userCodes":studentId},
	   		success: function(data)
	   		{
	   		  studentData = data;
	   		  console.log(data);	   		
	   		  setStudentInfo(data,studentId);	   		  
	   		  return data;
	   		  	   			
	   		},
	   		error:function(err)
	   		{
	   		 toastr.success("Failed to load student details");
	   		}
	   	});
	   	
	   	return studentData; 
	 }
	 
	

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
	 else
	 {
		 TYPE = 'orange';
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