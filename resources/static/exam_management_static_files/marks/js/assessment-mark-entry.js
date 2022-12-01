$( document ).ready(function() {
	
	$('#internalMarksEntry').hide();
	$('.excelMarkSheet').hide();
	//$('#markTable').hide();
	$('#err_alert').hide();
	var studentsMarkDataTable =null;
	var markConfig = null;
	var configSetting;
	
	
	$("input[data-bootstrap-switch]").each(function(){
      $(this).bootstrapSwitch('state', $(this).prop('checked'));	  
    });	
	
	bsCustomFileInput.init();
    
	/**
	 * Internal Button click event to show table for internal mark enry.
	 */
    $('#add-new-internals').on('click',function(){
    	$('#internalMarksEntry').show();
    })
    /** 	  
	change event of no due certificate switch
	**/
	$("input[data-bootstrap-switch]").on('switchChange.bootstrapSwitch', function (event, state) {
	
		if(state===true)
		{
			$('.excelMarkSheet').hide();
		}else{
			$('.excelMarkSheet').show();			
		}
		$('#markTable').hide();		
	});
    /** 	  
	Submit Button Action 
	**/
    $('#markForm').submit(function(e){
		 
		   e.preventDefault();	
		   $('#studentMarksTbl').DataTable().clear().destroy();
		   var isValid = false;
		   var isMarkEntered = checkFacultyMarkEntered();//CHECK WHETHER THE FACULTY ALREADY UPLOADED MARKS
		   
		   if(!isMarkEntered){
			    
				if($('#methodOfEntry').bootstrapSwitch('state')=== false)
				{
					var xlsreading = ExportToTable("markSheetFileUpload",callBack);
				    //console.log("Excel file JSON Data : "+xlsreading);
				    
				}else{
					$('#err_alert').hide();
					var studentsMarks = getStudentList();
					//console.log(studentsMarks);					
					populateDataTable(studentsMarks);					
					if(studentsMarks)
						isValid = true;
					
				}
				if(isValid)
					{
						//$('#markTable').show();
					}
		   }else
			{
			   	  
				  var studentMarksByFaculty = getMarkEnteredByFaculty();
				
				  console.log(studentMarksByFaculty);
				  $('#err_message').text("Already Marks entered by this faculty, You can modify.");
	    		  $('#err_alert').show();
	    		  var studentList = getStudentList();
		   		  var studentListWithregNo = AddStudentRegNo(studentMarksByFaculty,studentList);
				  populateDataTable(studentListWithregNo);
				 // $('#markTable').show();
			}
		})
 
    /** 	  
	Table Data Submit Action 
	**/
    $('#markTblForm').submit(function(e){
    	e.preventDefault();
    	//var tableData = makeJsonData(); 
    	  var cells =  $("#studentMarksTbl tr td").filter(function() {
    	        return $(this).hasClass('text-red');
    	  }).parent('tr');
    	  //console.log(cells)
    	  
    	  if(cells.length>0)//Validation Error
    		 {
    		    
    			 
		    		  var studentName="";
		    		  var studentlist="";
		    		  $.each(cells, function(i, el) {
		    			  var studentRow = $("#studentMarksTbl").DataTable().row( this ).data();
		    			  studentName+=studentRow.studentName+',';
		    			  studentlist = removeLastComma(studentName);
		    		  });
		    		
		    		  $('#err_message').text("Kindly check marks of following students : "+studentlist);
		    		  $('#err_alert').show();
    			 
    		 }else
			 { 	
    			 /*
     			 * To check already any row of the datatable is in edited state
     			 */
     			  var isEditing = checkIsEditingCells();
    			  if(!isEditing){
					  $('#err_alert').hide();
					  postMarks();
				 	}else
				 	{
				 		toastr.error("Kindly check and save mark details that you are editing.");
				 	}
			 }
    })
    /** 	  
	Hide Mark Entry table on Form change
	**/
    $('#markForm').on('change',function(){
    	$('#markTable').hide();
    })

});

function removeLastComma(strng){        
    var n=strng.lastIndexOf(",");
    var a=strng.substring(0,n) 
    return a;
}
function postMarks()
{
	var tableData = $('#studentMarksTbl').DataTable().rows().data().toArray();
	console.log(tableData); 
	var approvalids = getApprovalIds();
    var assessmentMark = createMarkJSON(tableData,approvalids);
    //console.log(assessmentMark);
  
 
        var msg  = {
				title : "Save",
				msg : " Are you sure to save marks?"
				}
				ConfirmDialog(msg,"SAVE").then( function(response){	
					addAssessmentMarks(JSON.stringify(assessmentMark));						
				},function(error){

				});
}

function createMarkJSON(tableData,approvalids)
{
	 var assessmentMark = {};
	 //TODO AFTER PANEL ASSIGNMENT
     //assessmentMark.programId = ;
     //assessmentMark.programName = ;
	 var assessmentMark =  $("#markForm").serializeObject();	
	 assessmentMark.batchName = $("#selectBatch option:selected").text();
     assessmentMark.courseName =  $("#selectVivatype option:selected").text();
     assessmentMark.programName = $("#selectProgram option:selected").text();
     assessmentMark.semesterName = $("#selectSemester option:selected").text();
     assessmentMark.approvalIds = approvalids;
     assessmentMark.isNormalCourse = false;
     //console.log(tableData)  
     assessmentMark.studentVivaVocesDTO = tableData;
     
     return assessmentMark;
	
}


function addAssessmentMarks(marksdetails)
{
	 $.ajax({
	   		url:BASE_URL+"addVivaVoce",
	   		method:'POST',
	   		data:marksdetails,
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

function resetMarkForm()
{
	$("#markForm")[0].reset();
	$('#markTable').hide();		
}
function populateDataTable(studentMarkData)
{
	 configSetting = getMarkConfig();//GET MARK CONFIGURATION DETAILS
	 console.log(configSetting);
	 if(configSetting && studentMarkData.length>0){
		 
		 $("#markTable").show();
		 
	 	 studentsMarkDataTable = $('#studentMarksTbl').DataTable({
		 	"language": {
                   "emptyTable": "No data available for the verification"
            },
			//"processing": true,
            "retrieve": true,
			"destroy": true,		
			"data":studentMarkData,
			"responsive": true,
			"columns": [
			{ "data": "studentId","render":function(data){ return $.trim(data)}},	
			{ "data": "studentCode"},
			{ "data": "studentName","render":function(data){ return $.trim(data)}},
			{ "data": "report"},
			{ "data": "viva" },		
			{ "data": "isPresent" },	
			{ "data": null	}],
			fnPreDrawCallback:function(){			
				   $('#maxMarkRecords').text(configSetting.reportFaculty);
				   $('#maxMarkViva').text(configSetting.vivaFaculty);				
			},
			createdRow: function ( row, data, index ) {
				//console.log(data);
				if(configSetting){
		            if(data.report>configSetting.reportFaculty) {	    
		            	 $('td', row).eq(2).addClass('text-red  text-bold');  
		            }
		            if(data.viva>configSetting.vivaFaculty)
	            	{
		            	$('td', row).eq(3).addClass('text-red  text-bold');            	
	            	}
		            if(!data.isPresent)
	            	{
		            	$('td', row).eq(2).text(0); 
		            	$('td', row).eq(3).text(0);  
	            	}
				}
	        },
			columnDefs: [
			 {				
					targets: [-1], render: function (a, b, data, d) {
						return '<i class="fas fa-edit" id="editIcon"></i>' 
					}
			 },
			 {  	
					 targets: [-2], render: function (a, b, data, d ) {					
					 data.isPresent = jQuery.type(data.isPresent) === "string"?Boolean($.parseJSON(data.isPresent.toLowerCase())): data.isPresent ;// Boolean(data.isPresent);
					 return '<input type="checkbox" disabled class="editor-active"  id="'+d.row+'" '+(data.isPresent? 'checked' : '')+'>';
					}
			 },
			 {
				"targets": [ 0 ],
                "visible": false
			 }]
		});

	 }else
	 {
		 $("#markTable").hide();
		 if(configSetting===null)
			 toastr.error("Mark Configuration against the selected program is not added!!");
		 if(studentMarkData.length===0)
			 toastr.error("No student list available for the selected program!!");
		 
	 }
$('#studentMarksTbl tbody').off().on('click', '#editIcon', function (e) {
	e.stopPropagation(); 
	/*
	 * To check already any row of the datatable is in edited state
	 */
	var isEditing = checkIsEditingCells();
	//console.log(isEditing)
	/*
	 * If datatable is not in edited state the allow to edit
	 */
	 if(!isEditing)
    	{
		 	var data = studentsMarkDataTable.row($(this).parents('tr')).data();
		    //console.log(configSetting);
		    $(this).removeClass().addClass("fa fa-save").attr("id","saveIcon");	
	        var $row = $(this).closest("tr");
	        $row.addClass('editing');
	        //console.log($row)
	        var $tds = $row.find("td").not(':first').not(':last').not(':nth-child(2)');
	       
	        $.each($tds, function(i, el) {
	        	
	          var txt = $(this).text();	
	          
	          //console.log(txt);
	          if(i!=2)
	        	  $(this).html("").append("<input type='number' value='"+txt+"'>");
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

$("#studentMarksTbl tbody").on('click', "#saveIcon", function(e) {
	e.stopPropagation();
    $(this).removeClass().addClass("fas fa-edit").attr("id","editIcon");
    var $row = $(this).closest("tr");
    $row.removeClass('editing');
    var $tds = $row.find("td").not(':first').not(':last').not(':nth-child(2)');
    var chk = true;
    $.each($tds, function(i, el) {
    	
      var txt = $(this).find("input[type='number']").val();    
   
      switch(i)
      	{
      	case 0:	      	
      		$('#studentMarksTbl').dataTable().fnUpdate(parseFloat(txt), [$row], $(this), false);
      		if((parseInt(txt)<=configSetting.reportFaculty) && $(this).hasClass('text-red'))
      			$(this).removeClass('text-red  text-bold');
      		else if((parseInt(txt)>configSetting.reportFaculty))
      			$(this).addClass('text-red  text-bold');
      		break;
      	case 1:
      		$('#studentMarksTbl').dataTable().fnUpdate(parseFloat(txt), [$row], $(this), false);
      		if((parseInt(txt)<=configSetting.vivaFaculty) && $(this).hasClass('text-red'))
      			$(this).removeClass('text-red  text-bold');
      		else if((parseInt(txt)>configSetting.vivaFaculty))
      			$(this).addClass('text-red  text-bold'); 
      		break;
      	case 2:	 
      		chk = $(this).find("input[type='checkbox']").is(':checked');
      		$('#studentMarksTbl').dataTable().fnUpdate(chk , [$row], $(this), false);
      		break;
      	}
       if(chk==false){
        $('#studentMarksTbl').DataTable().cell($row, 3).data(0).draw();           
        $('#studentMarksTbl').DataTable().cell($row, 4).data(0).draw();           
        if($tds.hasClass('text-red'))
        	$tds.removeClass('text-red  text-bold');
       }
       
	});
  });	

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
function checkFacultyMarkEntered()
{
	var isEntered=false;
	var formData =  {
			  "batchId": $('#selectBatch').val(),
			  "courseCode":$('#selectVivatype').val(),
			  "programId": $('#selectProgram').val(),
			  "semesterId": $('#selectSemester').val()
			}
		 $.ajax({
		   		url:BASE_URL+'checkIsFacultyMarksEntered',
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

function getMarkConfig()
{
	
	var markConfigData = null;
	$.ajax({
   		//url:BASE_URL+'getMarkConfigByPgmId/'+ $('#selectProgram').val()+"/coursecode/"+$('#selectVivatype').val(),
		url:MARKS_CONFIG_viva +$('#selectProgram').val()+"/coursecode/"+$('#selectVivatype').val(),
   		method:'GET',
   		async: false,
   		contentType: "application/json",
   		success:function(result)
   		{   			
   			markConfigData = result.data;   			
   		},
   		error:function(err)
   		{
   			showMessage(err);
   		}
   	});
	
	return markConfigData;
}
function getMarkEnteredByFaculty()
{
	var studentMarks = null;
	$.ajax({
   		url:BASE_URL+'getMarksEnteredByFaculty',
   		method:'POST',
   		async: false,
   		data:JSON.stringify(createAcademicInfo()),
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
function createAcademicInfo()
{
	var academicInfo = {};
	academicInfo.programId = $('#selectProgram').val();
	academicInfo.batchId = $('#selectBatch').val();
	academicInfo.semesterId = $('#selectSemester').val();
	academicInfo.courseCode = $('#selectVivatype').val();
	
	return academicInfo;
}
