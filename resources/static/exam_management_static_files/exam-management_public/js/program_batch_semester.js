var selectedConfigArray=new Array();
//$(document).ready(function() {

	getAllPrograms();
	
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
	   				loadEvaluationypes($(this).val());
	   			    if($("#displayTable").length){
	   				   $('#displayTable').empty();
	   			    }
	   			   if($(".configList").length){
	   				 
	   			    $('.configList').prop('checked', false);
	   			   }
	   			selectedConfigArray =[];
	   			
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
	 
	 function loadEvaluationypes(programId){
			$.ajax(
			{
				"url":MARKS_CONFIG_URL+programId,
				success:function(data)
				{
					types= data.data; 
					setUpDropDown("selectRevaluationType",types,"id","evaluationType");
				}
			});
		
		}
		
		/* load exam types */
		function loadExamTypes(){
			$.ajax(
			{
				"url":BASE_URL+"exam-management/exam-types",
				success:function(data)
				{
					types= data.data; 
					setUpDropDown("selectExamType",types,"id","type");
				}
			});
		
		}
		
		/* load academic year from look  up */
		function loadAcademicYear(){
			$.ajax(
			{
				"url": ACADEMIC_YEAR_URL ,//"/academics/api/v1/academics/getDetailsByMasterId/masterId/83",
			//	"url":"/nualsTest/api/v1/academics/getDetailsByMasterId/masterId/83",
				success:function(data)
				{
					 
					setUpDropDown("selectAcademicYear",data,"id","detailName");
				}
			});
		
		}
	 
		
//});
