$(document).ready(function() {

	getAllPrograms();
	getAllAcademicYear();
	
	
    /* 
      To list the programs
	*/
	
	function getAllPrograms()
	{
	
		$.ajax({
	   		url:'/course/getAllCourses',
	   		method:'GET',
	   		success:function(data)
	   		{
	   		    setUpDropDown("selectProgram",data,"courseId","courseCode");
	   			$('#selectProgram').unbind().bind('change',function()
	   			{
	   			
	   				getAllActiveBatchesOfProgram($(this).val());
	   				
	   			});
	   		},
	   		error:function(err)
	   		{
	   			showMessage(err);
	   		}
	   	});
		
	}
	
	/**
	  To get all batches for the given programid
	*/
	 function getAllActiveBatchesOfProgram(programId)
	 {
	// $("#selectBatch").prop( "disabled", false );
		$.ajax(
		{
	  		url:'/batch/getAllActiveBatchesInAProgram',
	  	   	method:'GET',
	  	   	data:{"courseId":programId},
	  	   	success:function(data)
	  	   	{
	  	   	
	  	        setUpDropDown("selectBatch",data,"batchId","batchCode");
	  	   		$('#selectBatch').unbind().bind('change',function()
	   			{
	  	   			
	  	   			getAllActiveSemesterOfBatch($(this).val());
	   				
	   			});
	  	   		
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
		//$("#selectSemester").prop( "disabled", false );
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
	  /**
	  To get Academic Year
	  */
	 function getAllAcademicYear()
		{
		
			$.ajax({
		   		url:'nualsTest/api/v1/academics/getDetailsByMasterId/masterId/83',
		   		method:'GET',
		   		success:function(data)
		   		{
		   		    setUpDropDown("selectAcademicYear",data,"detailName","detailName");
		   			
		   		},
		   		error:function(err)
		   		{
		   			showMessage(err);
		   		}
		   	});
		}
	
	
});
