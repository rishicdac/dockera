//global variables and fns

/* base url for exam management */
var BASE_URL = "exam-management/api/v1/";
var MARKS_CONFIG_URL = "mark-config/api/v1/academics/marks-management/evaluation-types-program/program-id/";
var ACADEMIC_YEAR_URL = "/academics/api/v1/academics/getDetailsByMasterId/masterId/83";

	
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
	    //format: 'yyyy-mm-dd',	
 		//startDate : moment() , //0
	    format: 'dd-mm-yyyy',
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
	

    
    
    //getStudentInfo();
   	function getStudentInfo()
	{

      $.ajax({
	   		url: "students/getStudentsDetails-V3",
	   		method: 'GET',
	   		data:{"userCodes":$("#usercode").val()},
	   		success: function(data)
	   		{
	   		  console.log(data);
	   		  return data;
	   		  	   			
	   		},
	   		error:function(err)
	   		{
	   			showMessage(err);
	   		}
	   	});
	 }
    
 
    