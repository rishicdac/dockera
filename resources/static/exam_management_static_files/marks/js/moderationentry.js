$(document).ready(function(){
	
	$('#frmmoderationentry').submit(function(e){
		e.preventDefault();
		getStatistics();
		
	})
	
})


function getStatistics()
{
	$.ajax({
   		url:BASE_URL+'moderation/getStatistics/',
   		method:'POST',
   		data:JSON.stringify(createAcademicJson()),
   		contentType: "application/json",
   		success:function(data)
   		{
   			console.log(data); 
   			if(data.error)
   				{
   				toastr.error(data.message);
   				}else{
   					getStudentListModeration(data.data);
   				}
   		},
   		error:function(err)
   		{
   			showMessage(err);
   		}
   	});
}

function getStudentListModeration(statistics)
{
	$.ajax({
   		url:BASE_URL+'moderation/getList/',
   		method:'POST',
   		data:JSON.stringify(createAcademicJson()),
   		contentType: "application/json",
   		success:function(data)
   		{
   			console.log(data); 
   			generateCertificateTemplates(statistics,data.data,createAcademicDetails());
   		},
   		error:function(err)
   		{
   			showMessage(err);
   		}
   	});
}

function createAcademicJson()
{
	var academicInfo = {};
	academicInfo.batchId = $('#selectBatch').val();
	academicInfo.examScheduleId = $('#selectExamType').val();
	academicInfo.minExternal = $('#minExternal').val()
	academicInfo.minInternal = $('#minInternal').val()
	academicInfo.minTotal = $('#minTotal').val()
	academicInfo.programId = $('#selectProgram').val();
	academicInfo.semesterId = $('#selectSemester').val();
	
	return academicInfo;
}

function createAcademicDetails()
{
	var academicInfo = {};
	academicInfo.batch = $('#selectBatch option:selected').text();
	academicInfo.examSchedule = $('#selectExamType option:selected').text();
	academicInfo.minExternal = $('#minExternal').val()
	academicInfo.minInternal = $('#minInternal').val()
	academicInfo.minTotal = $('#minTotal').val()
	academicInfo.program = $('#selectProgram option:selected').text();
	academicInfo.semester = $('#selectSemester option:selected').text();
	
	return academicInfo;
}
