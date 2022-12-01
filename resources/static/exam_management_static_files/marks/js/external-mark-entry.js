$( document ).ready(function() {
	
	var studentsMarkDataTable =null;
	onLoad();
	visibleFileComponent();
	fetchStudentList();
	
	//loadCourses();//Need to Remove
	//loadExamType();//Need to Remove
	//loadEvaluationType();//Need to Remove
	
	/*
	 * Submit Marks to server
	 */
	$('#externalMarkTblForm').submit(function(e){
		e.preventDefault();
		/*
		 * Check Whether mark of any student exceeds min marks
		 */		
		 var cells =  $("#externalMarksTbl tr td").filter(function() {
 	        return $(this).hasClass('text-red');
		 }).parent('tr');
		 
		 if(cells.length>0)//Validation Error
		 {			
    		  var studentName="";
    		  var studentlist="";
    		  $.each(cells, function(i, el) {
    			  var studentRow = $("#externalMarksTbl").DataTable().row( this ).data();
    			  studentName+=studentRow.studentName+',';
    			  studentlist = removeLastComma(studentName);
    		  });
    		
    		  $('#err_message').text("Kindly check marks of following students : "+studentlist);
    		  $('#err_alert').show();
		 }else
		 {			
			  $('#err_alert').hide();	
			  saveExternalMarks();
		 }
	});
	
});

/**
 Initialize Page On Load
**/
function onLoad()
{
	$("input[data-bootstrap-switch]").each(function(){
      $(this).bootstrapSwitch('state', $(this).prop('checked'));	  
    });	
	/*File Upload Component*/
	bsCustomFileInput.init();
	/*File Upload*/
	$('.excelMarkSheet').hide();
	/*Mark Table containing div show hide*/
	$('#markTable').hide();
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
change event of Method of Data Entry switch
**/
function visibleFileComponent()
{	
	$("input[data-bootstrap-switch]").on('switchChange.bootstrapSwitch', function (event, state) {
	
		if(state===true)
		{
			$('.excelMarkSheet').hide();
		}else{
			$(".custom-file-label").html('');
			$('.excelMarkSheet').show();			
		}
		$('#markTable').hide();		
	});	
}
/**
 *Submit button click event for getting student list
 **/
function fetchStudentList()
{
	
	
    $('#markForm').submit(function(e){
		 
		   e.preventDefault();	
		   $('#externalMarksTbl').DataTable().clear().destroy();
		   var isValid = false;	  
		   var isMarkEntered = checkFacultyMarkEntered();//CHECK WHETHER THE FACULTY ALREADY UPLOADED MARKS
		   var examId = $('#selectExamType').val();
		   var evaluationId = $('#selectRevaluationType').val();
		   var courseId = $('#selectCourse').val();
		   var studentsMarks = loadStudentList(examId,evaluationId,courseId);
		   if(!isMarkEntered){
				if($('#methodOfEntry').bootstrapSwitch('state')=== false)
				{
					var xlsreading = ExportToTable("markSheetFileUpload",callBack);
				    console.log("Excel file JSON Data : "+xlsreading);
				    
				}else{
						
						console.log(studentsMarks);					
						populateDataTable(studentsMarks);					
						if(studentsMarks)
							isValid = true;					
				}
				if(isValid)
				{
					$('#markTable').show();
				}
		   }else
			   {
				   var studentMarksByFaculty = getMarkEnteredByFaculty();
				   //var studentList = getStudentList();				  
			   	   //var studentListWithregNo = AddStudentRegNo(studentMarksByFaculty,studentList);
			   	   var studentListWithregNo = AddStudentRegNo(studentMarksByFaculty,studentsMarks);
				   console.log(studentMarksByFaculty)
				   $('#err_message').text("Already Marks entered by this faculty, You can modify.");
				   $('#err_alert').show();
				   populateDataTable(studentListWithregNo);
				   $('#markTable').show();
			   }
		})
}
/*
 * Get Student External Marks entered by the faculty
 * 
 */
function getMarkEnteredByFaculty()
{
	var studentMarks = null;
	$.ajax({
   		url:BASE_URL+'getExternalMarksEnteredByFaculty',
   		method:'POST',
   		data:JSON.stringify(createAcademicInfo()),
   		async: false,
   		contentType: "application/json",
   		success:function(result)
   		{
   			
   			studentMarks = result.data;
   		    
   		    
   		},
   		error:function(err)
   		{
   			showMessage(err);
   		}
   	});
	
	return studentMarks;
}
/**
To get Student List
**/
function getStudentListExternal()
{
	 var studentList;
	 $.ajax({
	   		url:'/students/getStudentsDetailsByProgramAndBatch-V2',
	   		method:'GET',
	   		data:{"programId":$('#selectProgram').val(),"batchId":$('#selectBatch').val()},
	   		async: false,
	   		success:function(data)
	   		{
	   			console.log(data);	   			
	   			studentList = jQuery.map(data, function(val, index) { 
	                return { 
	                	 "studentId":val.studentCode,
		                 "studentCode":val.regNo,
	                     "studentName": val.studentName,
	                     "mark":0,
	                     "isPresent":true
	                }; 
	            }) 
	        	console.log(data);
	   		},
	   		error:function(err)
	   		{
	   			showMessage(err);
	   		}
	   	});
	return studentList;
}
/**
* Populate Datatable
**/
function populateDataTable(studentMarkData)
{
	 console.log(studentMarkData);
	 $('#externalMarksTbl').DataTable().destroy();
	 studentsMarkDataTable = $('#externalMarksTbl').DataTable({
        "language": {
                   "emptyTable": "No data available for the verification"
            },
            "retrieve": true,
			"destroy": true,		
			"data":studentMarkData,
			"columns": [			
			{ "data": "studentId"},
			{ "data": "studentCode"},
			{ "data": "studentName","render":function(data){ return $.trim(data)}},
			{ "data": "mark"},	
			{ "data": "isPresent" },	
			{ "data": null	}],	
			createdRow: function ( row, data, index ) {
				console.log(data);				
	            if(data.mark > EXTERNAL_MAX_MARK) {	    
	            	 $('td', row).eq(2).addClass('text-red  text-bold');  
	            }
	           
	            if(!data.isPresent)
            	{
	            	$('td', row).eq(2).text(0); 	            	
            	}
	        },
			columnDefs: [{				
					targets: [-1], render: function (a, b, data, d) {
						return '<i class="fas fa-edit" id="editIcon"></i>' 
					}
			 },
			 {  	 targets: [-2], render: function (a, b, data, d ) {					
					 data.isPresent = jQuery.type(data.isPresent) === "string"?Boolean($.parseJSON(data.isPresent.toLowerCase())): data.isPresent ;// Boolean(data.isPresent);
					 return '<input type="checkbox" disabled class="editor-active"  id="'+d.row+'" '+(data.isPresent? 'checked' : '')+'>';
					}
			 },{
					"targets": [ 0 ],
	                "visible": false
				 },{
						"targets": [ 2 ],
		                "visible": false
					 }]
		});


$('#externalMarksTbl tbody').off().on('click', '#editIcon', function (e) {
	e.stopPropagation(); 
	var data = studentsMarkDataTable.row($(this).parents('tr')).data();
	/*
	 * To check already any row of the datatable is in edited state
	 */
	var isEditing = checkIsEditingCells();
	/*
	 * If datatable is not in edited state the allow to edit
	 */
	 if(!isEditing)
	    	{
		    	$(this).removeClass().addClass("fa fa-save").attr("id","saveIcon");	
		          var $row = $(this).closest("tr"); 
		          /* Add class editing to current row for indicating the row is editing */
		          $row.addClass('editing');
		          /* Avoid editing of first,second and last column of the row */
		          var $tds = $row.find("td").not(':first').not(':last').not(':nth-child(2)');
		          /* Enable remaining cells of the row for editing */
		          $.each($tds, function(i, el) {        	
		            var txt = $(this).text();
		            if(i!=1)
		          	  $(this).html("").append("<input type='text' value='"+txt+"'>");
		            else
		          	 {	        	 
		          	  $(this).html("").append('<input type="checkbox" '+(data.isPresent? 'checked' : '')+'>');
		          	 }
		          });
	    	}
	    /*
		 * If datatable is in edited state then show msg to user
		 */
	    else
	    	{
	    		toastr.error("Kindly check and save mark details that you are editing.");
	    	}
})

$("#externalMarksTbl tbody").on('click', "#saveIcon", function(e) {
	e.stopPropagation();
    $(this).removeClass().addClass("fas fa-edit").attr("id","editIcon");
    var $row = $(this).closest("tr");
    /*Remove class='editing' on saving the data in datatable*/
    $row.removeClass('editing');
    var $tds = $row.find("td").not(':first').not(':last').not(':nth-child(2)');
    var chk = true;
    $.each($tds, function(i, el) {
    	
      var txt = $(this).find("input[type='text']").val();    
      /*Save individual cells with updated value*/
      switch(i)
      	{
      	case 0:	  
      		
      		$('#externalMarksTbl').dataTable().fnUpdate(parseFloat(txt), [$row], $(this), false);  
      		if((parseInt(txt)<=EXTERNAL_MAX_MARK) && $(this).hasClass('text-red'))
      			$(this).removeClass('text-red  text-bold');
      		else if(parseInt(txt)>EXTERNAL_MAX_MARK)
      			$(this).addClass('text-red  text-bold');
      		break;
      
      	case 1:	 
      		chk = $(this).find("input[type='checkbox']").is(':checked');
      		console.log(chk)
      		$('#externalMarksTbl').dataTable().fnUpdate(chk , [$row], $(this), false);
      		break;
      	}
       /*Reset value of textbox to 0 if the student is not present*/
       if(chk==false){
    	   $('#externalMarksTbl').DataTable().cell($row, 3).data(0).draw();
    	   if($tds.hasClass('text-red'))
           	$tds.removeClass('text-red  text-bold');
       }       
	});
  });	
	
}
/*
 * Method to remove last comma from concat string
 */
function removeLastComma(strng){        
    var n=strng.lastIndexOf(",");
    var a=strng.substring(0,n) 
    return a;
}
/*
 * Method to save external marks
 */
function saveExternalMarks()
{
	var isEditing = checkIsEditingCells();
	if(!isEditing)
		{
			var tableData = $('#externalMarksTbl').DataTable().rows().data().toArray();
			console.log(tableData);  
			var approvalids = getApprovalIds();
			 var externalMark = createMarkJSON(tableData,approvalids);
			    //console.log(assessmentMark);			 
	         var msg  = {
					title : "Save",
					msg : " Are you sure to save marks?"
					}
					ConfirmDialog(msg,"SAVE").then( function(response){	
						submitExternalMarks(JSON.stringify(externalMark));						
					},function(error){

					});
		}else
			{
			toastr.error("Kindly check and save mark details that you are editing.");
			}
	  
}
/*
 * Method to submit external marks to server
 */
function submitExternalMarks(externalMarks)
{
	 $.ajax({
	   		url:BASE_URL+"addExternalMarks",
	   		method:'POST',
	   		data:externalMarks,
	   		contentType: "application/json",
	   		success:function(data)
	   		{
	   			//console.log(data);	   			
	   			toastr.success(data.message);
	   			resetMarkForm();
	   		},
	   		error:function(data)
	   		{
	   			toastr.error(data.message);
	   		}
	   	});
}
/*
 * Reset Form
 * 
 */
function resetMarkForm()
{
	$("#markForm")[0].reset();
	$('#markTable').hide();		
}
/*
 * Create JSON for Posting
 * 
 */
function createMarkJSON(tableData,approvalids)
{
	 var externalMark = {};
	 //TODO AFTER PANEL ASSIGNMENT
    
	 var externalMark =  $("#markForm").serializeObject();	
	 console.log(externalMark)
	 externalMark.batchName = $("#selectBatch option:selected").text();
	 externalMark.courseName =  $("#selectCourse option:selected").text();
	 externalMark.programName = $("#selectProgram option:selected").text();
	 externalMark.semesterName = $("#selectSemester option:selected").text();	
	 externalMark.examName = $("#selectExamType option:selected").text();	
	 externalMark.evaluationTypeName = $("#selectRevaluationType option:selected").text();	
	 externalMark.approvalIds = approvalids;
	 externalMark.studentExternalMarkDTO = tableData;
	 externalMark.isNormalCourse = true;
     console.log(externalMark);
     return externalMark;
	
}
/*
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

/*
 * Get Approval ids
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
/*
 * Method to check whether the table cells are in editable mode or not
 */
function checkIsEditingCells()
{
	var isEditing = false;
    studentsMarkDataTable.rows().every(function(rowIdx, tableLoop, rowLoop){
    	if($(this.node()).hasClass('editing'))
	    {
    		isEditing = true; 
    		return false;
    	}	
	}) 
	return isEditing;
}
/*
 * Check whether the faculty already entered the mark
 * 
 */
function checkFacultyMarkEntered()
{
	var isEntered=false;
	var formData =  {
			  "batchId": $('#selectBatch').val(),
			  "courseCode":$('#selectCourse').val(),
			  "programId": $('#selectProgram').val(),
			  "semesterId": $('#selectSemester').val(),
			  "examTypeId":$('#selectExamType').val(),
			  "evaluationTypeId":$('#selectRevaluationType').val()
			}
		 $.ajax({
		   		url:BASE_URL+'checkIsExternalMarksEntered',
		   		method:'POST',
		   		data:JSON.stringify(formData),
		   		async: false,
		   		contentType: "application/json",
		   		success:function(result)
		   		{
		   			isEntered = result.data;
		   		},
		   		error:function(err)
		   		{
		   			showMessage(err);
		   		}
		   	});
	return isEntered;
}