$( document ).ready(function() {
	var studentsMarkDataTable=null;
	var approval_ids = [];
	var isApproved;
	$('#markTabulationDiv').hide();
	
	$('#markTabulationForm').submit(function(e){
		e.preventDefault();		
		getStudentTabulationDetails();
		approval_ids = getApprovalIds();
		isApproved = checkIsApproved(approval_ids);	
	})
	
	$('#tabulationMarksForm').submit(function(e){
		e.preventDefault();
		var tableData = $('#tabulationTbl').DataTable().rows().data().toArray();
		console.log(tableData);		
		var marks = createMarkData(tableData,approval_ids);		
		var isEntered = isFacultyEnteredMarks();
		console.log("ALREADY ENTERED : " +isEntered);
		if(isEntered)
			{
				updateFinalMarks(marks);
			}else
				{
					saveStudentMarkDetails(marks);
				}
	})
	
})

function createMarkData(tableData,approval_ids)
{
	var marks = {};
	var studentsMarks = [];
	
	marks.academicYear = $('#selectAcademicYear').val();
	marks.batchId = $('#selectBatch').val();
	marks.batchName = $("#selectBatch option:selected" ).text();
	marks.courseCode = $('#selectVivatype').val();
	marks.courseName = $('#selectVivatype option:selected').text();
	marks.programId = $('#selectProgram').val();
	marks.programName = $("#selectProgram option:selected" ).text();
	marks.semesterId = $('#selectSemester').val();
	marks.semesterName = $("#selectSemester option:selected" ).text();
	marks.approvalIds = approval_ids;
	marks.approvalRemarks  = $('#remarks').val();
	marks.isNormalCourse = false;
	/* *
	 * TODO
	 * 
	 * marks.panel = 
	 * marks.panelMember = 
	 * marks.streamCode = 
	 * marks.streamName =
	 * marks.evaluationType = 
	 * 
	 * 
	 * */
	
	$.each(tableData, function( key, value ) {
		  console.log(  value );
		  var studentMark = {};
		  studentMark.internal = 0;
		  studentMark.external = 0;
		  studentMark.studentId = value.student_id;
		  studentMark.studentName = value.student_name;
		  studentMark.total = parseInt(value.reporttotal)+parseInt(value.vivatotal);		  
		  studentMark.isPresent = value.ispresent=="t"||value.isPresent=="t-f"||value.isPresent=="t-t"?true:false;
		 // studentMark.status = "active";
		  studentsMarks.push(studentMark);
	});
	
	marks.studentFinalMarksDTO = studentsMarks;
	console.log(marks);
	return marks;
}

function createAcademicInfo()
{
	var academicInfo = {};
	academicInfo.programId = $('#selectProgram').val();
	academicInfo.batchId = $('#selectBatch').val();
	academicInfo.semesterId = $('#selectSemester').val();
	academicInfo.courseCode = $('#selectVivatype').val();
	console.log(JSON.stringify(academicInfo));
	return academicInfo;
}

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
   			$('#markTabulationDiv').hide();
   			$('#markTabulationForm').trigger("reset");
   			$('#tabulationMarksForm').trigger("reset");
   		},
   		error:function(err)
   		{
   			showMessage(err);
   		}
   	});
}

function populateDataTable(studentMarkData)
{
	 $('#tabulationTbl').DataTable().destroy();
	 studentsMarkDataTable = $('#tabulationTbl').DataTable({
            "language": {
                   "emptyTable": "No data available for the verification"
                 },
			"processing": true,
			"destroy": true,		
			"data":studentMarkData,
			"responsive": true,
			"columns": [
			{ "data": "studentCode"},	
			{ "data": "student_id"},
			{ "data": "student_name"},	
			{ "data": "ispresent","render": function(data){
				console.log(data)
				if(data==="t" || data==="t-f" || data==="t-t")					
						return "<span class='pull-right badge bg-green'>Present</span>";				
				else				
					 return "<span class='pull-right badge bg-red'>Absent</span>";
				}
			},
			{ "data": "faculty"},	
			{ "data": "report","render": function(data){
								
				var blkstr = data.join();
				return blkstr;
			}},
			{ "data": "viva","render": function(data){
								
				var blkstr = data.join();
				return blkstr;
			}},
			
			{ "data": "reporttotal" },	
			{ "data": "vivatotal" },
			{ "data":null,"render":function(data,type,full,meta){
				return Math.round(parseFloat(full.reporttotal)+parseFloat(full.vivatotal));
				}
			}],
			columnDefs: [
				
				 {
					"targets": [ 1 ],
	                "visible": false
				 }]
		});
}
function createAcademicInfo()
{
	var formData =  {};
	formData.batchId = $('#selectBatch').val();
	formData.courseCode = $('#selectVivatype').val();
	formData.programId = $('#selectProgram').val();
	formData.semesterId = $('#selectSemester').val();
		
	return formData;
}
function getStudentTabulationDetails()
{
	
	 $.ajax({
	   		url:BASE_URL+'v2/getTabulationDetails',
	   		method:'POST',
	   		data:JSON.stringify(createAcademicInfo()),
	   		async: false,
	   		contentType: "application/json",
	   		success:function(result)
	   		{
	   			console.log(result);
	   			var studentList = getStudentList();
	   			var studentListWithregNo = AddStudentRegNo(result.data,studentList);
	   			//populateDataTable(result.data);
	   			populateDataTable(studentListWithregNo);
	   			$('#markTabulationDiv').show();
	   		},
	   		error:function(err)
	   		{
	   			showMessage(err);
	   		}
	   	});	
}
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
function isFacultyEnteredMarks()
{
	var isEntered = false;
	
	$.ajax({
   		url:BASE_URL+'checkIsFinalMarksEntered',
   		method:'POST',   		
   		async: false,
   		data:JSON.stringify(createAcademicInfo()),
   		contentType: "application/json",
   		success:function(result)
   		{
   			console.log(result)   
   			isEntered = result.data;
   		},
   		error:function(err)
   		{
   			showMessage(err);
   		}
   	});
	return isEntered;
}
function updateFinalMarks(finalMarks)
{

	$.ajax({
   		url:BASE_URL+'updateFinalMarks',
   		method:'POST',   		
   		async: false,
   		data:JSON.stringify(finalMarks),
   		contentType: "application/json",
   		success:function(result)
   		{
   			console.log(result)   
   			
   			toastr.success(result.message);
   			$('#markTabulationDiv').hide();
   			$('#markTabulationForm').trigger("reset");
   			$('#tabulationMarksForm').trigger("reset");
   		},
   		error:function(err)
   		{
   			showMessage(err);
   		}
   	});
}