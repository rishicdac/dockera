$( document ).ready(function() {
	
  
    var loggedStudentId = $("#usercode").val();
    getStudentInfo();
	  
    /**
 	* To load loggedin student details
 	*/
    function getStudentInfo()
	{
        $.ajax({
	   		url: "students/getStudentsDetails-V3",
	   		method: 'GET',
	   		async:false,
	   		data:{"userCodes":loggedStudentId},
	   		success: function(data)
	   		{
	   		  studentData = data[loggedStudentId];
	   		 
	   		studentProgram = studentData.programCode;
			 studentBatch = studentData.batchCode;
			 getAllActiveSemesterOfBatch(studentBatch);
               
              },
	   		error:function(err)
	   		{
	   			showMessage(err);
	   		}
	   	});
        
	}
 	 
 	 /**
	  To get all semesters the given batchid
	  */
	 function getAllActiveSemesterOfBatch(batchId)
	 {

		  $.ajax({
					"url" : "/batch/getAllSemestersInABatch",
					"method" : "GET",
					data : {"batchId":batchId},
					success :function(data) {
					console.log(data);
					    try{
						   if(data && data.length >0){
							   $('#selectSemester').empty();
							   $('#selectSemester').append('<option>Select Semester</option>');
							   for(var i=0;i< data.length;i++){
							   	   $("#selectSemester").append('<option value='+data[i]['semesterIdentity']['semesterCode']+'>'+data[i]['semesterIdentity']['semesterCode']+'</option>');
							   }
						 }
						}
						catch(e){
						    console.error(e);
						    showMessage(" Error occurred while processing semester list"); 
						}
													
						
					},
					error :function(e) {
					     showMessage(err);
					}
				});
		}
 	 
    
	
	$('#selectSemester').unbind().bind('change',function(){

	  var program =studentProgram;
	  var batch = studentBatch;
	  var semester = $( "#selectSemester option:selected" ).val();	  
	  getMarksheet(program,batch,semester);
	  
	 }); 
	
	
	 function getMarksheet(studentProgram,studentBatch,semester)
	 {
		 var result=[];
		 $.ajax({
				"url" : BASE_URL+"getFinalMarks/"+studentProgram +"/"+studentBatch+"/"+semester+"/",
				"method" : "GET",
				 async:false,
				 success :function(data) {
					 console.log(data.data)
						if(data.data===null)		
							result=[];
						else
							result=data.data;
						populateDatatable(result);
						$("#viewResults").show();
				},
				error :function(e) {
				     showMessage(err);
				}
			});
	 }
	  
	function populateDatatable(data)
	{
		$('#marksTbl').DataTable().clear().destroy();
		var marksData=$('#marksTbl').DataTable({			
			  "language": {
			      "emptyTable": "No data available in table"
			    },
				data:data,
				"columns":[
				{"data":"courseCode"},
				{"data":"courseName"},
				{"data":"internal"},
				{"data":"external"},
				{"data":"total"}				
			
				]
			});
	}
})