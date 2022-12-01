$(document).ready(function() {


    
    /* 
      To list all scheduled exams
	*/
	
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
	   $('#formRevaluationList').submit(function (event) {
	       
		   event.preventDefault();
	       
	       var scheduleId = $( "#selectExamName option:selected" ).val();
	   	   var evalType = $( "#selectRevaluationType option:selected" ).val();
	   	   var url = BASE_URL+"revaluation/students-list/schedule/"+scheduleId+"/eval-type/"+evalType;
	   

	   	  datawithPayment =  loadData(url);
	   	loadRegistrationDetails(datawithPayment);
	      
	   	});
		   
		   
	 

	 
	 function loadRegistrationDetails(datawithPayment){
	  
		 $("#divRegistrations").show();
	    

	 	examDataTable =  $('#tblExamRegistrations').DataTable({
            "language": {
                    "emptyTable": "No Student Registered  for selected exam name and evaluation type"
                  },
			"processing": true,
			"destroy": true,
			"data":datawithPayment,
			"columns": [
		
			{ "data": "studentId" },
			{"data": "feeOrderStatusValue"}, // Payment status
		/*    {"data": "approvalStatus"},*/
			{
				"data": null,
				"defaultContent":
					
					'<a data-toggle="collapse" href="#"  class=""small-box-footer text-danger" id="btnView"> <i class="fas fa-eye"></i></a>' 
					
			}
		]
		});
	
	 	
	 	$('#tblExamRegistrations tbody').on( 'click', 'tr', function () {
	 		
	        if ( $(this).hasClass('selected') ) {
	            $(this).removeClass('selected');
	        }
	        else {
	        	examDataTable.$('tr.selected').removeClass('selected');
	            $(this).addClass('selected');
	        }
	    } );
		
	 	
	 	
	}	
	 $('#tblExamRegistrations tbody').on('click', '#btnView', function () {
		 
		 		 
		  var scheduleData = examDataTable.row($(this).parents('tr')).data();
		 
		  $("#registrationForm").show();
		  bindProgramDetails(scheduleData.studentId);
		  bindRegisteredSubjects(scheduleData.scheduleId,scheduleData.id)
	     
		  // $("#registrationForm").show();
		  $('html, body').animate({
				        scrollTop: $("#registrationForm").offset().top
				}, 1000);
		  
		  
		  
		 });
	
		 


	
	 

    function bindRegisteredSubjects(scheduleId,regId)
	{

    	
    	  
        $.ajax({
	   		url: BASE_URL+"registration/schedule/"+scheduleId+"/reval-reg-id/"+regId,
	   		method: 'GET',
	   		
	   		success: function(data)
	   		{
	   		 
	   		 var data = data.data; 
	   		 //console.log(courses);
	   		   $("#numPapers").text(data.length);
		   		$('#tblSelectedRegCourses').empty();
				for(let i=0;i<data.length;i++)
				{
					var tr=$('<tr><td>'+ data[i].courseName+ ' ( ' + data[i].courseId +' )</td></tr>');
					$('#tblSelectedRegCourses').append(tr);
				}
			
				
               
              },
	   		error:function(err)
	   		{
	   			//showMessage(err);
	   			toastr.error("Failed to load registered subjects");
	   		}
	   	});
	   	
	   }		
	   
	   
	  function bindProgramDetails(studentId)
	 {

        $.ajax({
	   		url: "students/getStudentsDetails-V3",
	   		method: 'GET',
	   		data:{"userCodes":studentId},
	   		async:false,
	   		success: function(data)
	   		{
	   		  studentData = data[studentId];
	   		  var gender= null;
              if (studentData.studentPersonalGender =='m')
            	  gender = "Male";
              else
            	  gender = "Female";
            		  
			   		/*  Program , batch , semester , divison    */
	   		     $("#nameGender").text( studentData.studentName+" - "+gender);
	   		 
	   		     $("#regNo").text(studentData.rollNo);
				 $("#program").text(studentData.programName);
				 $("#batch").text(studentData.batchName);
				 $("#semester").text(studentData.semester);
				 $("#division").text(studentData.division ? studentData.Division : "---");
               
              },
	   		error:function(err)
	   		{
	   			showMessage(err);
	   		}
	   	});
	   	
	   }	
	   
	   $("#approveReg").click(function(){
          // alert("The paragraph was clicked."+examId);
             
		   
		   var msg = {
					 title : "Exam Registration",
					 msg : "Do you want to Approve this application ?"
				}
		  ConfirmDialog(msg, "APPROVE").then(function(response) {
							
			  approveReg();
									
			}, function(error) {
					
				toastr.error("Approving is  cancelled !!");
					
			});
		   
	   });
	   
	   function approveReg(){
          $.ajax({
			   type: "POST",
			   url:  BASE_URL+"registration/approval",
			   data:{"id":examRegId,"approvalType": "Approved", "remarks":"Approved"},
			   success: function(result)
			   {
				 toastr.success("Approval details updated");
				// $( "#divApproval" ).detach();
				 $( "#divApproval" ).hide();
				 $( "#docView" ).hide();
				 //$('#tblExamRegistrations').DataTable().ajax.reload();
				 loadRegistration(scheduleId);
				   // $("#registrationForm").hide();
			   },
		   		error:function(err)
		   		{
		   		  toastr.error("Failed to update approval details");
		   		}
			 });
				 
				 
         }
	


	   
	   
	 
});