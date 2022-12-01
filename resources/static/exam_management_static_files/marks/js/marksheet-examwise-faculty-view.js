$( document ).ready(function() {
	
	
	$('#marksheetForm').submit(function(e){
		 e.preventDefault();
		
		/*var url = PROXY_URL + "getFinalMarks/";//+$('#selectProgram').val()+"/"+$('#selectBatch').val();+"/"+$('#selectSemester').val()"/"+;
		
		
		  $("#objMarksheet").attr({
		        data: url
		    });*/
		 
		 var academicInfo = createAcademicInfo();
		 academicInfo.studentCode = $('#selectStudent').val();
		 getMarks(academicInfo);
	
	});

	function createAcademicInfo()
	{
		var academicDetails = {};
		academicDetails.batchId= $('#selectBatch').val();
		academicDetails.examId = $('#selectExamType').val();
		academicDetails.programId = $('#selectProgram').val();
		academicDetails.semesterId = $('#selectSemester').val();
		academicDetails.evaluationTypeId = $('#selectRevaluationType').val();
		return academicDetails;
			
	}
	function getMarks1(data)
	{
		$('#obj').remove();
		$('#obj').remove();
		
	}
	
	function getMarks(data)
	{
		$.ajax({
			   type: "POST",
			   url:  BASE_URL + "getExamwiseFinalMarks",
			   data:data,
			 		   
			   success: function(result)
			   {					 
				
				   generateFinalMarkSheet(result.data);
			   },
		   		error:function(err)
		   		{
		   		  toastr.error("Failed to load Mark details");
		   		}
			 });		
	}
})