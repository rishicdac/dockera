$( document ).ready(function() {
	var ExternalMarkTabulationDataTable =null;
	var approval_ids = [];
	onLoad();
	
	//loadCourses();//Need to Remove
	//loadExamType();//Need to Remove
	//loadEvaluationType();//Need to Remove
	
	/**
	 * Form Submit function to get External marks for Tabulation
	 */
	$('#markTabulationForm').submit(function(e){
		
		e.preventDefault();
		approval_ids = getApprovalIds();
		var isApproved = checkIsApproved(approval_ids);	
		getExternalTabulationDetails();
	});
	
	/**
	 * Submit Final Data for Approval
	 */
	$('#externalMarkTblnForm').submit(function(e){
		e.preventDefault();
		approval_ids = getApprovalIds();
		var tableData = $('#externalMarksTbln').DataTable().rows().data().toArray();
		var marks = createMarkData(tableData,approval_ids);	
		saveStudentMarkDetails(marks);
		
	});
	
})
/**
 * Initial loading
 * 
 * @returns
 */
function onLoad()
{
	$('#markTable').hide();
}



/**
 * Create Academic Information
 * 
 */
function createAcademicInfo()
{
	var academicInfo = {};
	academicInfo.programId = $('#selectProgram').val();
	academicInfo.batchId = $('#selectBatch').val();
	academicInfo.semesterId = $('#selectSemester').val();
	academicInfo.courseCode = $('#selectCourse').val();
	academicInfo.examTypeId =  $('#selectExamType').val();
	academicInfo.evaluationTypeId = $('#selectRevaluationType').val();
	
	return academicInfo;
}
/**
 * Get Approval IDs
 * 
 */
function getApprovalIds()
{
	var approvalIds;
	$.ajax({
   		url:BASE_URL+'getVivaVoceForApprovals',
   		method:'POST',
   		data:JSON.stringify(createAcademicInfo()),
   		async: false,
   		contentType: "application/json",
   		success:function(result)
   		{
   			console.log(result)
   			//toastr.success(result.message);
   			approvalIds = result.data;
   			
   		},
   		error:function(err)
   		{
   			showMessage(err);
   		}
   	});
	return approvalIds;
}

/**
 * 
 * Load Tabulation data from server
 */
function getExternalTabulationDetails()
{
	$.ajax({
   		url:BASE_URL+'getExternalMarksForTabulation',
   		method:'POST',
   		data:JSON.stringify(createAcademicInfo()),
   		async: false,
   		contentType: "application/json",
   		success:function(result)
   		{
   			console.log(result)
   			//var studentList = getStudentList();
   			var examId = $('#selectExamType').val();
   			var evaluationId = $('#selectRevaluationType').val();
   			var courseId = $('#selectCourse').val();
   			var studentList = loadStudentList(examId,evaluationId,courseId);
   			
   			//var studentListWithregNo = AddStudentRegNo(extMarkForTbl,studentList);
   			console.log(studentList);
   			//PopulateDatatable(extMarkForTbl);
   			//$('#markTable').hide();
   			//PopulateDatatable(studentListWithregNo);
   			
   			var studentListWithregNo = AddStudentRegNo(result.data,studentList);
   			var extMarkForTbl = AddInternalMarks(studentListWithregNo);
   			PopulateDatatable(extMarkForTbl);
   			$('#markTable').show();
   		},
   		error:function(err)
   		{
   			showMessage(err);
   		}
   	});
}
/**
 * Load loadStudentList
 * 
 */
function loadStudentList(examId,evaluationId,courseId)
{
	var studentList = null;
	$.ajax({
   		url:EXAM_NAME_URL+'registration/schedule/'+examId+'/evaluation/'+evaluationId+'/course/'+courseId,
   		method:'GET',   
   		async:false,
   		success:function(result)
   		{   			
   			studentList = result.data;   		    
   		    console.log(studentList);
   		},
   		error:function(err)
   		{
   			showMessage(err);
   		}
   	});	
	return studentList;
}

/**
 * Add Internal Marks
 * 
 */
function AddInternalMarks(externalMark)
{
	
	console.log(externalMark);
	$.ajax({
   		url:'/academic/getFinalInternalMarksByPBSC',
   		method:'GET',
   		data:{"program":$('#selectProgram').val(),"batch":$('#selectBatch').val(),"sem":$('#selectSemester').val(),"crs":$('#selectCourse').val()},
   		async: false,
   		contentType: "application/json",
   		success:function(result)
   		{
   			//console.log(result); 
   			$.each(externalMark, function (key, value) {
   			  //console.log(value.studentCode+"--"+key);
   			  //console.log(value)
   				$.each(result, function (key1, interns) {
   				  //console.log(value.studentCode+"----"+interns.usercode);
   				  //console.log(parseInt(value.studentCode) === parseInt(interns.usercode))
   					if(parseInt(value.studentId) === parseInt(interns.usercode))
   	   		        value.internalMark = interns.marks;
   	   		    })
   		    });
   			
   		},
   		error:function(err)
   		{
   			showMessage(err);
   		}
   	});
	
	console.log(externalMark);
	return externalMark;
}
/**
 * Populate Datatable
 * 
 */
function PopulateDatatable(studentMarkData)
{
	console.log(studentMarkData)
	$('#externalMarksTbln').DataTable().destroy();
	ExternalMarkTabulationDataTable =  $('#externalMarksTbln').DataTable({
        "language": {
            "emptyTable": "No data available for the Approval"
     },
     	//"retrieve": true,
		//"destroy": true,		
		"data":studentMarkData,
		"columns": [
		{ "data": "studentId"},
		{ "data": "studentCode","render":function(data){return $.trim(data)}},	
		{ "data": "studentName","render":function(data){ return $.trim(data)}},
		{ "data": "mark"},	
		{ "data": "internalMark"},	
		{ "data": "isPresent","render":function(data){
			console.log(data);
			if(data===true)
				return "<span class='pull-right badge bg-green'>Present</span>";
			else
				return "<span class='pull-right badge bg-red'>Absent</span>";
			} 
		}],
		columnDefs: [
			
			 {
				"targets": [ 1 ],
                "visible": false
			 }]
	});
}
/**
 * 
 * Add Student Final Marks
 * @param marks
 * @returns
 */

function saveStudentMarkDetails(marks)
{
	$.ajax({
   		url:BASE_URL+'addFinalMarks',
   		method:'POST',
   		data:JSON.stringify(marks),
   		async: false,
   		contentType: "application/json",
   		success:function(result)
   		{
   			console.log(result)
   			toastr.success(result.message);   	
   			$('#markTable').hide();
   			$('#markTabulationForm').trigger("reset");
   			$('#externalMarkTblnForm').trigger("reset");
   			
   		},
   		error:function(err)
   		{
   			showMessage(err);
   		}
   	});
}

/**
 * Create JSON for submit data to table
 * @param tableData
 * @param approval_ids
 * @returns
 */
function createMarkData(tableData,approval_ids)
{
	var marks = {};
	var studentsMarks = [];
	
	marks.academicYear = $('#selectAcademicYear').val();
	marks.batchId = $('#selectBatch').val();
	marks.batchName = $("#selectBatch option:selected" ).text();
	marks.courseCode = $('#selectCourse').val();
	marks.courseName = $('#selectCourse option:selected').text();
	marks.programId = $('#selectProgram').val();
	marks.programName = $("#selectProgram option:selected" ).text();
	marks.semesterId = $('#selectSemester').val();
	marks.semesterName = $("#selectSemester option:selected" ).text();
	marks.approvalIds = approval_ids;
	marks.approvalRemarks  = $('#remarks').val();
	marks.evaluationType = $('#selectRevaluationType').val();
	marks.evaluationName = $('#selectRevaluationType option:selected').text();
	marks.examType = $('#selectExamType').val();
	marks.examName = $('#selectExamType option:selected').text();
	marks.isNormalCourse = true;
	/* *
	 * TODO
	 * 
	 * marks.panel = 
	 * marks.panelMember = 
	 * marks.streamCode = 
	 * marks.streamName =
	
	 * 
	 * */
	
	$.each(tableData, function( key, value ) {
		  console.log(  value );
		  var studentMark = {};
		  studentMark.internal = value.internalMark;
		  studentMark.external = value.mark;
		  studentMark.studentId = value.studentId;
		  studentMark.studentName = value.studentName;
		  studentMark.total = parseInt(value.internalMark)+parseInt(value.mark);		  
		  studentMark.isPresent = value.isPresent;
		 // studentMark.status = "active";
		  studentsMarks.push(studentMark);
	});
	
	marks.studentFinalMarksDTO = studentsMarks;
	console.log(marks);
	return marks;
}

/**
 * Check data approved or not
 * 
 * @param ids
 * @returns
 */
function checkIsApproved(ids)
{
	var isApproved = false;
	$.ajax({
   		url:BASE_URL+'isApproved/'+ids,
   		method:'GET',   		
   		async: false,
   		contentType: "application/json",
   		success:function(result)
   		{
   			console.log(result)
   			if(result.data===true)
   				{
   					isApproved = true;
   					$('.approvals').hide();
   				}
   		},
   		error:function(err)
   		{
   			showMessage(err);
   		}
   	});
	return isApproved;
}