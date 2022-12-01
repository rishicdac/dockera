$(document).ready(function(){
	
	$('.datepicker').datepicker({
	    format: 'yyyy-mm-dd',							   
		autoclose:true,
		clearBtn:true,
		pickerPosition: "bottom-left"
	});
	
	
	var publishedData=$('#publishTbl').DataTable({
		
		"ajax":BASE_URL+"publish/getAllPublishedResult/",
		"columns":[
		{"data":"nameExam"},
		{"data":"publish","render":function (data){
				   if(data == true)		
							return '<label  class="small-box-footer text-success" >Published </label>' ;
						}},
		{"data":"publishDate","render": function(data){return moment(data).format('D/MM/YYYY')}}
		]
	});
	
	$('#publishDateForm').submit(function(e){
		e.preventDefault();
		var data = publishData();
		console.log(data);
		$.ajax({
	   		url:BASE_URL+'publish/publishResult/',
	   		method:'POST',
	   		data:JSON.stringify(publishData()),
	   		contentType: "application/json",
	   		success:function(data)
	   		{
	   			//console.log(data)
	   			if(data.error)
	   				{
	   					toastr.error("Already published");
	   				}else{
	   					
	   					$('#publishTbl').DataTable().ajax.reload();
	   					//$('#viewPublishedResults').show();
	   		   		    toastr.success("Publish details added Successfully");
	   				}
	   			
	   			
	   			
	   		},
	   		error:function(err)
	   		{
	   			showMessage(err);
	   		}
	   	});
		
	})
})
function publishData()
{
	
	var publishInfo = {};
	publishInfo.examId = $('#selectExamType').val();
	publishInfo.nameExam = $('#selectExamType option:selected').text();
	publishInfo.program = $('#selectProgram').val();
	publishInfo.programName = $('#selectProgram option:selected').text();
	publishInfo.batch = $('#selectBatch').val();
	publishInfo.batchName = $('#selectBatch option:selected').text();
	publishInfo.semester = $('#selectSemester').val();
	publishInfo.publish = true;
	publishInfo.publishDate = $('#publishDate').val();
	return publishInfo;

}



