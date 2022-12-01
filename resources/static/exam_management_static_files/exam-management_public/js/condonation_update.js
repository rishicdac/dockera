$(document).ready(function() {
 
	$("#condonationUpdate").hide();
   $("#viewModel").hide();
   $("#updateModel").hide();
   
   $('#exempted').prop('checked', true);
       var condonationListDataTable;
       
   var exemption = false;
   var feeAmount;
   var studentId;
   var docLink;
   var processId;
   var condonationId;
    var datawithPayment =[];
   getCondonationProcessId();
   
   $("input[data-bootstrap-switch]").each(function() {
			$(this).bootstrapSwitch('state',
					$(this).prop('checked'));
		});
							
	function getCondonationProcessId(){
	
	
		 $.ajax({
		      	 "url":"/fees/getFeeHeadByProcessCode",
	               data:{"ProcessCode":'condonationFee'},
		   		//method: 'POST',
		   		contentType: "application/json",
		   		success: function(data)
		   		{
		   		  //  showMessage("Generated Condonation list Successfully");
		   	          processId = data.sfsFeeHeadId;
		   	
		   	
		   		  	   		  	   			
		   		},
		   		error:function(err)
		   		{
		   		    toastr.error("Condonation config failed");
		   			//showMessage(err);
		   		}
		   	});	  
	
	
	}
	
	/**
	 * Get condonation Fee amount for the given feeheadId
	 */
	function getCondonationFee(feeHeadId, programId) {
	console.log(programId);

		$
				.ajax({
					url : 'fees/getFeeDetailsByExaminationFeeHeadsAndCourse',
					method : 'GET',
					
					data : {
						"feeHeadId" : feeHeadId,
						"courseId" : programId
					},
					success : function(data) {
						console.log(data.feeAmount);
					if(data){
						 feeAmount = data.feeAmount;
						 console.log(feeAmount);
						 //return feeAmount;
                          $("#fineAmount").val(feeAmount);
                         }
                        else{
                        	toastr.error("condonation Fee amount is not set for this Program !!!");
                        
                        } 
					},
					error : function(err) {
						toastr
								.error("Failed to load Fee details");
					}
				});
		

	}						
							
  
   
    /**
	 Generate condonation list 
	**/
    $("#formCondonationList").submit(function (event) {
         event.preventDefault();
           $("#condonationUpdate").show();
       //    $("#viewModel").show();
        //   $("#updateModel").show();
	   	  //  loadCondonationList();
	   		  	   			
	   	 var url = BASE_URL+"condonation/list";
	   	 var data = {"programId":$('#selectProgram').val(),"batchId":$('#selectBatch').val(),"semester":$('#selectSemester').val()};
         var datawithPayment =  loadURLData(url,data);
         loadCondonationList(datawithPayment);
         getCondonationFee(processId,$( "#selectProgram option:selected" ).val());
	   //	alert(processId,$('#selectProgram').val());
            
    });
    
    
   /*
   *  Function to load the condonation list which satisfies the criteria 
   */
   function loadCondonationList(data){ 
	   console.log("data in data table ");
	   console.log( data);
       condonationListDataTable =  $('#tblCondonationUpdationList').DataTable({
            "language": {
                    "emptyTable": "No students found satisfying your criteria"
                  },
			"processing": true,
			"destroy": true,
			"data":data,
			"columns": [
			
		    { "data": "id"},
			{ "data": "studentId"},
			{ "data": "studentName" },
			{ "data": "null",
			            "render": function (data, type, full, meta) {
		            
		                    return (full.program + " / " + full.batch + " / " + full.semester)   
			            }
		      },
			{ "data": "percentage" },
			{ "data": "status","render": function (data, type, full, meta) {
						              if(data ==null)
						                   return ("Listed");
						               else
						                 return data;
						                       
						            }},
			{ "data": "exempted","render": function (data, type, full, meta) {
	              if(data ==null)
	                   return ("---");
	               else
	            	   return (data ? "YES" : "NO");  
	            	   
	                       
	            }},
			{ "data": "feeOrderStatusValue",
						"render": function (data, type, full, meta) {
						              if(data ==null)
						                   return ("---");
						               else
						                return data;       
						            }},
			
			{
				"data": null,
				"render":function (data, type, full, meta) {
					if(data.fineAmount == null)
					    return '<a data-toggle="collapse" href="#"  class=""small-box-footer text-danger" id="btnEdit"> <i class="fas fa-edit"></i></a>';
					else
					  return '<a data-toggle="collapse" href="#"  class=""small-box-footer text-danger" id="btnView"> <i class="fas fa-eye"></i></a>';
					   
					}
			}
			],
		"columnDefs": [
            {
                "targets": [ 0 ],
                "visible": false,
                "searchable": false
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
	            	             
	    	  $('#frameDoc').hide();
	           	$('#viewModel').hide();            
	    	    $('#updateModel').show();
	            $('#id').hide();
	    
			    $('html, body').animate({
				        scrollTop: $("#updateModel").offset().top
				}, 1000);
				
				
	            var data = condonationListDataTable.row($(this).parents('tr')).data();
              	         	
                 condonationId = data.id;
                 studentId = data.studentId;
               	$("#studentId").text(data.studentId);
              	$("#studentName").text(data.studentName);
              	$("#attendance").text(data.percentage);
              	$("#programBatchSem").text(data.program + " / " + data.batch + " / " + data.semester);

              	let exemptionString;
              	/* exemption */
                for(var i = 0; i < datawithPayment.length; i++){

				   if(datawithPayment[i].hasOwnProperty('exempted') && datawithPayment[i]['exempted'] === true && datawithPayment[i]['studentId'] === data.studentId) {
				    exemptionString = exemptionString + datawithPayment[i]['program'] + "/"+ datawithPayment[i]['batch'] +"/"+ datawithPayment[i]['semester'];
				   }

              }
               	$("#previousExemption").text(exemptionString);
               	if(data.reason != null)
               		$("#reason").text(data.reason);
               	if(data.refDoc != null)
				 {
				   $('#refDoc').text('Yes');
				   //$('#refDocView').hide;
				    $('.link').show();
				    //docLink = data.refDoc;
				    docLink = "filerepo_public/minioFiles/nuals/"+data.refDoc;  
				      
				 }
				 else{
				   $('#refDoc').text('No');
				    $('.link').hide();
				    }
				   
               	if(data.status  == null){
             
               	$("#status").text( "Listed");
               	}
              		 
              	else
              	 $("#status").text(data.status ? data.status : "Listed"  );
               	
              	/* exemption */
              
              	if(data.exempted != null)
              	  $("#exempted").bootstrapSwitch('state',data.exempted);
              	else
              	  $("#exempted").bootstrapSwitch('state', false);
              	  
              	/* fine amount */  
              	if(data.fineAmount != null)
                 	$("#fineAmount").val(data.fineAmount);
                 else
                    $("#fineAmount").val(feeAmount);
                 
           
	                $("#btnUpdate").show();
		});
		
		
	
	   /*
	   *  Action function to update the condonation list 
	   */
	    $('#tblCondonationUpdationList tbody').on('click', '#btnView', function () {
	            	             
	    	$('#frameDoc').hide();               	                     
	    	    $('#viewModel').show();
	            $('#updateModel').hide();  
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
				    docLink = "filerepo_public/minioFiles/nuals/"+data.refDoc;    
				 }
				 else
				   $('#refDocView').text('No');
				   
                 $("#exemptedView").text(data.exempted ? "YES" : "NO");    	  
              	/* fine amount */  
              	 $("#fineAmountView").text(data.fineAmount);
              	 
              	 if(data.status  ==null)
              		$("#conStatus").text( "Listed"); 
              	else
              	 $("#conStatus").text(data.status ? data.status : "Listed"  );
              
              	$("#paymentStatus").text(data.feeOrderStatusValue ? data.feeOrderStatusValue :"Fine not generated" );
                
		});
		
	
	}
	
	$("#refDocLink").on('click',function(){
			  //window.open(docLink, '_blank');
			  $('#frameDoc').show();
			  $('html, body').animate({
			        scrollTop: $("#frameDoc").offset().top
			}, 1000);
			  $('#iframeDoc').attr('src', docLink);
		})
	
			
			
			
	/**
	 * change event of no due certificate switch
	 */
	$("input[data-bootstrap-switch]").on(
			'switchChange.bootstrapSwitch',
			function(event, state) {
				
				$("#fineAmount").prop('disabled', true);
				if (state === true) {
					exemption = true;
					$("#fineAmount").val(0);
					 
				} else {
				 
				exemption = false;
				$("#fineAmount").val(feeAmount);
					
				}

			});
			
							
    /**
	 * update condonation fee details and raise fine amount as debit against the student 
	**/
	
   	$('#formUpdateCondonation').unbind().bind('submit',function(event)
	{
	
		 event.preventDefault();
				
		 // serialize the form
		 condonationFormData = {};
	     condonationFormData.exempted= exemption;
	     condonationFormData.id=condonationId; 
	     condonationFormData.fineAmount = feeAmount ? feeAmount : 0 ;
	        condonationFormData.status = "APPROVED";
        
	      if(condonationFormData.fineAmount > 0 ){
	             var timestamp = Number(new Date()); 
			      var orderId = "CONDONATION-"+studentId+"-"+timestamp;
			      condonationFormData.orderId= orderId; 	 
		     }   
	      else
	    	  condonationFormData.orderId= null; 	
	      
	     condonationFormDataJson = JSON.stringify(condonationFormData);
		  
		 var msg = {
					 title : "Approve",
					 msg : " Do you want to approve condonation?"
				   }
		 ConfirmDialog(msg, "APPROVE").then(function(response) {
		
		 			debitFee(condonationFormDataJson,condonationFormData.orderId);
									
		  }, function(error) {
				
				  toastr.error("Approval cancelled");	
			
			});
				          
	
     });
    
    
    /**
    * debit fee against the student
    */
    
    function debitFee(condonationFormDataJson,orderId)
    {
    	
    	  if($("#fineAmount").val() > 0 && exemption == false)
		  {
		    		  
    		var map={};
            var formData = [];
		  	map['transactionIdentifierRemarkOrProcess'] = orderId;
			map['transactionIdentifierProcessId'] = processId; // TO-DO
			map['transactionAmount']=$("#fineAmount").val();
			map['studentUserCode'] =  studentId;
			formData.push(map);
	        console.log(formData);
	        
		    $.ajax({
		           type: "POST",
		           async:false,
		            url: "fees/generateFeeDebitsV1-v1",
		            data:{"transactionWrappers":formData},
						   
		            success: function(data)
		           {
					//showMessage("Fee Debit done Successfully !! . Kindly pay the fees at the fee section ");
					toastr.success("Fee debited against the student");
					
		           } ,
			   		error:function(err)
			   		{
			   		    toastr.error("Fee Debit  failed");
			   			//showMessage(err);
			   		}
			 });
	         
		  }
    	
		  
		  updateCondonation(condonationFormDataJson);
    
    
    }
    
    
    /* 
    *  update on change of amount and exemption
    */
    function updateCondonation(condonationFormDataJson)
    {
       console.log("condonationFormDataJson"+condonationFormDataJson);
      
	     $.ajax({
	   		url: BASE_URL+"condonation/update",
	   		method: 'POST',
	   	
	   		data:condonationFormDataJson,
	   		contentType: "application/json",
	   		success: function(data)
	   		{
	   		  //  showMessage("Generated Condonation list Successfully");
	   		   $('#updateModel').hide();
	   		   toastr.success("Condonation details updated");
	   		   reloadTable();
	   		  	   		  	   			
	   		},
	   		error:function(err)
	   		{
	   		    toastr.error("Condonation Updation failed");
	   			//showMessage(err);
	   		}
	   	});	  
	   	
    }
    
    /**
    *  reload data after successful updation
    */
    
    function reloadTable()
    {
    	 var url = BASE_URL+"condonation/list";
	   	 var data = {"programId":$('#selectProgram').val(),"batchId":$('#selectBatch').val(),"semester":$('#selectSemester').val()};
          datawithPayment =  loadURLData(url,data);
         loadCondonationList(datawithPayment);
    
    }
   
    
  });               