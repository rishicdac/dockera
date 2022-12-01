$( document ).ready(function() {
  
  $('#collapseTimeTable').hide();
  $('#collapseEditSchedule').hide();
  $('#divSchedules').hide();
  $('#divViewSchedules').hide();
  $('#divApproval').hide();
 //  $( "#divApproval" ).detach();
 
  var scheduleDataTable;
  var scheduleId;
  
  $('#selectSemester').unbind().bind('change',function(){
	   
	   var program = $( "#selectProgram option:selected" ).val();
	   var batch = $( "#selectBatch option:selected" ).val();
	   var semester = $( "#selectSemester option:selected" ).val();
	   $('#divSchedules').show();
	   $('#divViewSchedules').hide();
	    $('#divApproval').hide();
	  scheduleDataTable =  $('#tblExamSchedule').DataTable({
            "language": {
                    "emptyTable": "No timetable  available for the selected exam name"
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
			{ "data": "month_year" },
		    {"data":"approval_status","render": function(data){if (data==null) return "----"; else return data; }},
		    
			/*{
				"data": null,
				"defaultContent":
					'<a data-toggle="collapse" href="#"  class=""small-box-footer text-danger" id="btnDetails"><i class="fas fa-eye"></i></a>'
			},*/
			
			{
				"data": null,
				"defaultContent":
					'<a data-toggle="collapse" href="#"  class=""small-box-footer text-danger" id="btnApprove"> <i class="fa fa-thumbs-up"></i></a>' 
					
			}
		]
		
		});
				

   
   $('#tblExamSchedule tbody').on('click', '#btnDetails', function () {
   
   
    $('#divViewSchedules').show();
    $('#divApproval').hide();
    
     $('html, body').animate({
		        scrollTop: $("#divViewSchedules").offset().top
		  }, 1000);
           
    var data = scheduleDataTable.row($(this).parents('tr')).data();
    
    bindViewSchedule(data);
    bindTimeTable(data.id);
    scheduleId = data.id;
    getFeeDetails(data.id,data.program);
   
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
		
	
	 $('#tblExamSchedule tbody').on('click', '#btnApprove', function () {
   
		  $('#divViewSchedules').show();
		  $('#divApproval').show();
     		  
     	 $('html, body').animate({
		        scrollTop: $("#divApproval").offset().top
		  }, 1000);
           
           
           
		 //  $('body').append($( "#divApproval" ));
		   var data = scheduleDataTable.row($(this).parents('tr')).data();
		    
		    bindViewSchedule(data);
		    bindTimeTable(data.id);
		    scheduleId = data.id;
		    getFeeDetails(data.id,data.program);
        var data = scheduleDataTable.row($(this).parents('tr')).data();
		     $.ajax({
				   type: "GET",
				   url:  BASE_URL+"time-table/approval/schedule-id/"+data.id,
				   headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				   },		   
				   success: function(result)
				   {
						$("#tblApproval tbody").remove();	
						//console.log(result.data);
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
	//console.log(data.pay_date);
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
						//console.log(result.data);
						if(result.data.length>0)	
						{				
							$.each(result.data, function (key, value) {
								
								//$("#tblTimetable").append($('<tbody><tr><td>' +  value.courseId+ '</td><td>' +value.courseName+ '</td><td>'+ moment(value.examDate).format('D/MM/YYYY')+ '</td><td>'+  moment(value.examDate).format('dddd')+ '</td><td>'+ moment(value.startDateTime, ["HH.mm"]).format("hh:mm A")+" - "+ moment(value.endDateTime, ["HH.mm"]).format("hh:mm A")+'</td></tr></tbody>'));
								$("#tblTimetable").append($('<tbody><tr><td>' +  value.courseId+ '</td><td>' +value.courseName+ '</td><td>'+ moment(value.examDate).format('D/MM/YYYY')+ '</td><td>'+  moment(value.examDate).format('dddd')+ '</td><td>'+ value.startDateTime+" - "+ value.endDateTime+'</td></tr></tbody>'));
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
	 submit approval list
	**/
    $("#formApproval").submit(function (event) {
         event.preventDefault();
         
          $.ajax({
			   type: "POST",
			   url:  BASE_URL+"time-table/approval",
			   data:{"id":scheduleId,"approvalType": $( "#selectApproveType option:selected" ).val(), "remarks":$("#remarks").val()},
			   success: function(result)
			   {
				 toastr.success("Approval details updated");
				// $( "#divApproval" ).detach();
				 $( "#divApproval" ).hide();
				  $( "#divViewSchedules" ).hide();
				 $('#tblExamSchedule').DataTable().ajax.reload();
				  $('html, body').animate({
		        scrollTop: $("#timetable").offset().top
		              }, 1000);
			   },
		   		error:function(err)
		   		{
		   		  toastr.error("Failed to update approval details");
		   		}
				 });
				 
         
         
       });
  

    
    /**
	* To get fee details for the given schedule id
	*/
	 function getFeeDetails(scheduleId,programId)
	 {
		 //console.log(scheduleId);
	   $.ajax({
		         url: BASE_URL+"schedule/fees/schedule-id/"+scheduleId,
		         async:false,
				 success: function(data)
		           {
		           //console.log(data);
					//console.log(data.data.configList);
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
					//console.log(data.length);
					$('#displayTable').empty();
				
						for(let i=0;i<data.length;i++)
						{
							 var tr=$('<tr><td>'+data[i]['configKey']+'</td><td>'+data[i]['feeAmount']+'</td></tr>');
						    
					       
							$('#displayTable').append(tr);
							
						}
						
						
				},
				error:function(e)
				{
					//console.log("Error in calling ajax "+e);
					toastr.error("Fee not set for this program ");
				}
			});
			
			
	 }
	 
  
});
