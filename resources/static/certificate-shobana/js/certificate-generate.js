$( document ).ready(function() { 
	$('#remarks').hide();
	$('#collapseExample').hide();
	$('#datatable_div').hide();
	var certificateId,actionType,nameId,printCount,generateDataTable,affidavit,certificateInfo={},printInfo={},certificateNumber;
	var loggedInStudentId = $("#usercode").val();
	var studentInfo = getStudentInfo(loggedInStudentId);
	var student = studentInfo[loggedInStudentId];
		/**
		Populate Certificate
		**/
		$('#CertGenerationForm').submit(function(e){
			e.preventDefault();
			
				var programId = $('#selectProgram').val();
				var batchId = $('#selectBatch').val();
				var semesterId = $('#selectSemester').val();
				$.ajax({
					   type: "GET",
					   url:  BASE_URL +"getCertificatesWithPrintCount-v1/programId/"+programId+"/batchId/"+batchId+"/semesterId/"+semesterId,
					  
					   headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					   },		   
					   success: function(result)
					   {				
						
						   InitDatatable(result.data);
						   $('#datatable_div').show();
					   },
				   		error:function(err)
				   		{
				   		 toastr.error("Failed to generate certificate");
				   		}
					 });
			
		})
		/**
		Generate Certificate
		**/
		$('#generateCertificate').submit(function(e){
			e.preventDefault();
			var msg  = {
					title : "Save",
					msg : " Do you want to Print Certificate?"
					}
					ConfirmDialog(msg,"SAVE").then( function(response){
						console.log(certificateInfo);
						certificateNumber =	generateCertificateNumber(certificateInfo);
						console.log(certificateNumber);
						if(printCount===0){
							
							printCertificate(certificateNumber);
						}else
							{
							
							rePrintCertificate();
							}
					},function(error){

					});
				  $('#collapseExample').hide();		
		})
		
		/**
		 * Initailize Datatable
		 */
		function InitDatatable(data)
		{			
				 generateDataTable =  $('#certificateGenerateTbl').DataTable({
					 "language": {
		                 "emptyTable": "No data available for the verification"
		               },
					"destroy": true,
					"data":data,
					//"ajax":  BASE_URL + "getCertificatesWithPrintCount",			
		            "columns": [
		            { "data": "studentId"},
					{ "data": "type" },
					{ "data": "name" },
					{ "data": "status"},
					{ "data":"approvalStatus"},
					{ "data": "noPrint"},
		            { "data": null },
		            ],
		            columnDefs: [{
						// puts a button in the last column
						targets: [-1], render: function (a, b, data, d) {
							
							if (data.approvalStatus === "APPROVED" && data.noPrint==0) {
								
								return "<button  class='btn btn-xs btn-primary print' id='print'><i class='fas fa-print'></i> Print</button>";
								
							}else if((data.noPrint>0) && (data.status!="ISSUED"))
							{
								return "<button target='_blank' class='btn btn-xs btn-danger print' id='reprint'><i class='fas fa-print'></i> Re-Print</button>";
								
							}else if((data.approvalStatus === "SUBMITTED" || data.approvalStatus === "VERIFIED") && data.noPrint==0 )
							{
								return "<button  class='btn btn-xs btn-primary' disabled><i class='fas fa-print'></i> Not Approved</button>";
								
							}else if(data.status==="ISSUED")
								{
								return "<button  class='btn btn-xs btn-warning' disabled>Issued</button>";
								}
								return "<button  class='btn btn-xs btn-primary' disabled><i class='fas fa-print'></i> Not Approved</button>";
							
							
						}
					}]
				});
				
				/**
				 Print Button Click Event
				**/
				$('#certificateGenerateTbl tbody').on('click', '#print', function () {
					var data = generateDataTable.row($(this).parents('tr')).data();
					
				/*	var msg  = {
							title : "Save",
							msg : " Do you want to Print Certificate?"
							}
							ConfirmDialog(msg,"SAVE").then( function(response){*/
								createCertificateNumberFormat(data.name,student.programName,student.rollNo,student.batchName);
								certificateId = data.certId;
								nameId = data.nameId;	
								printCount=data.noPrint;
								certificateDetailsOnPreview(certificateId);


							/*},function(error){

							});*/
					
					
					
				});
				/**
				 Re-Print Button Click Event
				**/
				$('#certificateGenerateTbl tbody').on('click', '#reprint', function () {
					var data = generateDataTable.row($(this).parents('tr')).data();
					/*var msg  = {
							title : "Save",
							msg : " Do you want to Reprint Certificate?"
							}
							ConfirmDialog(msg,"SAVE").then( function(response){*/

								
								console.log(data)
								createCertificateNumberFormat(data.name,student.programName,student.rollNo,student.batchName);
								certificateId = data.certId;	
								nameId = data.nameId;	
								printCount=data.noPrint;
								certificateDetailsOnPreview(certificateId);
								$('#remarks').show();
								$('#certRemarks').text("Printing Error");


							/*},function(error){

							});*/
				});
				
		}
		
		/**
		 * Create Certificate Number JSON
		 */
		function createCertificateNumberFormat(name,program,rollNo,batch)
		{
			certificateInfo.name = name;
			certificateInfo.program = program;
			certificateInfo.rollNo = rollNo;
			certificateInfo.batch = batch;
			return certificateInfo;
		}
		/**
		 * Generate Certificate Number
		 */
		function generateCertificateNumber(certificateInfo)
		{   
			var res = certificateInfo.name.split(" ");
			var certificateName = res[0].toUpperCase();
			//var certificateNumber = "NUALS/"+certificateInfo.program.toUpperCase()+"/"+certificateName+"/"+certificateInfo.rollNo+"/"+certificateInfo.batch;
			var certificateNumber = "NUALS/"+certificateName+"/"+certificateInfo.rollNo+"/"+certificateInfo.batch;
			return certificateNumber;
		}
		/**
		Print Certificate Button 
		**/
		function printCertificate(certificateNumber)
		{
			var statusdata = {"certificatesId":certificateId,"remarks":$("#certRemarks").val(),"certificateNumber":certificateNumber}
						
			$.ajax({
			   type: "POST",
			   url:  BASE_URL +"generate-certificate",
			   data:JSON.stringify(statusdata),
			   headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			   },		   
			   success: function(data)
			   {				
				 printInfo.certInfo = data;
				 printInfo.certInfo.certificateNumber = certificateNumber;
				 printInfo.studentInfo = student;
				 generateCertificateTemplates(printInfo,nameId);
				 $('#datatable_div').hide();
				 //$('#certificateGenerateTbl').DataTable().ajax.reload();
				 toastr.success(data.message);
				 
			   },
		   		error:function(err)
		   		{
		   		 toastr.error("Failed to generate certificate");
		   		}
			 });	
		}
		/**
		Show certificate details on preview
		**/
		function certificateDetailsOnPreview(id)
		{
			$.ajax({
				   type: "GET",
				   url:  BASE_URL + "getCertificateDetailsById/"+id,
				   async:false,
				   headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				   },		   
				   success: function(result)
				   {
					   console.log(result)
					   var data = result.data;
					   affidavit = result.data.affidavit;
					   getStudentInfo(data.studentId);
					   getApprovalHistory(id);
					   loadDataOnPreview(data);
					   
				   },
			   		error:function(err)
			   		{
			   		 toastr.error("Failed to load certificate details");
			   		}
				 });
		}
		/**
		Get Approval History
		**/
		function getApprovalHistory(certId)
		{
			$("#approvaldetailsTbl tbody").remove();	
			$.ajax({
				   type: "GET",
				   url:  BASE_URL + "getApprovalHistory/"+certId,
				   headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				   },		   
				   success: function(result)
				   {
					   $("#approvaldetailsTbl").empty();
					   $("#approvaldetailsTbl").append($('<thead><tr><th>Approval Type</th><th>By</th><th>Date</th></tr></thead>'));
					   $.each(result.data, function (key, value) {
							
							$("#approvaldetailsTbl").append($('<tbody><tr><td>' +value.appType+ '</td><td>' +value.createdBy+ '</td><td>' +moment(value.createdTime).format('D/MM/YYYY')+ '</td></tr></tbody>'));
						});
				   },
			   		error:function(err)
			   		{
			   		 toastr.error("Failed to load approval history");
			   		}
				 });
		}
		/**
		Re-Print Certificate Button 
		**/
		function rePrintCertificate()
		{
			
			var statusdata = {"certificateId":certificateId,"rePrintRemark":$("#certRemarks").val()}		
			$.ajax({
			   type: "POST",
			   url: BASE_URL +"reprint",
			   data:JSON.stringify(statusdata),
			   headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			   },		   
			   success: function(data)
			   {	
				 printInfo.certInfo = data;
				 printInfo.certInfo.certificateNumber = certificateNumber;
				 printInfo.studentInfo = student;
			     generateCertificateTemplates(printInfo,nameId);
			     $("html, body").animate({ scrollTop: 0 }, "slow");
				 $('#certRemarks').val('');			   
				 $('#collapseExample').hide();	
				// $('#certificateGenerateTbl').DataTable().ajax.reload();
				 $('#datatable_div').hide();
				 toastr.success(data.message);
				 //TODO Notification 
			   },
			   error: function(data)
			   {
				    toastr.error(data.message);
			   }
			 });	
		}
		
		$("#affidavitUrl").on('click',function(){
			openCertificates(affidavit);
		})
		
	
});
