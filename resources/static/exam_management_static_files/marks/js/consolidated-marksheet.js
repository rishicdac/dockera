$(document ).ready(function() {
	$('#consolidatedMarkForm').submit(function(e){
		e.preventDefault();
		getConsolidatedMark();
	})
	
	function getConsolidatedMark()
	{

		  $.ajax(
	        {	   
	        	  method:"POST",
	        	  data:createAcademicInfo(),
	              url:BASE_URL+"getConsolidatedMarkSheet",
	              success:function(result)
	              {
	            	  if(result.data)
	            	 {console.log(result.data)
	            	 generateConsolidatedMarkSheet(result.data); 
	            	 }else{
	            		 toastr.error("Failed to load Mark details");
	            	 }
	              }
	        });
	}
	function createAcademicInfo()
	{
		var academicDetails = {};
		academicDetails.batchId= $('#selectBatch').val();		
		academicDetails.programId = $('#selectProgram').val();
		academicDetails.studentCode = $('#selectStudent').val();
		return academicDetails;
			
	}
})