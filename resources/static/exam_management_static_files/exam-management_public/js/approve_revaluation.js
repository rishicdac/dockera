$( document ).ready(function() {
  

  var scheduleDataTable;
  var scheduleId;
 
  
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
  
  /*
   * load revaluation details
   */ 
   $('#formRevaluation').submit(function (event) {
          event.preventDefault();
       
       var scheduleId = $( "#selectExamName option:selected" ).val();
   	   var evalType = $( "#selectRevaluationType option:selected" ).val();
    	var program = $( "#selectProgram option:selected" ).val();
   	 
   	   $.ajax({
      	   "url": BASE_URL+"revaluation/list/schedule-id/"+scheduleId+"/eval-type/"+evalType,
   		
   		    success: function(data)
   	   		{
   	   		    var examDetails = data.data;
   	   		 $("#divApproval").hide();
   	   	 $("#divViewSchedules").hide();
   	   	       if(examDetails != null){
   	   	    	   bindDetails(examDetails);
   	   	           bindFeeDetails(examDetails.feeSettings,program);
   	   	       }
   	   	       else{
   	   	    	   
   	   	    	toastr.error("Schedules not found for the exam and evaluation type");
   	   	       }
   	   		},
   	   		error:function(err)
   	   		{
   	   			showMessage(err);
   	   		}
          });
   	});
  
   /*
    * bind the schedule and revaluation details
    */   
   function bindDetails(data)
   {
	   
	   $("#divViewSchedules").show();
	   $("#applnType").text($( "#selectRevaluationType option:selected" ).text()+ "  Schedule");
	   
	   $("#academicYear").text(data.academicYear);
	   $("#program").text(data.programName);
	   $("#batch_sem").text(data.batch + " - "+data.semester);
	   $("#exam_type").text(data.examName);
	   
	   $("#exam_name").text(data.examName);
	 
	   $("#tentative_date").text( moment(data.lastDateApply).format('D/MM/YYYY'));
	   $("#date_without_fine").text( moment(data.dateWithoutFine).format('D/MM/YYYY'));
	   $("#date_with_fine").text( moment(data.dateWithFine).format('D/MM/YYYY'));
	   $("#instructions").text(data.instructions);
	   scheduleId = data.id;
	   approveRevaluation(data.id)
	   
   }

   
 function approveRevaluation(id){  
   $.ajax({
	   type: "GET",
	   url:  BASE_URL+"revaluation/approval/schedule-id/"+id,
	   headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	   },		   
	   success: function(result)
	   {
		   $("#divApproval").show();
			$("#tblApproval tbody").remove();	
		
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
 }
 
 /**
 Generate approval list 
**/
$("#formApproval").submit(function (event) {
     event.preventDefault();
     
     var msg = {
			 title : "Exam Schedule",
			 msg : "Do you want to approve this exam schedule?"
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
	   url:  BASE_URL+"revaluation/approval",
	   data:{"id":scheduleId,"approvalType": $( "#selectApproveType option:selected" ).val(), "remarks":$("#remarks").val()},
	   success: function(result)
	   {
		 toastr.success("Approval details updated");
		// $( "#divApproval" ).detach();
		 $( "#divApproval" ).hide();
		 $("#divViewSchedules").hide();
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
