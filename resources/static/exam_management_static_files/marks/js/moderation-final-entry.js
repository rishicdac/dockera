$(document).ready(function(){
	$('#frmfinalmoderationentry').submit(function(e){
		e.preventDefault();
		getStatistics();
		
		
	})
	
	$('#formModerationApply').submit(function(e){
		e.preventDefault();		
		var res = isModerationApplied();
		if(res)
			{
			//modal
			var msg  = {
					title : "Update",
					msg : "Moderation Already Applied.Do you want to update?"
					}
			 ConfirmDialog(msg,"UPDATE").then( function(response){
				
				 updateModerationMarks();	
				 
			 },function(error){

			 });
			 //toastr.error("Moderation Already Applied");
			}else{
				saveModerationMark();
			}
		
		
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
   			console.log(statistics); 
   			var failedStudents = data.data;
   			getFailedStudentList(statistics,failedStudents);
   			//generateCertificateTemplates(statistics,data.data,createAcademicDetails());
   		},
   		error:function(err)
   		{
   			showMessage(err);
   		}
   	});
}
function updateModerationMarks()
{
	$.ajax({
   		url:BASE_URL+'moderation/updateModerationMarks/',
   		method:'POST',
   		data:JSON.stringify(createAcademicJson()),
   		contentType: "application/json",
   		success:function(data)
   		{
   			console.log(data); 		   
   			
   		},
   		error:function(err)
   		{
   			showMessage(err);
   		}
   	});

}
function getFailedStudentList(statistics,failedStudents)
{
	
	$.ajax({
   		url:BASE_URL+'moderation/getFailedStudents/',
   		method:'POST',
   		data:JSON.stringify(createAcademicJson()),
   		contentType: "application/json",
   		success:function(data)
   		{
   			console.log(data); 	
   			var moderationList = data.data;
   			generateCertificateTemplates(statistics,failedStudents,createAcademicDetails(),moderationList);
   			$('#failedStudentList').show();
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
	academicInfo.minExternal = $('#minExternal').val();
	academicInfo.minInternal = $('#minInternal').val();
	academicInfo.minTotal = $('#minTotal').val();
	academicInfo.programId = $('#selectProgram').val();
	academicInfo.semesterId = $('#selectSemester').val();
	academicInfo.moderationMark = $('#moderationMarks').val();
	
	return academicInfo;
}

function createAcademicDetails()
{
	console.log(types)
	var academicInfo = {};
	academicInfo.academicYear = $('#selectAcademicYear').val();
	academicInfo.batch = $('#selectBatch option:selected').text();
	academicInfo.batchName = $('#selectBatch option:selected').text();
	academicInfo.batchId = $('#selectBatch').val();
	academicInfo.examSchedule = $('#selectExamType option:selected').text();
	academicInfo.examScheduleId = $('#selectExamType').val();
	academicInfo.minExternal = $('#minExternal').val()
	academicInfo.minInternal = $('#minInternal').val()
	academicInfo.minTotal = $('#minTotal').val()
	academicInfo.program = $('#selectProgram option:selected').text();
	academicInfo.programName = $('#selectProgram option:selected').text();
	academicInfo.programId = $('#selectProgram').val();
	academicInfo.semester = $('#selectSemester option:selected').text();
	academicInfo.semesterName = $('#selectSemester option:selected').text();
	academicInfo.moderationMark = $('#moderationMarks').val();
	
	academicInfo.semesterId = $('#selectSemester').val();
	academicInfo.evaluationTypeId = $('#selectRevaluationType').val();// MODERATION;//Hardcoded From app-common.js Moderation
	academicInfo.evaluationTypeName = $('#selectRevaluationType option:selected').text();
	/*types.forEach(element =>{
		if(element.id === MODERATION)
			{
			academicInfo.evaluationTypeName = element.evaluationType;
			}
	})*/
  //TODO PANEL DETAILS
	/*
	 * academicInfo.panelId=
	 * academicInfo.panelName=
	 * academicInfo.panelMemberId=
	 * academicInfo.panelMemberName= 
	 * 
	 */
	
	return academicInfo;
}

function saveModerationMark()
{
	$.ajax({
   		url:BASE_URL+'moderation/saveFinalModerationMarks/',
   		method:'POST',
   		data:JSON.stringify(createAcademicDetails()),
   		contentType: "application/json",
   		success:function(data)
   		{
   			console.log(data); 		
   			resetForm();
   			$('#failedStudentList').hide();
   		},
   		error:function(err)
   		{
   			showMessage(err);
   		}
   	});
}

function isModerationApplied()
{
	var result;
	$.ajax({
   		url:BASE_URL+'moderation/isModerationMarksApplied/',
   		method:'POST',
   		data:JSON.stringify(createAcademicDetails()),
   		contentType: "application/json",
   		async:false,
   		success:function(data)
   		{
   			console.log(data); 		   
   			result = data.data;
   		},
   		error:function(err)
   		{
   			showMessage(err);
   		}
   	});
	return result;
	
}

function resetForm()
{
	$("#frmfinalmoderationentry")[0].reset();
}