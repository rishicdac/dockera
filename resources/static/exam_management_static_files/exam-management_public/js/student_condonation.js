$(document).ready(function() {
 

   var loggedStudentId = $("#usercode").val();
   
   var studentId;
   var condonationId;
   var datawithPayment;
   var docLink;
   loadTable();
   
				
	/* file upload */
	$(".custom-file-input").on("change", function() {
	
	  var fileName = $(this).val().split("\\").pop();
	  $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
	});
    
    
   /*
   *  Function to load the condonation list which satisfies the criteria 
   */
   function loadCondonationList(data){ 
       condonationListDataTable =  $('#tblCondonationUpdationList').DataTable({
            "language": {
                    "emptyTable": "No students found satisfying your criteria"
                  },
			"processing": true,
			"destroy": true,
			"data":data,
			"columns": [
			
		 /*   { "data": "id"},*/
		/*	{ "data": "studentId"},*/
			{ "data": "studentName" , "render": function (data, type, full, meta) {
	            
                                 return (full.studentName + " ( " + full.studentId + ") ");   
                         }
			},
			{ "data": "null",
			            "render": function (data, type, full, meta) {
		            
		                    return (full.program + " / " + full.batch + " / " + full.semester)   
			            }
		      },
			{ "data": "percentage" },
			{ "data": "fineAmount" ,
			           "render": function (data, type, full, meta) {
						           if(data ==null)
						                 return ("Approval Pending");
						            else
						                 return data;        
						           }},
			{ "data": "exempted",
			           "render": function (data, type, full, meta) {
						           if(data ==null)
						                 return ("Approval Pending");
						           else
					            	   return (data ? "YES" : "NO");       
						                    
						           } },
			{ "data": "feeOrderStatusValue",
						"render": function (data, type, full, meta) {
						              if(data ==null)
						                   return ("Approval Pending");
						              else
						            	  return data;
						            }},
		 	{
				"data": null,
				"defaultContent":
					
					'<a data-toggle="collapse" href="#"  class=""small-box-footer text-danger" id="btnView"> <i class="fas fa-eye"></i></a>' 
					
			},
			{
				"data": null,
				"render":function (data, type, full, meta) {
					if(data.reason == null)
					 return '<a data-toggle="collapse" href="#"  class=""small-box-footer text-danger" id="btnEdit"> <i class="fas fa-edit"></i></a>'
					 else
					    return "Request Submitted"; 
					}
			}
			]
		
            
		});
   
     $('#tblCondonationUpdationList tbody').on( 'click', 'tr', function () {
	
	        if ( $(this).hasClass('selected') ) {
	            $(this).removeClass('selected');
	        }
	        else {
	            condonationListDataTable.$('tr.selected').removeClass('selected');
	            $(this).addClass('selected');
	        }
	    } );
	    
	    
    
	   /*
	   *  Action function to update the condonation list 
	   */
	    $('#tblCondonationUpdationList tbody').on('click', '#btnEdit', function () {
	            	             
               $('#viewModel').hide();   
	    	    $('#requestModel').show();
	           
	    
			    $('html, body').animate({
				        scrollTop: $("#requestModel").offset().top
				}, 1000);
				
				
	            var data = condonationListDataTable.row($(this).parents('tr')).data();
               console.log(data);
               condonationId =data.id;
              
              	$("#studentId").text(data.studentId);
              	$("#studentName").text(data.studentName);
              	$("#attendance").text(data.percentage);
              	
              	let exemptionString;
              	/* exemption */
                for(var i = 0; i < datawithPayment.length; i++){

				   if(datawithPayment[i].hasOwnProperty('exempted') && datawithPayment[i]['exempted'] === true) {
				    exemptionString = exemptionString + datawithPayment[i]['program'] + "/"+ datawithPayment[i]['batch'] +"/"+ datawithPayment[i]['semester'];
				   }

              }

               	$("#previousExemption").text(exemptionString);
		});
		
	   /*
	   *  Action function to update the condonation list 
	   */
	    $('#tblCondonationUpdationList tbody').on('click', '#btnView', function () {
	            	             
	    	$('#frameDoc').hide();         	                     
	    	    $('#viewModel').show();
	            $('#requestModel').hide();  
			    $('html, body').animate({
				        scrollTop: $("#viewModel").offset().top
				}, 1000);
				
				var data = condonationListDataTable.row($(this).parents('tr')).data();
              	console.log(data);
              	              
               	$("#studentViewId").text(data.studentId);
              	$("#studentViewName").text(data.studentName);
              	$("#attendanceView").text(data.percentage);
              	$("#programBatchSemView").text(data.program + " / " + data.batch + " / " + data.semester);
              	
              	let exemptionString;
              	/* exemption */
                for(var i = 0; i < datawithPayment.length; i++){

				   if(datawithPayment[i].hasOwnProperty('exempted') && datawithPayment[i]['exempted'] === true && datawithPayment[i]['studentId'] === data.studentId) {
				    exemptionString = exemptionString + datawithPayment[i]['program'] + "/"+ datawithPayment[i]['batch'] +"/"+ datawithPayment[i]['semester'];
				   }

              }
               	$("#previousExemptionView").text(exemptionString);
               	$("#reasonView").text(data.reason ? data.reason : "----");
               	if(data.refDoc != null)
				 {
				   $('#refDocView').text('Yes');
				   //$('#refDocView').hide;
				    $('.link').show();
				    //docLink = data.refDoc;
				    docLink = "filerepo_public/minioFiles/nuals/"+data.refDoc;  
				 }
				 else
				   $('#refDocView').text('No');
				   
                 $("#exemptedView").text(data.exempted ? "YES" : "NO");    	  
              	
                 /* fine amount */
                 if(data.fineAmount == null)
                	 $("#fineAmountView").text("Approval Pending");
                 else
              	     $("#fineAmountView").text(data.fineAmount);
              	 
              	 $("#conStatus").text(data.status ? data.status :" Listed for condonation");
              
              	$("#paymentStatus").text(data.feeOrderStatusValue ? data.feeOrderStatusValue :"Fine not generated" );
		});
	}
	
	$("#refDocLink").on('click',function(){
			//  window.open(docLink, '_blank');
		  $('#frameDoc').show();
		  $('html, body').animate({
		        scrollTop: $("#frameDoc").offset().top
		}, 1000);
		
		  $('#iframeDoc').attr('src', docLink);
		})
	
				
							
    /**
	 * update condonation fee details and raise fine amount as debit against the student 
	**/
	
   	$('#formUpdateCondonation').unbind().bind('submit',function(event)
	{
	
		 event.preventDefault();
		  var condonationFormDataJson={};
		  condonationFormDataJson.id = condonationId;
		  condonationFormDataJson.studentName = $("#studentId").text();
		  condonationFormDataJson.status = "SUBMITTED";
		  condonationFormDataJson.reason = $("#reason").val();
		   
		  
		  let formData = new FormData();
		  var file = $('#refFile')[0].files[0];
		 
   		  if (file != undefined) {
			
				formData.append('CondonationData',JSON.stringify(condonationFormDataJson));
				formData.append('file',	file);
															
			}			
																	
		 var msg = { title : "Request", msg : " Do you want to request for condonation exemption?"  };
		 
		 ConfirmDialog(msg, "SAVE").then(function(response) {
		 		
		 			  if (file != undefined) {
		 			    requestCondonationFile(formData);
		 			  
		 			  }
		 			  else{
		 			     requestCondonation(condonationFormDataJson);
		 			}
									
		  }, function(error) {
				
				  toastr.error("Request cancelled");	
			
			});
				          
	
     });
    
    
    function requestCondonation(condonationFormDataJson){
    
      $.ajax({
	   		url: BASE_URL+"condonation/student/update",
	   		method: 'POST',
	   		data:condonationFormDataJson,
	   	
	   		success: function(data)
	   		{
	   		   $('#requestModel').hide();
	   		   toastr.success("Request submitted Successfully");
	   		   loadTable();
	   		  	   		  	   			
	   		},
	   		error:function(err)
	   		{
	   		    toastr.error("Request submission failed !!");
	   		    
	   		}
    
    
    });
    }
   
    
    function requestCondonationFile(formData){
    	 console.log(formData);
          $.ajax(
		   		  {
		   			"url":"exam-management_proxy/api/v1/condonation/update-file",
		   			"method":"POST",
		   			cache: false,
		   			processData: false, 
			        contentType: false, 
			        data:formData,
		   			success:function(data){
	   			
		   			
		   				$('#requestModel').hide();
	   		    		toastr.success("Request submitted Successfully");
	   		   			loadTable();
		   			  
			   			  //reset  	
			   			  $("#reason").val(""); 
			   			  $(".custom-file-label").html("");
		   			  	
			   			
		   			},
		   			
					error:function(err)
			   		{
			   			toastr.error("Request submission failed !!");
			   			 			
			   		}
		   		});	
    
    
    }
    
    
    
    /**
    *  load data after successful updation
    */
    
    function loadTable()
    {
       	url = BASE_URL+"condonation/list/student/";
   		datawithPayment =  loadURLData(url);
   	 	loadCondonationList(datawithPayment);
         
    
    }
   
    
  });               