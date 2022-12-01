$( document ).ready(function() {
  

  var scheduleDataTable;
  var scheduleId;
  var activeScheduleId;
 
  /* **************************************************************************/
	/* exam fee settings  by rishi*/
	/* ****************************************************************************/
	
	var feeConfigMap={};// in case nuals need dynamic addition of fee config, we can set the values from an //api
	var selectedConfigArray=new Array();
	selectedConfigArray ="Exam-fee,Testing-Fee";
	var pgmId=200;// set this from ur code
	var examScheduleId="abc";//set this from ur code
	
	$.ajax(
	{
		"url":"/fees/getAllConfigByType",
		"data":{"configType":"Examination"},
		success:function(data)
		{
			console.log(data);
			if(data)
			{
				for(let i=0;i<data.length;i++)
				{
					feeConfigMap[data[i]['processName']]=data[i]['processName'];
				}
				setUpCheckBox(feeConfigMap,'checkBoxTable');
			}
		}
	});
	
	function setUpCheckBox(maparray,tableId)
	{
		selectedConfigArray=[];
		for (let key in maparray) 
		{
			if (maparray.hasOwnProperty(key)) 
			{
				var tr=$('<tr><td>'+maparray[key]+'</td><td><input  configkey="'+key+'"  id="'+key+'" type="checkbox" class="configList" style:"margin-right: 20px"></td></tr>');
				$('#'+tableId).append(tr);
				//selectedConfigArray.push(key);
				
			}
		}
		$('.configList').unbind().bind('change',function()
		{
			
			var configKey=$(this).attr('id');
			if(this.checked)
			{
				addToArray(configKey);
			}
			else
			{
				removeFromArray(configKey);
			}
			getAmountDetails();		
		});
		
	}
	

	
	
	function addToArray(stud)
	{
	   if(selectedConfigArray.indexOf(String(stud)) !== -1)
	   {
	   }
	   else
	   {
		   selectedConfigArray.push(String(stud));  
	   }
	}
	function removeFromArray(stud)
	{
	   if(selectedConfigArray.indexOf(String(stud)) !== -1)
	   {
		   stud=String(stud)
		   selectedConfigArray = jQuery.grep(selectedConfigArray,function(value) 
		   {
			   return value != stud;
		   }); 
	   }
	}
	
	function displayInfo(data)
	{
		$('#displayTable1').empty();
		for(let i=0;i<data.length;i++)
		{
			var tr=$('<tr><td>'+feeConfigMap[data[i]['configKey']]+'</td><td>'+data[i]['feeAmount']+'</td></tr>');
			$('#displayTable1').append(tr);
		}
	}
	
	function getAmountDetails()
	{
		if(selectedConfigArray.length>0)
		{
			$.ajax(
			{
				"url":"/fees/getManyFeeHeadAmountMap",
				"data":{"pgmId":$('#selectProgramEdit').val(),"feeIdentifierList":String(selectedConfigArray)},
				success:function(data)
				{
					
					var feeHeads = data.length;
					var configArray = selectedConfigArray.length;
										
					if(data.length == 0 )
						toastr.error("No fee set for this program!!");
					else if( configArray != feeHeads )
						toastr.error("No fee set for this program!!");
					else
					displayInfo(data);
				},
				error:function(e)
				{
					console.log("Error in calling ajax "+e);
				}
			});
		}
		else
		{
			$('#displayTable1').empty();
		}	
	}
	
	/* ***************************************************************************************************** */
  
  $('#selectSemester').unbind().bind('change',function(){
	
	   var program = $( "#selectProgram option:selected" ).val();
	   var batch = $( "#selectBatch option:selected" ).val();
	   var semester = $( "#selectSemester option:selected" ).val();
	 
	   $.ajax({
   	   	   "url": BASE_URL+"schedule/list",
		   "type":"POST",
		    "data":{"program":program,"batch":batch,"semester":semester},
	   		success: function(data)
	   		{
	   		    var examDetails = data.data;
	   		  	
	   		 setUpDropDown("selectExamName",examDetails,"id","name_exam");
	   		   
	   		   
	   		},
	   		error:function(err)
	   		{
	   			showMessage(err);
	   		}
       });
	});
  $('#selectSemesterEdit').unbind().bind('change',function(){
		
	  var exam_type = $( "#selectExamTypeEdit option:selected" ).text();
	     var program = $( "#selectProgramEdit option:selected" ).val();
		   var batch = $( "#selectBatchEdit option:selected" ).val();
		   var semester = $( "#selectSemesterEdit option:selected" ).val();
		 
		 $.ajax({
	  	   	   "url": BASE_URL+"schedule/type/list",
			   "type":"POST",
			    "data":{"program":program,"batch":batch,"semester":semester,"exam_type":exam_type},
	  		success: function(data)
	  		{
	  		    var examDetails = data.data;
	  		  	
	  		   setUpDropDown("selectExamNameEdit",examDetails,"id","name_exam");
	  		 
	  		   
	  		},
	  		error:function(err)
	  		{
	  			showMessage(err);
	  		}
	  	});
		
	});
  
  /*
   * load revaluation details
   */ 
   $('#formRevaluation').submit(function (event) {
          event.preventDefault();
     
   	   		  	
   	   	       bindDetails();
   	   		   
   	   		
   	});
  
   /*
    * bind the schedule and revaluation details
    */   
   function bindDetails()
   {
	   var scheduleId = $( "#selectExamName option:selected" ).val();
   	   var evalType = $( "#selectEvalType option:selected" ).val();
   	   
	   
		$("#divRevaluation").show();
	 	var statusDataTable =  $('#tblRevaluation').DataTable({
	           "language": {
                    "emptyTable": "Revaluation/ Scrutiny Schedule not found  for the selected exam name"
                  },
			"processing": true,
			"destroy": true,
			"ajax":BASE_URL+"revaluation/list/schedule-id/"+scheduleId,
			"columns": [
			{ "data": "examName" },
			{ "data": "evalTypeName"},
		    { "data": "lastDateApply","render": function(data){return moment(data).format('DD-MM-YYYY')}},
			{"data":"approvalStatus"},
			{
					"data": null,
					"defaultContent":
						'<a data-toggle="collapse" href="#"  class=""small-box-footer text-danger" id="btnDetails"><i class="fas fa-eye"></i></a>'
			},
			{
					"data": null,
					"defaultContent":
						'<a data-toggle="collapse" href="#"  class=""small-box-footer text-danger" id="btnEdit"> <i class="fas fa-edit"></i></a>' 
						 
			}
		]
		});
		
	 	
	 	  $('#tblRevaluation tbody').on('click', '#btnDetails', function () {
	 	      
	 	        var data = statusDataTable.row($(this).parents('tr')).data();
	            
	               
	               $("#divViewSchedules").show();
	               $("#editRevaluation").hide();
		 		   $("#applnType").text(data.evalTypeName+ "  Schedule");
		 		   $("#academicYear").text(data.academicYear);
		 		   $("#programView").text(data.program);
		 		   $("#batch_sem").text(data.batch + " - "+data.semester);
		 		   $("#exam_type").text(data.examName);
		 		   $("#exam_name").text(data.examName);
		 		   $("#tentative_date").text( moment(data.lastDateApply).format('D/MM/YYYY'));
		 		   $("#date_without_fine").text( moment(data.dateWithoutFine).format('D/MM/YYYY'));
		 		   $("#date_with_fine").text( moment(data.dateWithFine).format('D/MM/YYYY'));
		 		   $("#instructions").text(data.instructions);
		 		   bindFeeDetails(data.feeSettings,data.programId);
		 		   selectedConfigArray =  data.feeSettings.split(",");
	            
	 	  });
	
		  $('#tblRevaluation tbody').on('click', '#btnEdit', function () {
	 	      
	 	      var data = statusDataTable.row($(this).parents('tr')).data();
	 	      $("#divViewSchedules").hide();
	 	      $("#editRevaluation").show();
	      
	 	     
	 	  	loadAcademicYear(data.academicYear);
	 	  	getAllPrograms(data.programId);
	 	  	activeScheduleId = data.id;
	 	
	 	   bindFeeDetails(data.feeSettings,data.programId);
	 	//  	$("#selectRevaluationTypeEdit option:contains(" + data.evalType +")").attr("selected", "selected");
	 	 
	 	  	$('html, body').animate({
	 	         scrollTop: $("#editRevaluation").offset().top
	 	   }, 1000);
	 	  	

	 	   loadExamTypes(data.examType);

	 	 	$("#selectProgramEdit").val(data.programId).trigger("change");
	 	 	$("#selectBatchEdit").val(data.batchId).trigger("change");
	 	  	$("#selectSemesterEdit").val(data.semester).trigger("change");
	 	 	$("#tentativeDateEdit").val( moment(data.lastDateApply).format('DD-MM-YYYY'));
	 	 	$("#dateWithouFine").val( moment(data.dateWithoutFine).format('DD-MM-YYYY'));
	 	 	$("#dateFine").val( moment(data.dateWithFine).format('DD-MM-YYYY'));
	 	 	$("textarea#instructions").val(data.instructions);
	 	 	$("#selectExamNameEdit option:contains(" + data.examName +")").attr("selected", "selected");
	 	 	$("#selectExamNameEdit").val(data.examName).trigger("change");   
	 		$("#selectRevaluationTypeEdit").val(data.evalType).trigger("change");
	 	  	
	 	 	
	 	  });
	   
   }

   


 function bindFeeDetails(selectedConfigArray,programId)
 {
	 console.log(selectedConfigArray);
	 console.log(programId);

    $.ajax(
		{
			"url":"/fees/getManyFeeHeadAmountMap",
			"data":{"pgmId":programId,"feeIdentifierList":String(selectedConfigArray)},
			success:function(data)
			{
				console.log(data.length);
				$('#displayTable').empty();
				$('#displayTable1').empty();
					for(let i=0;i<data.length;i++)
					{
						 var tr=$('<tr><td>'+data[i]['configKey']+'</td><td>'+data[i]['feeAmount']+'</td></tr>');
						 var tr1=$('<tr><td>'+data[i]['configKey']+'</td><td>'+data[i]['feeAmount']+'</td></tr>');
							      	    
				       
						$('#displayTable').append(tr);
						$('#displayTable1').append(tr1);
					}
					
					
			},
			error:function(e)
			{
				console.log("Error in calling ajax "+e);
				toastr.error("Fee not set for this program ");
			}
		});
		
		
 }
 
 /* 
 To list the programs
*/

function getAllPrograms(program)
{

	$.ajax({
   		url:'/course/getAllCourses',
   		method:'GET',
   		async:false,
   		success:function(data)
   		{
   		    setUpDropDown("selectProgramEdit",data,"courseId","courseCode");
   		  
   		  
   			$('#selectProgramEdit').unbind().bind('change',function()
   			{
   				
   				getAllActiveBatchesOfProgram($(this).val());
   			 loadEvaluationypes($(this).val());
   			});
   		},
   		error:function(err)
   		{
   			showMessage(err);
   		}
   	});
}

/**
  To get all batches for the given programid
*/
 function getAllActiveBatchesOfProgram(programId)
 {
// $("#selectBatch").prop( "disabled", false );
	$.ajax(
	{
  		url:'/batch/getAllActiveBatchesInAProgram',
  	   	method:'GET',
  	   	data:{"courseId":programId},
  	   	async:false,
  	   	success:function(data)
  	   	{
  	   	
  	        setUpDropDown("selectBatchEdit",data,"batchId","batchCode");
  	 	    $('#selectBatchEdit').unbind().bind('change',function()
 	   			{
 	   				getAllActiveSemesterOfBatch($(this).val());
 	   			   
 	   			});
  	   		
  	   	},
  	   	error:function(err)
  	   	{
  	   		showMessage(err);
  	   	}
  	 });	  
  }
  
 function loadEvaluationypes(programId){
		$.ajax(
		{
			"url":MARKS_CONFIG_URL+programId,
			async:false,
			success:function(data)
			{
				types= data.data; 
				setUpDropDown("selectRevaluationTypeEdit",types,"id","evaluationType");
			}
		});
	
	}
  	   		
 
  /**
  To get all semesters the given batchid
  */
 function getAllActiveSemesterOfBatch(batchId)
 {
	//$("#selectSemester").prop( "disabled", false );
	  $.ajax({
				"url" : "/batch/getAllSemestersInABatch",
				"method" : "GET",
				data : {"batchId":batchId},
				async:false,
				success :function(data) {
				console.log(data);
				    try{
					   if(data && data.length >0){
						   $('#selectSemesterEdit').empty();
						   $('#selectSemesterEdit').append('<option>Select Semester</option>');
						   for(var i=0;i< data.length;i++){
						   	   $("#selectSemesterEdit").append('<option>'+data[i]['semesterIdentity']['semesterCode']+'</option>');
						   }
					 }
					}
					catch(e){
					    console.error(e);
					    showMessage(" Error occurred while processing semester list"); 
					}
												
				//	loadExamNames();
				},
				error :function(e) {
				     showMessage(err);
				}
			});
	}  
 
 function loadExamNames(){
	 
     var exam_type = $( "#selectExamTypeEdit option:selected" ).text();
     var program = $( "#selectProgramEdit option:selected" ).val();
	   var batch = $( "#selectBatchEdit option:selected" ).val();
	   var semester = $( "#selectSemesterEdit option:selected" ).val();
	  
	   
	 $.ajax({
  	   	   "url": BASE_URL+"schedule/type/list",
		   "type":"POST",
		    "data":{"program":program,"batch":batch,"semester":semester,"exam_type":exam_type},
  		success: function(data)
  		{
  		    var examDetails = data.data;
  		  	
  		   setUpDropDown("selectExamNameEdit",examDetails,"id","name_exam");
  		 
  		   
  		},
  		error:function(err)
  		{
  			showMessage(err);
  		}
  	});
	
	}
	
	function loadAcademicYear(academic_year){
		$.ajax(
		{
			//"url":"academics/api/v1/academics/getDetailsByMasterId/masterId/83",
			"url":ACADEMIC_YEAR_URL,
			success:function(data)
			{
				 
				setUpDropDown("selectAcademicYearEdit",data,"id","detailName");
				$("#selectAcademicYearEdit option:contains(" + academic_year +")").attr("selected", "selected");
			}
		});
	
	}
 
	 function loadExamTypes(examType){
			$.ajax(
			{
				"url":BASE_URL+"exam-management/exam-types",
				success:function(data)
				{
					types= data.data; 
					setUpDropDown("selectExamTypeEdit",types,"id","type");
					$("#selectExamTypeEdit option:contains(" + examType +")").attr("selected", "selected");
					loadExamNames();
				}
			});
		
		}
		
  
	 
	 
     
	  /**
	   * function to confirm for exam schedule
	   */
	    $('#formExamSchedule').unbind().bind('submit',function(event)
		{
					event.preventDefault();
				
				    var scheduleData = {};
				    scheduleData.id = activeScheduleId; 
			        scheduleData.scheduleId = $("#selectExamNameEdit option:selected" ).val(); 
			        scheduleData.evalType = $( "#selectRevaluationTypeEdit option:selected" ).val(); 
			        scheduleData.evalTypeName = $( "#selectRevaluationTypeEdit option:selected" ).text(); 
			        scheduleData.instructions = $( "textarea#instructions" ).val(); 
			        scheduleData.lastDateApply =  moment($("#tentativeDateEdit").val(),'DD-MM-YYYY').format('YYYY-MM-DD');
			        scheduleData.dateWithoutFine = moment($("#dateWithouFine").val(),'DD-MM-YYYY').format('YYYY-MM-DD');
			        scheduleData.dateWithFine = moment($("#dateFine").val(),'DD-MM-YYYY').format('YYYY-MM-DD');
			       
			        if (scheduleData.dateWithoutFine > scheduleData.dateWithFine) {
			        	toastr.error("Date of Payment with fine cannot be eariler   !!");
			        	return;
			        }
			        if ($("textarea#instructions").val().length == 0) {
			         	alert($("#instructions").val());
			        	toastr.error("Instructions cannot be empty   !!");
			        	return;
			        }
				        
				   
				    scheduleData.status = "IN ACTIVE";
			       scheduleData.approvalStatus = "MODIFIED";
			       scheduleData.feeSettings = String(selectedConfigArray);
			     	var scheduleFormDataJson = scheduleData;
					
	          var msg = {
						 title : "Exam Schedule",
						 msg : "Do you want to update this exam schedule?"
					}
			   ConfirmDialog(msg, "SAVE").then(function(response) {
								
						updateRevaluationSchedule(scheduleFormDataJson);
										
				}, function(error) {
						
					toastr.error("Exam Schedule updation cancelled !!");
						
				});
	      
	   });
	    
		
		function updateRevaluationSchedule(scheduleFormDataJson)
		{
			
	               				
				    $.ajax(
			   		{
			   			"url":BASE_URL+"revaluation/update-schedule",
			   			"method":"POST",
			   			 data:scheduleFormDataJson,
			   			success:function(data){
		   			
			   			 // showMessage("Schedule created Successfully");
			   			 toastr.success("Schedule updated Successfully");
			   			  
			   			  //reset  	
			   			  $("#formExamSchedule")[0].reset(); 
			   		      $("#editRevaluation").hide();
			   			
			   		
			   		$('#tblRevaluation').DataTable().ajax.reload();
				   			
			   			},
			   			
						error:function(err)
				   		{
				   			if (err.status == 409) {
	                             
	                             toastr.error("Schedule already exists for the given program, batch and semester !!");
	                            }
	                            else
				   			toastr.error("Saving Exam Schedule failed !!");
				   			 			
				   		}
			   		});	
		 }	
});
