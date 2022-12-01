$( document ).ready(function() {
	var studentsMarkDataTable=null;
	var approval_ids = [];
	var isApproved;
	$('#markTabulationDiv').hide();
	  var vivaTypes =[
	    	{	
	    		"other_course_code": "CLLM1INTERN", 
	    		"other_course_name": "INTERNSHIP", 
	    		"other_course_credits": "2", 
	    		"other_course_status": "valid"
	    	},
	    	{	
	    		"other_course_code": "CLLM1FINALSEMVIVA", 
	    		"other_course_name": "FINAL SEMESTER VIVA", 
	    		"other_course_credits": "5", 
	    		"other_course_status": "valid"
	    	},
	    	{	
	    		"other_course_code": "CLLM1DESSERTATION", 
	    		"other_course_name": "DESSERTATION", 
	    		"other_course_credits": "3", 
	    		"other_course_status": "valid"
	    	}
		]
		/** 
			Populate vivaTypes on the dropdown
	    **/
		$.each(vivaTypes, function (key, value) {
	        $("#selectVivatype").append($("<option></option>").val(value.other_course_code).html(value.other_course_name));
	    });
	
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
	marks.courseCode = $('#selectVivatype').val();//TODO Replace with actual value
	marks.courseName = $('#selectVivatype').val();//TODO Replace with actual value
	marks.programId = $('#selectProgram').val();
	marks.programName = $("#selectProgram option:selected" ).text();
	marks.semesterId = $('#selectSemester').val();
	marks.semesterName = $("#selectSemester option:selected" ).text();
	marks.approvalIds = approval_ids;
	marks.approvalRemarks  = $('#remarks').val();
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
		  studentMark.studentId = value.studentId;
		  studentMark.studentName = value.studentName;
		  studentMark.total = parseInt(value.reportTotal)+parseInt(value.vivaTotal);		  
		  studentMark.isPresent = value.isPresent==="t-t"?true:false;
		  // studentMark.status = 
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
   		},
   		error:function(err)
   		{
   			showMessage(err);
   		}
   	});
}

function populateDataTable(studentMarkData)
{
	 studentsMarkDataTable = $('#tabulationTbl').DataTable({
        "language": {
                   "emptyTable": "No data available for the verification"
                 },
			//"processing": true,
			"destroy": true,		
			"data":studentMarkData,
			"columns": [
			{ "data": "studentId"},	
			{ "data": "studentName"},			
			{ "data": "isPresent","render": function(data){
				console.log(data)
				var slptArr = $.trim(data).split('-');
			   
				var ColumnBuilder = "<ul class='nav nav-pills flex-column'>";
				$.each(slptArr, function (index, value) {
					console.log(value);
					if(value==="t")
						ColumnBuilder += "<li class='nav-item'><span class='pull-right badge bg-green'>Present</span></li>";
					else
						ColumnBuilder += "<li class='nav-item'><span class='pull-right badge bg-red'>Absent</span></li>";
				});
				return ColumnBuilder + "</ul>"
				}
			},
			{ "data": "report","render": function(data){
				console.log(data)
				var slptArr = data.split(',');
			   
				var ColumnBuilder = "<ul class='nav nav-pills flex-column'>";
				$.each(slptArr, function (index, value) {
					var markArr = value.split('-');
					ColumnBuilder += "<li class='nav-item'> <span class='nav-link'>" + markArr[0]+  "<span class='float-right text-danger direct-chat-name'> "+ markArr[1]+"</span></span> </li>";
				});
				return ColumnBuilder + "</ul>"
				}
			},
			{ "data": "viva" ,"render": function(data){
				console.log(data)
				var slptArr = data.split(',');
			   
				var ColumnBuilder = "<ul class='nav nav-pills flex-column'>";
				$.each(slptArr, function (index, value) {
					var markArr = value.split('-');
					ColumnBuilder += "<li class='nav-item'> <span href='#' class='nav-link'>" + markArr[0]+  "<span class='float-right text-danger direct-chat-name'> "+ markArr[1]+"</span></span> </li>";
				});
				return ColumnBuilder + "</ul>"
				}
			},	
			{ "data": "reportTotal" },	
			{ "data": "vivaTotal" },
			{ "data":null,"render":function(data,type,full,meta){
				return parseInt(full.reportTotal)+parseInt(full.vivaTotal);
			}}]
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
	   			console.log(result)
	   			populateDataTable(result.data);
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
   		},
   		error:function(err)
   		{
   			showMessage(err);
   		}
   	});
}