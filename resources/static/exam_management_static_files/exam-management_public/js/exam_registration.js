$(document).ready(function() {
 
    var studentData = {};
    var loggedStudentId = $("#usercode").val();
    var courses;
    var selectedScheduleId;
    var selectedProgramId;
    var selectedExamName;
    var selectedConfigArray=new Array();
    var examFeeArray= {};
    var selectedCoursedArray = new Array();
    var selectedSubjectsArray = []; 
 

     
     
   /**
    *  Get the logged in student details
    **/
        $.ajax({
	   		url: "students/getStudentsDetails-V3",
	   		method: 'GET',
	   		data:{"userCodes":loggedStudentId},
	   		
	   		success: function(data)
	   		{
	   		
	   		 studentData = data[loggedStudentId];
	   		  console.log(studentData);
	   		  
	   		  loadExamNotifications(studentData);
               
              },
	   		error:function(err)
	   		{
	   			//showMessage(err);
	   			toastr.error("Error in getting student information !!");
	   		}
	   	});
	   	
	  
	
	 
	/**
    *  list active exam schedules
    **/
         
   function loadExamNotifications(studentData)
   {	
      var examNotificationsDataTable =  $('#tblExamNotifications').DataTable({
            "language": {
                    "emptyTable": "No Active exam schedules"
                  },
			"processing": true,
			"destroy": true,
			"ajax":{ 
			  	"url": BASE_URL+"schedule/active-list/student/program/"+studentData.programCode+'/'+studentData.batchCode,// TO-DO set correct
	   	  	  
			   "dataSrc":function (data) {
			      console.log(data.data);
			       if(data.data == null){
			         data.data = [];
			         }
			        return data.data; 
			     }  
			  
			    },
			"columns": [
			/*
		    { "data": "id"},
		    
			{"data":"program"},
			{"data":"batch"},*/
			{ "data": "academic_year"},
			{ "data": "null",
			            "render": function (data, type, full, meta) {
		                
		                    return (full.programName + " / " + full.batchName + " / " + full.semester)   
			            }
		      },
			{ "data": "name_exam" },
			{ "data": "exam_type" },
			{ "data": "month_year" },
			{ "data": "pay_date" , "render": function(data){return moment(data).format('D/MM/YYYY')}},
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
			]
	
		});
   
    
	   /*
	   *  Action function to apply for exam list 
	   */
	    $('#tblExamNotifications tbody').on('click', '#btnEdit', function () {
	    
	    	  $('#divViewSchedules').hide();
	    	  $('#registrationForm').show();
	      var data = examNotificationsDataTable.row($(this).parents('tr')).data();
	    //  getFeeDetails(data.id); 
	    
	      selectedScheduleId = data.id;
	      selectedProgramId = data.program;
	      selectedExamName = data.name_exam;
	      selectedExamType = data.exam_type;
	      getviewFeeDetails(data.id);
	      getFeeDetails(data.id,data.program);
	      var condonationData = {"programId":data.program,"batchId":data.batch,"semester":data.semester,"studentId": studentData.studentCode}
	      
	      //if ( checkAlreadyRegistered)
          checkCondonationList(condonationData);
	      
          loadScheduleDetails(data);
	  
		});
		
	    /*
		   *  Action function to apply for exam list 
		   */
		    $('#tblExamNotifications tbody').on('click', '#btnView', function () {
		    	   
		    	  var data = examNotificationsDataTable.row($(this).parents('tr')).data();
		    	  $('#divViewSchedules').show();
		    	  $('#registrationForm').hide();
		    	  scheduleId = data.id;
		    	    selectedProgramId = data.program;
		    	    bindViewSchedule(data);
		    	    bindTimeTable(data.id);
		    	    getFeeDetails(data.id,data.program);
		    	    getviewFeeDetails(data.id);
		    	   
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
		    	   	
			});
		    
		$('#tblExamNotifications tbody').on( 'click', 'tr', function () {
	
	        if ( $(this).hasClass('selected') ) {
	            $(this).removeClass('selected');
	        }
	        else {
	            examNotificationsDataTable.$('tr.selected').removeClass('selected');
	            $(this).addClass('selected');
	        }
	    } );
	    
	}
	
	/*
	* Check whether the student code is in condonation List
	*/
	function  checkCondonationList(condonationData)
	{
	
	   $.ajax({
	   		url: BASE_URL+"condonation/check",
	   		method:"POST",
	   		data:condonationData,
	   		success: function(data)
	   		{
	   		   console.log(data.data);
	   		   data = data.data;
	   		   if( (data == null) || (data.exempted == true)) // TO-DO  Remove null option  
	   		   {
	   		  //    $("#divExamSchedules").hide();
	   		  
	   		       showRegistrationMenu();
	   		   }
	   		   else {
	   		           console.log(checkCondonationFeePaid(data.orderId,data.studentId));
	   		        if(checkCondonationFeePaid(data.orderId,data.studentId) == true)
	   		        {
	   		          //To-DO
	   		          showRegistrationMenu();
	   		        }
	   		        else{
	   		          //showMessage("Your name is in condonation list . so , your are  not eligibile to apply registration !! . Kindly pay condonation fee" );
	   		        	
			   		         var msg = { title : "Condonation List",msg : "Your name is listed in condonation. Kindly pay fine or request for exemption to proceed registration !!!"}
			   			  ConfirmDialog(msg, "").then(function(response) {
			   								
			   				toastr.error("You are not allowed to register for examination !!");
			   										
			   				}, function(error) {
			   						
			   					toastr.error("You are not allowed to register for examination !!");
			   						
			   				});
	   		        	//toastr.error("Your name is in condonation list . so , your are  not eligibile to apply registration !!." );
	   		        	}
	   		   
	   		   }
	   		   
	   		  
	   		  	   			
	   		},
	   		error:function(err)
	   		{
	   			showMessage(err);
	   		}
	   	});	  
          
	}
	
	/**
	* To check whether the student paid condonation fee
	*/
	function checkCondonationFeePaid(orderId,studentId)
	{
	    var status = true; //To-DO need to return correct value
		  $.ajax({
		         url: "/fees/getFeeOrderStatusByFeeIdentifierAndAccount",
		         data:{"feeIdentifier":orderId , "studentCode": studentId },
		         async:false,
				 success: function(data)
		           {
					 console.log(data);
					 if(data.feeOrderStatusValue == 'settled')
					    status = true ;
					 else
					    status = false;
					   
					return status;
		           },
		          failure:function(data)
		          {
		        	
		        	  toastr.error("Error in getting fee details!!");
		        	
		        	  
		          }
		         
		         });
        return status;
	}
	
	
	/**
	* To show registration menu if no issue in condonation
	*/
	function showRegistrationMenu()
	{
	     $("#registrationForm").show(); 
	     	$('html, body').animate({
		        		scrollTop: $("#registrationForm").offset().top
		  			}, 1000);
	}
	
	
	/**
	* To load schedule details
	*/
	 function loadScheduleDetails(data)
	 {
	  loadLoggedInStudentDetails();
	  $("#divInstructions").text(data.instructions);
	  $("#examName").text(" Application for registration of - "+ data.name_exam);
	    bindExamCourses(data);
	 
	    
	 
	 
	 }
	 
	 /**
	* To get fee details for the given schedule id
	*/
	 function getviewFeeDetails(scheduleId)
	 {
		 console.log(scheduleId);
	   $.ajax({
		         url: BASE_URL+"schedule/fees/schedule-id/"+scheduleId,
		         async:false,
				 success: function(data)
		           {
		           console.log(data);
					console.log(data.data.configList);
					selectedConfigArray = data.data.configList;
					 bindViewFeeDetails(data.data.configList);
					
					
		           }, 
		           function(error) {
					
				       toastr.error("Failed loading Fee details !!");
					
			        }
		           
		         });
	 
	 
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
	* To load loggedin student details
	*/
	 function loadLoggedInStudentDetails()
	 {
	    
	      $.ajax({
		         url: "students/getStudentDetails",
		         data:{"studentAdmissionUserCode":loggedStudentId },
				 success: function(data)
		           {
					 console.log(data);
					 bindStudentData(data);
					
		           },
		           error:function(e)
					{
						console.log("Error in calling ajax "+e);
						toastr.error("Error in getting student admission details ");
					}
		         });
	 }
	 
	 /**
	  * Bind student data in registration form
	  */
	  function bindStudentData(data)
	  {
	      /*  name and gender  */ 
	 	  var gender = "Female"; 
		  if (data.sp.studentPersonalGender == 'm')
		     gender = "Male";
		  else
		      gender = data.sp.studentPersonalGender;
		  $('#nameGender').html(data.sp.studentPersonalStudentName +"   ( "+gender+" )" );
		  
		  /* Dob and Age */
		  var dobDate = moment(data.sp.studentPersonalDob).format('DD-MM-YYYY');
		  var dob = new Date(data.sp.studentPersonalDob);
		  var today = new Date();
		  var age = Math.floor((today-dob) / (365.25 * 24 * 60 * 60 * 1000));
		  $('#dobAge').html(dobDate +" ( "+ age +" Years) ");
		  
		  
		  /*  Reg , code , roll numbers  */
		  $("#regStudentcodeRollno").text(data.sa.studentRegNo + " / "+ data.sp.studentCode +" / "+ data.sa.studentAdmissionRollNo );
		  
		  /*  Program , batch , semester , divison    */
		 
		 $("#program").text(studentData.programName);
		 $("#batch").text(studentData.batchName);
		 $("#semester").text(studentData.semester);
		 $("#division").text(studentData.division ? studentData.Division : "---");
		 
		 /* mother tongue , religion ,community */
	     $("#motherTongue").text(data.sp.studentPersonalMotherTounge);
	     $("#religion").text(data.sp.studentPersonalMappedReligion.religionName ? data.sp.studentPersonalMappedReligion.religionName : null);
	     
	     $("#community").text(data.sp.studentPersonalMappedCommunity != null ? data.sp.studentPersonalMappedCommunity.religionCommunityName : "---");
	     
	     /* adresses */
	     $("#permanentAddress").text(data.sp.studentPersonalPermanentAddress);
	     $("#communicationAddress").text(data.sp.studentPersonalCommunicationAddress);
	     
	     /* image */
	     var imagePath = "filerepo_public/minioFiles/nuals/"+studentData.programCode+"/"+studentData.batchCode+"/"+studentData.studentCode+"/studentImage.jpg";
	     $("#studentImage").attr("src",imagePath);
	   
	    
	 }
	 
	 /**
	 * bind courses of the selected exam 
	 */
	 function bindExamCourses(selectedExam)
	 {

	  var program = selectedExam.program; 
      var batch = selectedExam.batch;
      var semester = selectedExam.semester;
       courses = null;
      $("#electiveCourse").empty();
      $("#regularCourse").empty();
      $("#tblSupplementary").empty();
      selectedSubjectsArr = []; 
      let config = selectedExam.exam_type+"-Exam-Fee" ;
   
     
      $.ajax({
	   		url: "/academic/getStudentsCoreAndElectiveCoursesV1",
	   		data:{"program":program,"batch":batch,"sem":semester,"userCode":loggedStudentId},
	   		success: function(data)
	   		{
	   		   courses = data; 
	   		   $("#totalPapers").text(data.length);
	   		   console.log(selectedExam.exam_type);
	   		   if(data.length ==0)
	   		   {
	   		   toastr.error("No Course details found for this student!!");
	   		   
	   		   }
	   		   else{
	   		   
	   		       if(selectedExam.exam_type =="Regular"){
	   		           $("#divRegular").show();
	   		           $("#divSupplementary").hide();
					   for ( var i = 0; i < data.length; i++ ) {
							  
						     if(data[i].elective == 'Y')  $("#electiveCourse").append('<li>'+ data[i].course_name + ' ( ' + data[i].course_code +' ) </a></li>');
						     else if(data[i].elective == 'N') $("#regularCourse").append('<li>'+ data[i].course_name + ' ( ' + data[i].course_code +' ) </a></li>');
						     selectedSubjectsArr.push({ "courseId": data[i].course_code,"courseName": data[i].course_name,"isElective": data[i].elective });
						       
				         }
	   		       }
	   		       else
	   		       {
 	   		    	   $("#divSupplementary").show();
  	   		    	   $("#divRegular").hide();
				       for ( var i = 0; i < data.length; i++ ){
							var tr=$('<tr><td>'+data[i].course_name+ ' ( ' + data[i].course_code +' )</td><td><input  id="'+i+'" type="checkbox"  class="courses"  style:"margin-right: 20px"></td></tr>');
							$('#tblSupplementary').append(tr);
										
							}
						  $('.courses').unbind().bind('change',function()
								{
								
																   
									var selectedId = $(this).attr('id') ;
								
									if(this.checked)
									{
										 selectedSubjectsArr.push({
										      "courseId": data[selectedId].course_code,
									      "courseName": data[selectedId].course_name,
									      "isElective": data[selectedId].elective
										     });
									}
									else
									{
										
										for( var i = 0; i < selectedSubjectsArr.length; i++){
											if ( selectedSubjectsArr[i].courseId === data[selectedId].course_code) { 
												
												selectedSubjectsArr.splice(i, 1);
											}
										}
									}
									displaySelectedCourses(selectedSubjectsArr);
									bindFeeDetails(config,selectedSubjectsArr.length);
																		
								});
							  
							   }
				
	   		    bindFeeDetails(config,selectedSubjectsArr.length);
			   }
	   		 
	   		  	   			
	   		},
	   		error:function(e)
				{
					console.log("Error in calling ajax "+e);
					toastr.error("Error while getting course details of this program");
				}
	   		
	   	});
	 }
	 
	 
	function displaySelectedCourses(data)
		{
		console.log(data);
			$('#displayCourses').empty();
			for(let i=0;i<data.length;i++)
			{
				var tr=$('<tr><td>'+ data[i].courseName+ ' ( ' + data[i].courseId +' )</td></tr>');
				$('#displayCourses').append(tr);
			}
			
			
		}
		
		

		
	 
  /**
   * function to confirm for exam registration
   */

   $("#submitReg").submit(function(e){
	   e.preventDefault();
	   if(selectedSubjectsArr.length == 0 )
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
			 var orderId = "Exam-"+selectedExamName+"-"+ $("#usercode").val()+ "-"	+ timestamp;
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
				fullDetailArray.push(map);
			});
		
	
			var data={
					  "examCenter": $( "#selectExamCenter option:selected" ).text(),
					  "examPlace": $( "#selectExamPlace option:selected" ).text(),
					  "scheduleId":selectedScheduleId,
					  "orderId":orderId,
					  "paymentDetails":fullDetailArray.join(", "),
					  "status": "SUBMITTED",
					  "approvalStatus": "Pending",
					  "studentId":loggedStudentId,
					   "subjects": selectedSubjectsArr 
					}
			
			
		
			
			   $.ajax({
		         url: BASE_URL +"registration/create",
		         method:"POST",
		         data: data,
		         		
				 success: function(data)
		           {
					 console.log(data);
					// showMessage("Successfully Submitted. Kindly pay fees to Registration");
						$('#displayTable').empty();
						  $("#electiveCourse").empty();
					      $("#regularCourse").empty();
					      $("#tblSupplementary").empty();
					      $( "#cbxDeclaration" ).prop( "checked", false );
					      loadExamNotifications(studentData);// reload datatable
					      
					 $("#registrationForm").hide();
						debitStudentFee(fullDetailArray);
					 toastr.success("Successfully Registered. Kindly pay fees to process the registration!!");
		           },
		           error: function(err)
		           {
		        	   if (err.status == 409) {
                           
                           toastr.error("You have already registered for this exam !!");
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
				//showMessage("Fee Debit done Successfully !! . Kindly pay the fees at the fee section ");
				toastr.success("Fee Debit generated");
				//addPaymentDetails(certificateNum,orderId,feeAmount);
	           },
		       error: function(err)
		           {
		               toastr.error("Fee Debit failed !!");
		           }
	         });
			
	}
	
	  /**
	   * function to confirm for exam registration
	   */

	   $("#previewRegistration").on('click',function(e){
		   e.preventDefault();
		   alert("SDdsf");
	         printReport2("registrationForm","Registrtion");
	      
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
	 
	 function bindViewFeeDetails(config)
	 {

	 $.ajax(
			{
				"url":"/fees/getManyFeeHeadAmountMap",
				"data":{"pgmId":selectedProgramId,"feeIdentifierList":String(config)},
				success:function(data)
				{
					console.log(data.length);
					$('#displayTable1').empty();
			
						for(let i=0;i<data.length;i++)
						{
							 var tr=$('<tr><td>'+data[i]['configKey']+'</td><td>'+data[i]['feeAmount']+'</td></tr>');
														      	    
					       
							$('#displayTable1').append(tr);
							
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