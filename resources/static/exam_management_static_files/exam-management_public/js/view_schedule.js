$( document ).ready(function() {
  
  $('#collapseTimeTable').hide();
  $('#collapseEditSchedule').hide();
  $('#divSchedules').hide();
  $('#divViewSchedules').hide();
  $('#divApproval').hide();
 //  $( "#divApproval" ).detach();
 
  var scheduleDataTable;
  var scheduleId;
  var selectedProgramId;
  

  /* **************************************************************************/
	/* exam fee settings  by rishi*/
	/* ****************************************************************************/
	
	var feeConfigMap={};// in case nuals need dynamic addition of fee config, we can set the values from an //api
//	var selectedConfigArray = new Array();
//	selectedConfigArray ="Exam-fee,Testing-Fee";
	////var pgmId=200;// set this from ur code
	//var examScheduleId="abc";//set this from ur code
	
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
				
					if($('#selectProgram').val() =="" ){
						
						toastr.error("Kindly select program!!");
						$(this).prop('checked', false);
									
					}
					else{
						if(this.checked)
						{
							addToArray(configKey);
						}
						else
						{
							removeFromArray(configKey);
						}
						getAmountDetails(configKey);
					}
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
	
	function getAmountDetails(configKey)
	{
		//alert("inside amount"+selectedConfigArray);
		if(selectedConfigArray.length>0 && $('#selectProgram').val() != "" )
		{
			$.ajax(
			{
				"url":"/fees/getManyFeeHeadAmountMap",
				"data":{"pgmId":$('#selectProgram').val(),"feeIdentifierList":String(selectedConfigArray)},
				success:function(data)
				{
					
					var feeHeads = data.length;
					var configArray = selectedConfigArray.length;
										
					if(data.length == 0  || configArray != feeHeads ){
						toastr.error("No fee set for this program!!");
						 $('#'+configKey).prop('checked', false);
					     removeFromArray(configKey);
					}
					//else if( configArray != feeHeads )
						//toastr.error("No fee set for this program!!");
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
			
			$('#displayTable').empty();
		}	
	}
	
  $('#selectSemester').unbind().bind('change',function(){
	   
	   var program = $( "#selectProgram option:selected" ).val();
	   var batch = $( "#selectBatch option:selected" ).val();
	   var semester = $( "#selectSemester option:selected" ).val();
	   $('#divSchedules').show();
	   $('#collapseEditSchedule').hide();
	  scheduleDataTable =  $('#tblExamSchedule').DataTable({
            "language": {
                    "emptyTable": "No data available for the selected program / batch / semester"
                  },
			"processing": true,
			"destroy": true,
			"ajax":{ 
			    "url": BASE_URL+"schedule/list",
			    "type":"POST",
			     "data":{"program":program,"batch":batch,"semester":semester},
			    },
			"columns": [
			
			{ "data": "academic_year" },
			{ "data": "name_exam"},
			{ "data": "month_year" },//,"render": $.fn.dataTable.render.moment('Do MMM YY' )
		//	{ "data": "tentative_date"},
		  /*  {"data":"status"},*/
		    {"data":"approval_status"},
		    
			{
				"data": null,
				"defaultContent":
					'<a data-toggle="collapse" href="#"  class=""small-box-footer text-danger" id="btnDetails"><i class="fas fa-eye"></i></a>'
			},
			{
				"data": null,
				"defaultContent":
					'<a data-toggle="collapse" href="#"  class=""small-box-footer text-danger" id="btnEdit"> <i class="fas fa-edit"></i></a>' 
					 
			},
			/*{
				"data": null,
				"defaultContent":
					'<a data-toggle="collapse" href="#"  class=""small-box-footer text-danger" id="btnApprove"> <i class="fa fa-thumbs-up"></i></a>' 
					
			}*/
		]
		
		});
				

   
   $('#tblExamSchedule tbody').on('click', '#btnDetails', function () {
   
    $('#collapseTimeTable').show();
    $('#collapseEditSchedule').hide();
    $('#divViewSchedules').show();
    $('#divApproval').hide();
    
    var data = scheduleDataTable.row($(this).parents('tr')).data();
    	
    bindViewSchedule(data);
    bindTimeTable(data.id);
    getFeeDetails(data.id,data.program);
    scheduleId = data.id;
    selectedProgramId = data.program;
    var data = scheduleDataTable.row($(this).parents('tr')).data();
   	var timetableDataTable =  $('#tblExamTimetable').DataTable({
            "language": {
                    "emptyTable": "No data available for the selected exam name"
                  },
			"processing": true,
			"destroy": true,
			"ajax": BASE_URL+"time-table/list-schedule-id/"+data.id,
			"columns": [
			{ "data": "courseId" },
			{ "data": "courseName"},
			{ "data": "examDate" },//,"render": $.fn.dataTable.render.moment('Do MMM YY' )
			{ "data": "startDateTime" },
			{ "data": "endDateTime"}
		]
		});
	});
		
	
   $('#tblExamSchedule tbody').on('click', '#btnEdit', function () {
   
   
    $('#collapseTimeTable').hide();
    $('#divViewSchedules').hide();
    $('#collapseEditSchedule').show();  
   
     var data = scheduleDataTable.row($(this).parents('tr')).data();
 	console.log(data);  
 	
 	loadExamTypes(data.exam_type);
 	loadAcademicYear(data.academic_year);
 	getAllPrograms(data.program);
 	scheduleId = data.id;
 	getFeeDetails(data.id,data.program);
 	
 	
 	$('html, body').animate({
        scrollTop: $("#collapseEditSchedule").offset().top
  }, 1000);
 	
 	
 	

 

	$("#selectProgramEdit").val(data.program).trigger("change");
	$("#selectBatchEdit").val(data.batch).trigger("change");
 	$("#selectBatchEdit").val(data.batch).trigger("change");
 	$("#selectSemesterEdit").val(data.semester).trigger("change");
 	
 	$("#nameExam").val(data.name_exam);
	$("#monthYear").val(data.month_year);
	$("#tentativeDate").val( moment(data.tentative_date).format('DD-MM-YYYY'));
	$("#pay_without_fine").val( moment(data.pay_date).format('DD-MM-YYYY'));
	$("#pay_date_fine").val( moment(data.pay_date_fine).format('DD-MM-YYYY'));
	$("textarea#instructions").val(data.instructions);
	   
	//$("#selectExamTypeEdit option:contains(" +data.examType +")").attr("selected", "selected");
	//$("#selectExamTypeEdit").val(data.exam_type).trigger("change");
 
	});
		
		
	
	
	 
	 $('#tblExamSchedule tbody').on( 'click', 'tr', function () {
			
	        if ( $(this).hasClass('selected') ) {
	            $(this).removeClass('selected');
	        }
	        else {
	        	scheduleDataTable.$('tr.selected').removeClass('selected');
	            $(this).addClass('selected');
	        }
	    } );
	 
	
	});		
	/**
	   Bind the schedule details
	*/	
	function bindViewSchedule(data)
	{
	console.log(data.pay_date);
	   $("#academicYear").text(data.academic_year);
	   $("#program").text(data.programName);
	   $("#batch_sem").text(data.batchName + " - "+data.semester);
	   $("#exam_type").text(data.exam_type);
	   
	   $("#exam_name").text(data.name_exam);
	   $("#month_year").text(data.month_year);
	   $("#tentative_date").text( moment(data.tentative_date).format('D/MM/YYYY'));
	   $("#date_without_fine").text( moment(data.pay_date).format('D/MM/YYYY'));
	   $("#date_with_fine").text( moment(data.pay_date_fine).format('D/MM/YYYY'));
	   $("#instructions").text(data.instructions);
	
	
	}

	/**
	   Bind the Time table details
	*/	
	function bindTimeTable(scheduleId)
	{
	     $.ajax({
				   type: "GET",
				   url:  BASE_URL+"time-table/list-schedule-id/"+scheduleId,
				   headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				   },		   
				   success: function(result)
				   {
						$("#tblTimetable tbody").remove();	
						console.log(result.data);
						if(result.data.length>0)	
						{				
							$.each(result.data, function (key, value) {
								
								$("#tblTimetable").append($('<tbody><tr><td>' +  moment(value.examDate).format('D/MM/YYYY')+ '</td><td>'+  moment(value.examDate).format('dddd')+ '</td><td>' +value.courseId+ '</td><td>' +value.courseName+ '</td><td>'+  value.startDateTime +' - '+ value.endDateTime+'</td></tr></tbody>'));
							});
						}else{
							$("#tblTimetable").append($('<tbody><tr><td colspan="5" class="text-center">No data available</td></tr></tbody>'));
						}
								
					 
					 
				   },
			   		error:function(err)
			   		{
			   		  toastr.error("Failed to load time table details");
			   		}
				 });
	
	}
	
	
	
	
 
       
  /**
   * function to confirm for exam schedule
   */
    $('#formExamSchedule').unbind().bind('submit',function(event)
	{
				event.preventDefault();
				
			
		        var scheduleData = $(this).serializeObject();
		        scheduleData.id = scheduleId;
		        scheduleData.tentative_date =  moment($("#tentativeDate").val(),'DD-MM-YYYY').format('YYYY-MM-DD');
		        scheduleData.pay_date = moment($("#pay_without_fine").val(),'DD-MM-YYYY').format('YYYY-MM-DD');
		        scheduleData.pay_date_fine = moment($("#pay_date_fine").val(),'DD-MM-YYYY').format('YYYY-MM-DD');
		        scheduleData.academic_year = $( "#selectAcademicYearEdit option:selected" ).text();
		        scheduleData.programName = $( "#selectProgramEdit option:selected" ).text();
		        scheduleData.program = $( "#selectProgramEdit" ).val();
		        scheduleData.batch = $( "#selectBatchEdit" ).val();
		        scheduleData.exam_type = $( "#selectExamTypeEdit option:selected" ).text();
			    scheduleData.batchName = $( "#selectBatchEdit option:selected" ).text();
			    scheduleData.semester = $( "#selectSemesterEdit option:selected" ).text();
			    scheduleData.status = "IN ACTIVE";
			    scheduleData.approval_status = "MODIFIED";
		        
		     /*	var scheduleFormDataJson = JSON.stringify(scheduleData);
		     	
		     //   console.log(scheduleFormDataJson);
		        
				//var file = $('#instructionsFile')[0].files[0];	
				var file = null;	
				let formData = new FormData();
				formData.append('file',file);
				formData.append('ExamSchedule',scheduleFormDataJson);
				*/
				
          var msg = {
					 title : "Exam Schedule",
					 msg : "Do you want to update this exam schedule?"
				}
		   ConfirmDialog(msg, "SAVE").then(function(response) {
							
					updateExamSchedule(scheduleData);
									
			}, function(error) {
					
				toastr.error("Exam Schedule updation cancelled !!");
					
			});
      
   });
   
   function updateExamSchedule(scheduleFormDataJson)
	{
               				
			    $.ajax(
		   		{
		   			url:BASE_URL+"schedule/update",
		   			method:"POST",
		   		    data:scheduleFormDataJson,
		   			success:function(data){
	   			
		   		  	   toastr.success("Schedule updatetd Successfully");
		   			   $("#collapseEditSchedule").hide();
		   			   //reset  	
		   			   $("#formExamSchedule")[0].reset(); 
		   			   $('#tblExamSchedule').DataTable().ajax.reload();
		   					   			
		   			},
			   		error:function(err)
			   		{
			   			toastr.error("Saving Exam Schedule failed !!");
			   			 			
			   		}
		   		});	
	 }	
		
  

   
   /**
	* To get fee details for the given schedule id
	*/
	 function getFeeDetails(scheduleId,programId)
	 {
		 console.log(scheduleId);
	   $.ajax({
		         url: BASE_URL+"schedule/fees/schedule-id/"+scheduleId,
		         async:false,
				 success: function(data)
		           {
		    		
					var config= data.data.configList;
					selectedConfigArray = config.split(",");
					bindFeeDetails(config,programId);
		           }, 
		           function(error) {
					
				       toastr.error("Failed loading Fee details !!");
					
			        }
		           
		         });
	 
	 
	 }
	 
	 function bindFeeDetails(config,programId)
	 {

	 $.ajax(
			{
				"url":"/fees/getManyFeeHeadAmountMap",
				"data":{"pgmId":programId,"feeIdentifierList":String(config)},
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
													
						
					},
					error :function(e) {
					     showMessage(err);
					}
				});
		}  
	 
	 function loadExamTypes(examType){
			$.ajax(
			{
				"url":BASE_URL+"exam-management/exam-types",
				async:false,
				success:function(data)
				{
					types= data.data; 
					setUpDropDown("selectExamTypeEdit",types,"id","type");
					$("#selectExamTypeEdit option:contains(" + examType +")").attr("selected", "selected");
					//$("#selectExamTypeEdit").val(examType).trigger("change");
				}
			});
		
		}
		
		function loadAcademicYear(academic_year){
			$.ajax(
			{
			//	"url":"academics/api/v1/academics/getDetailsByMasterId/masterId/83",
				"url":ACADEMIC_YEAR_URL,
				
				success:function(data)
				{
					 
					setUpDropDown("selectAcademicYearEdit",data,"id","detailName");
					$("#selectAcademicYearEdit option:contains(" + academic_year +")").attr("selected", "selected");
				}
			});
		
		}
	 
});
