$( document ).ready(function() {
  
  $('#collapseTimeTable').hide();

 // $('#divSchedules').hide();
 // $('#divViewSchedules').hide();
 // $('#divApproval').hide();
 //  $( "#divApproval" ).detach();
 
  var scheduleDataTable;
  var scheduleId;
  
  $('#selectSemester').unbind().bind('change',function(){
	   
	   var program = $( "#selectProgram option:selected" ).val();
	   var batch = $( "#selectBatch option:selected" ).val();
	   var semester = $( "#selectSemester option:selected" ).val();
	   $('#divSchedules').show();
	   
	  scheduleDataTable =  $('#tblExamSchedule').DataTable({
            "language": {
                    "emptyTable": "No data available for the selected exam name"
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
		    {"data":"status"},
		    {"data":"approval_status"},
		    
			{
				"data": null,
				"defaultContent":
					'<a data-toggle="collapse" href="#"  class=""small-box-footer text-danger" id="btnDetails"><i class="fas fa-eye"></i></a>'
			},
			/*{
				"data": null,
				"defaultContent":
					'<a data-toggle="collapse" href="#"  class=""small-box-footer text-danger" id="btnEdit"> <i class="fas fa-edit"></i></a>' 
					 
			},*/
			{
				"data": null,
				"defaultContent":
					'<a data-toggle="collapse" href="#"  class=""small-box-footer text-danger" id="btnApprove"> <i class="fa fa-thumbs-up"></i></a>' 
					
			}
		]
		
		});
				

   
   $('#tblExamSchedule tbody').on('click', '#btnDetails', function () {
   
    $('#collapseTimeTable').show();
    $('#divViewSchedules').show();
    $('#divApproval').hide();
    
    var data = scheduleDataTable.row($(this).parents('tr')).data();
    	
    bindViewSchedule(data);
    bindTimeTable(data.id);
    scheduleId = data.id;
    
    var data = scheduleDataTable.row($(this).parents('tr')).data();
    getFeeDetails(data.id,data.program);
    
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
		

	
	 $('#tblExamSchedule tbody').on('click', '#btnApprove', function () {
   
		  $('#divApproval').show();
		
		 //  $('body').append($( "#divApproval" ));
		      $('#collapseTimeTable').show();
               $('#divViewSchedules').show();
      
               var data = scheduleDataTable.row($(this).parents('tr')).data();
           	
               bindViewSchedule(data);
               bindTimeTable(data.id);
               scheduleId = data.id;
               
               var data = scheduleDataTable.row($(this).parents('tr')).data();
               getFeeDetails(data.id,data.program);
               
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
              	
             $('html, body').animate({
 		        scrollTop: $("#divViewSchedules").offset().top
 		}, 1000);
 		
             
        var data = scheduleDataTable.row($(this).parents('tr')).data();
		     $.ajax({
				   type: "GET",
				   url:  BASE_URL+"schedule/approval/schedule-id/"+data.id,
				   headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				   },		   
				   success: function(result)
				   {
						$("#tblApproval tbody").remove();	
						console.log(result.data);
						scheduleId = data.id;
						if(result.data.length>0)	
						{				
							$.each(result.data, function (key, value) {
								
								$("#tblApproval").append($('<tbody><tr><td>' + value.approvalType + '</td><td>'+  moment(value.createdTime).format('D/MM/YYYY')+ '</td><td>' +value.createdBy+ '</td><td>' +value.remarks+ '</td></tr></tbody>'));
							});
						}else{
							$("#tblApproval").append($('<tbody><tr><td colspan="5" class="text-center">No Approval data available</td></tr></tbody>'));
						}
								
					 
					 
				   },
			   		error:function(err)
			   		{
			   		  toastr.error("Failed to load time table details");
			   		}
				 });
    
  
   	   });
	
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
	 Generate approval list 
	**/
    $("#formApproval").submit(function (event) {
         event.preventDefault();
         
         var msg = {
				 title : "Exam Schedule",
				 msg : "Do you want to make "+ $( "#selectApproveType option:selected" ).val() +" this exam schedule?"
			}
	   ConfirmDialog(msg, "APPROVE").then(function(response) {
						
		   approve();
								
		}, function(error) {
				
			toastr.error("Exam Schedule updation cancelled !!");
				
		});
         
         
        
         
         
       });
       
       
 function approve()
 {
	  $.ajax({
		   type: "POST",
		   url:  BASE_URL+"schedule/approval",
		   data:{"id":scheduleId,"approvalType": $( "#selectApproveType option:selected" ).val(), "remarks":$("#remarks").val()},
		   success: function(result)
		   {
			 toastr.success("Approval details updated");
			// $( "#divApproval" ).detach();
			 $( "#divApproval" ).hide();
			 $('#tblExamSchedule').DataTable().ajax.reload();
		   },
	   		error:function(err)
	   		{
	   		  toastr.error("Failed to update approval details");
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
		           console.log(data);
					console.log(data.data.configList);
					//bindFeeDetails(data.data.configList);
					selectedConfigArray = data.data.configList;
					bindFeeDetails(selectedConfigArray,programId);
		           }, 
		           function(error) {
					
				       toastr.error("Failed loading Fee details !!");
					
			        }
		           
		         });
	 
	 
	 }
	 
	 function bindFeeDetails(selectedConfigArray,programId)
	 {

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
  
});
