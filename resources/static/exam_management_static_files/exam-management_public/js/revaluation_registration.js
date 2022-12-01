$( document ).ready(function() {
  

  var scheduleDataTable;
  var scheduleId;
  var activeScheduleId;
  var selectedRevaluationScheduleId;
  var selectedSubjectsArray = []; 
  var selectedConfigArray=new Array();
  var selectedEvalType;
  
  var statusDataTable =  $('#tblRevaluationNotifications').DataTable({
	       "language": {
                    "emptyTable": "No Schedules  for Revaluation and Scrutiny found "
                  },
			"processing": true,
			"destroy": true,
			"ajax":BASE_URL+"revaluation/list/active/student-code/",
			"columns": [
				{"data":"academicYear"},
				{ "data": "null","render": function (data, type, full, meta) {
	                                          return (full.program + " / " + full.batch + " / " + full.semester)   
		                                }
				},
				{ "data": "examName" },
				{ "data": "examType" },
				{ "data": "evalTypeName"},
				{ "data": "lastDateApply","render": function(data){return moment(data).format('DD-MM-YYYY')}},
				{ "data": null , "render": function(data){
					return '<a data-toggle="collapse" href="#"  class=""small-box-footer text-danger" id="btnView"> <i class="fas fa-eye"></i></a>'
					
				}},
				{
					"data": null,
					 "render": function (data, type, full, meta) {
			               if(full.regId ==null) 
		                   return '<a data-toggle="collapse" href="#"  class=""small-box-footer text-danger" id="btnEdit"> <i class="fas fa-edit"></i></a>'
		                   else
		                	   return "<p  class='btn btn-xs btn-danger' >Registration Done</p>";
		                	   //return "Already Registered"; 
			            }  
				}
				
				/*{
					"data": null,
					"defaultContent":
						'<a data-toggle="collapse" href="#"  class=""small-box-footer text-danger" id="btnEdit"> <i class="fas fa-edit"></i></a>' 
				}*/
		]
		});
  
		  /*
		   *  Action function to apply for exam list 
		   */
		    $('#tblRevaluationNotifications tbody').on('click', '#btnEdit', function () {
		    	 
		      var data = statusDataTable.row($(this).parents('tr')).data();
		      $("#divViewSchedules").hide();
		      $("#registrationForm").show();
		     //   getFeeDetails(data.id);
		      selectedConfigArray = data.feeSettings;
		      selectedScheduleId = data.scheduleId;
		      selectedRevaluationScheduleId = data.id;
		      selectedProgramId = data.programId;
		      selectedExamName = data.examName;
		    
		      selectedExamType = data.examType;
		     selectedEvalType = data.evalTypeName;
		      $("textarea#divInstructions").val(data.instructions)
		      $("#requestHeader").text("Application for " + data.examName +" Exam  - "+data.evalTypeName)
		       selectedSubjectsArray = []; 
		      loadRegisteredSubjects(data);
		    //  loadScheduleDetails(data);
		  
			});
		    /*
			   *  Action function to apply for exam list 
			   */
			    $('#tblRevaluationNotifications tbody').on('click', '#btnView', function () {
			    	   
			    	  var data = statusDataTable.row($(this).parents('tr')).data();
			    			            
		               
		               $("#divViewSchedules").show();
		               $("#registrationForm").hide();
			 		   $("#applnType").text(data.evalTypeName+ "  Schedule");
			 		   $("#academicYear").text(data.academicYear);
			 		   $("#program").text(data.program);
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
			
			$('#tblRevaluationNotifications tbody').on( 'click', 'tr', function () {
		
		        if ( $(this).hasClass('selected') ) {
		            $(this).removeClass('selected');
		        }
		        else {
		        	statusDataTable.$('tr.selected').removeClass('selected');
		            $(this).addClass('selected');
		        }
		    } );
    
		

	
     /* to load registration form */
     function   loadRegisteredSubjects(data){
    	 $('#tblSelectedRegCourses').empty();
		 $('#tblRegCourses').empty();
		 let config = data.evalTypeName+"-Fee" ;
		 selectedSubjectsArray = []; 
		   
    	 $.ajax({
		      url: BASE_URL+"registration/subjects/"+data.scheduleId,
		      method: 'GET',
		      success: function(data)
		      {
		      	       data = data.data;
		           
		       if(data.length ==0)
	   		   {
	   		   toastr.error("No Course details found for this student!!");
	   		   
	   		   }
	   		   else{
	   			
				       for ( var i = 0; i < data.length; i++ ){
							var tr=$('<tr><td>'+data[i].courseName+ ' ( ' + data[i].courseId +' )</td><td><input  id="'+i+'" type="checkbox"  class="courses"  style:"margin-right: 20px"></td></tr>');
							$('#tblRegCourses').append(tr);
										
							}
						  $('.courses').unbind().bind('change',function()
							{
								var selectedId = $(this).attr('id') ;
								
									if(this.checked)
									{
										 selectedSubjectsArray.push({
										  "courseId": data[selectedId].courseId,
									      "courseName": data[selectedId].courseName,
									      "isElective": data[selectedId].isElective
										   });
									}
									else
									{
									  for( var i = 0; i < selectedSubjectsArray.length; i++){
										if ( selectedSubjectsArray[i].courseId === data[selectedId].courseId) { 
										 	selectedSubjectsArray.splice(i, 1);
											}
										}
									}
									displaySelectedCourses(selectedSubjectsArray);
									bindFeeDetails(config,selectedSubjectsArray.length);
																		
								});
							  
							   }
				
	   		    bindFeeDetails(config,selectedSubjectsArray.length);
	           },
		      error:function(err)
		      {
		    		toastr.error("Registered Subjects not found for this exam ");
		      }
		      });
		
	}
     
     
 	function displaySelectedCourses(data)
	{
	
		$('#tblSelectedRegCourses').empty();
		for(let i=0;i<data.length;i++)
		{
			var tr=$('<tr><td>'+ data[i].courseName+ ' ( ' + data[i].courseId +' )</td></tr>');
			$('#tblSelectedRegCourses').append(tr);
		}
		
		
	}
 	
 	
 	 function bindFeeDetails(config,numPapers)
	 {
		 console.log(config);
	 var total = 0 ;
	 $("#numPapers").text(numPapers);
	 $.ajax(
			{
				"url":"/fees/getManyFeeHeadAmountMap",
				"data":{"pgmId":selectedProgramId,"feeIdentifierList":String(selectedConfigArray)},
				success:function(data)
				{
					console.log(data.length);
					$('#displayTable').empty();
						for(let i=0;i<data.length;i++)
						{
							 var tr;
							if(data[i]['configKey'] != config){
								console.log("inside");console.log(data[i]['configKey']);
							  tr=$('<tr><td>'+data[i]['configKey']+'</td><td>---</td><td class="calculation" feeHeadId='+data[i]['feeHeadId']+'>'+data[i]['feeAmount']+'</td></tr>');
							 total = total + data[i]['feeAmount'];
							}
							else{
								tr=$('<tr><td>'+data[i]['configKey']+'</td><td>'+data[i]['feeAmount']+'( '+ numPapers+')'+'</td><td class="calculation" feeHeadId='+data[i]['feeHeadId']+' >'+data[i]['feeAmount']*numPapers+'</td></tr>');
								total = total + data[i]['feeAmount']*numPapers;
							}				      	    
					       
							$('#displayTable').append(tr);
						}
						
						var tr=$("<tr class='text-red'><td>Total</td><td></td><td feeHeadId='+data[]+'>"+total+"</td></tr>");
						$('#displayTable').append(tr);
				},
				error:function(e)
				{
					console.log("Error in calling ajax "+e);
					toastr.error("Fee not set for this program ");
				}
			});
			
			
	 }
	
 	 
 	 /**
 	   * function to confirm for exam registration
 	   */

 	   $("#submitReg").submit(function(e){
 		   e.preventDefault();
 		   if(selectedSubjectsArray.length == 0 )
 			  {
 			  
 			  toastr.error("Kindly select the courses!!!");
 			  return;
 			  }
 		   
 	          var msg = {
 						 title : "Registration",
 						 msg : "Do you want to register for exam?"
 					}
 			  ConfirmDialog(msg, "SAVE").then(function(response) {
 								
 						examRegistration();
 										
 				}, function(error) {
 						
 					toastr.error("Exam Registration cancelled !!");
 						
 				});
 	      
 	   });
 	   
 		 /**
 		 * Submit the registration 
 		 */
 		  function examRegistration()
 		  {
 				//To-DO actual data
 				var map={};
 				var formData = [];
 				var fullDetailArray=new Array();
 			    var timestamp = Number(new Date());
 				var orderId = selectedExamName+"-"+selectedEvalType; //"Exam-"+selectedExamName+"-"+ $("#usercode").val()+ "-"	+ timestamp;
 				$('.calculation').each(function()
 				{
 					/*	private String transactionIdentifierRemarkOrProcess;
 						private String transactionIdentifierProcessId;
 						private Double transactionAmount;
 						private String studentUserCode;*/
 					var map={}
 					map['transactionIdentifierRemarkOrProcess']=orderId;
 					map['transactionIdentifierProcessId']=$(this).attr('feeHeadId');
 					map['transactionAmount']=$(this).text();
 					//map['studentUserCode']=$(this).text();
 					fullDetailArray.push(map);
 				});
 			
 		
 				var data={
 						  "revaluationId":selectedRevaluationScheduleId,
 						  "scheduleId":selectedScheduleId,
 						  "orderId":orderId,
 						  "paymentDetails":fullDetailArray.join(", "),
 						  "status": "SUBMITTED",
 						  "approvalStatus": "Pending",
 						//  "studentId":$("#usercode").val(),
 						   "subjects": selectedSubjectsArray
 						}
 							
 				 $.ajax({
 			         url: BASE_URL +"revaluation/create",
 			         method:"POST",
 			         data: data,
 			         success: function(data)
 			         {
 						 console.log(data);
 						 $('#displayTable').empty();
 						 $('#tblSelectedRegCourses').empty();
 						 $('#tblRegCourses').empty();
 						 $( "#cbxDeclaration" ).prop( "checked", false );
 						 $("#registrationForm").hide();
 						 debitStudentFee(fullDetailArray);
 						 toastr.success("Successfully Registered. Kindly pay fees to process the registration!!");
 			           },
 			           error: function(err)
 			           {
 			        	   if (err.status == 409) {
 	                     
 	                           toastr.error("You have already applied for revaluation  for this exam !!");
 	                          }
 			        	    else
 			                  toastr.error("Exam registration failed !!");
 			           }
 			           
 			         });
 				
 	    }
 		 
 		 
 		 
 		function debitStudentFee(fullDetailArray)
 		{
 		
 	        
 		    $.ajax({
 		           type: "POST",
 		            url: "fees/generateFeeDebits-v2",
 		            data:{"transactionWrappers":fullDetailArray},
 						   
 		            success: function(data)
 		           {
 					
 					  toastr.success("Fee Debit generated");
 					
 		           },
 			       error: function(err)
 			           {
 			               toastr.error("Fee Debit failed !!");
 			           }
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
 					
 							for(let i=0;i<data.length;i++)
 							{
 								 var tr=$('<tr><td>'+data[i]['configKey']+'</td><td>'+data[i]['feeAmount']+'</td></tr>');
 								 var tr1=$('<tr><td>'+data[i]['configKey']+'</td><td>'+data[i]['feeAmount']+'</td></tr>');
 									      	    
 						       
 								$('#displayTable').append(tr);
 								
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
