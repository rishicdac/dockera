$( document ).ready(function() {
    $('#collapseExample').hide();
	
	var certificateId = 0;
	var feeTotal = 0;
	var studentId;
	var feeDataTable =  $('#deptFeetbl').DataTable({
		 "language": {
             "emptyTable": "No data available for fee generation"
           },
			"destroy": true,
			"ajax":BASE_URL + "no-due-certificate-requests-student/",
			"columns": [
			{ "data": "requestDate" ,  "render": function(data){return moment(data).format('D/MM/YYYY')}},	
			{"data":"studentId"},
			{"data":"departmentName"},
			
			{"data":"amount","render": function(data){
				if(data!=null)
					return data + ".00";
				else
					return "0.00";
			}},	
			{
				"data":"orderId","render": function(data){
					if(data)
						return '<label  class="small-box-footer badge badge-success " >Fee Generated</a>' ;
					else
						return '<label  class="small-box-footer badge badge-warning " >Pending</a>' ;
				}
			},
			{
				"data": null,
				"defaultContent":
					'<a data-toggle="collapse" href="#"  class="small-box-footer text-danger" id="detailsButton">More info <i class="fas fa-arrow-circle-down"></i></a>' 
			}
			]
           
		});
		
		$('#deptFeetbl tbody').on('click', '#detailsButton', function () {
			var data = feeDataTable.row($(this).parents('tr')).data();
			console.log(data)
			certificateId = data.certificateId;
			studentId= data.studentId;
			orderId = data.orderId;
			$.ajax({

				type: "GET",
				contentType: "application/json",
				url: BASE_URL +"no-due-details-by-certificate-student/"+certificateId,				
				dataType: 'json',
				success: function (data) {
					
					loadCertificateDetails(data,orderId);
					 getStudentInfo(studentId);
				},
				error: function (error) {
				   toastr.error(data.message);
				}
            });
			
			
			
		    $('#collapseExample').show();
		});
		
		/**
		*Load Details on Preview division
		*
		**/
		function loadCertificateDetails(result,orderId)
		{
			console.log(result)
			console.log(orderId)
			feeTotal = 0;		
			$("#feedetailsTbl tbody").remove();	
			if(result.data.length>0)	
			{				
				$.each(result.data, function (key, value) {
					feeTotal = feeTotal+parseInt(value.dueAmount!=null?value.dueAmount:0);
					console.log(feeTotal);
					$("#feedetailsTbl").append($('<tbody><tr><td>' +value.departmentName+ '</td><td><span class="badge bg-danger">' +value.dueAmount+ '</span></td><td>' +value.remarks+ '</td><td>' +value.createdBy+ '</td></tr></tbody>'));
				});
			}else{
				$("#feedetailsTbl").append($('<tbody><tr><td colspan="5" class="text-center">No data available</td></tr></tbody>'));
			}
			
			$("#totalAmount").text(feeTotal+" Rs/-");
			
			if(orderId===null && feeTotal>0)
			{			   
				$("#generateFeeBtn").show();
			}else if(result.data.length>0 && feeTotal===0)
			{
				$("#generateFeeBtn").show();
			}else{
				
				 $("#generateFeeBtn").hide();
			}
		}
		/**
		*Verify Form Submit
		*
		**/
		$('#generateFeeForm').submit(function(e){
			e.preventDefault();
			var msg  = {
					title : "Save",
					msg : " Do you want to Debit Fee Details?"
					}
					ConfirmDialog(msg,"SAVE").then( function(response){

					
						var timestamp = Number(new Date()); 
					    var orderId = "CERT-NO-DUE"+studentId+"-"+timestamp;
					    
						var payment_status ={
					          	  "certificateId": certificateId,
					        	  "dueamount": feeTotal,
					        	  "orderId": orderId
					        	}
						 if(feeTotal >0){
						
					        debitStudentFee(studentId,feeTotal,orderId);
			           }
						 SubmitRequestToCertificate(payment_status);

					},function(error){

					});
		    
		
		
		});
		
	/**
	 * Raise debit against student
	 */
	function debitStudentFee(student_id,amount,order_id)
	{
		var map={};
		var formData = [];
	
		map['transactionIdentifierRemarkOrProcess'] = order_id;
		map['transactionIdentifierProcessId'] = NO_DUES; //to do
		map['transactionAmount']=amount;
		map['studentUserCode']= studentId;
		formData.push(map);
        console.log(formData);
        
     
        
	    $.ajax({
	           type: "POST",
	            url: "fees/generateFeeDebitsV1-v1",
	            data:{"transactionWrappers":formData},
					   
	            success: function(data)
	           {
			      //  showMessage("Fee Debit done Successfully !! . Kindly pay the fees at the fee section ");
			        toastr.success("Fee Debit done against student Successfully !! ");
				   //addPaymentDetails(certificateNum,orderId,feeAmount);
			       
	           },
	            error: function(data)
				   {
					toastr.error(data.message);
				   }
	         });			
	}
		
	function SubmitRequestToCertificate(data)
	{
		$.ajax({
	           type: "POST",
	            url: BASE_URL + "no-due-certificate-fee-generation/",
	            data:data,
					   
	            success: function(data)
	           {
			      //  showMessage("Fee Debit done Successfully !! . Kindly pay the fees at the fee section ");
			       // toastr.success("Fee  !! ");
				   //addPaymentDetails(certificateNum,orderId,feeAmount);
	            	$('#deptFeetbl').DataTable().ajax.reload();
	            	$('#collapseExample').hide();
	           },
	            error: function(data)
				   {
					toastr.error(data.message);
				   }
	         });	
	}
});
