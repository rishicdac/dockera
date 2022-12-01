$( document ).ready(function() { 
	$('#collapseExample').hide();

	/**
	 Data table load
	**/
		var issueDataTable =  $('#certificateIssueTbl').DataTable({
			 "language": {
                 "emptyTable": "No data available for the verification"
               },
			"destroy": true,
			"ajax": BASE_URL + "getCertificatesWithPrintCount",			
            "columns": [
            { "data": "studentId"},
			{ "data": "type" },
			{ "data": "name" },
			{ "data": "status"},
			{ "data":"approvalStatus"},	
			{ "data": null},		
            /*{
				"data": null,
				"defaultContent":
					'<a data-toggle="collapse" href="#"  class="small-box-footer text-danger" id="detailsButton">Issue <i class="fas fa-arrow-circle-down"></i></a>' 
			}*/
            ],
			columnDefs: [{
				// puts a button in the last column
				targets: [-1], render: function (a, b, data, d) {
					
					if (data.approvalStatus!="APPROVED" && data.noPrint<=0) {
						
						return '<label  class="small-box-footer text-info" >Not Generated Yet</a>' ;
						
					}else if(data.status==="ISSUED")
					{
						return '<label  class="small-box-footer text-success" >Already issued</a>' ;
					}else
					{
						return '<a data-toggle="collapse" href="#"  class="small-box-footer text-danger" id="detailsButton">Issue <i class="fas fa-arrow-circle-down"></i></a>' ;
						
					}
					
				}
			}]
           
		});
		
		/**
		 Data table row click event
		**/
		var certificateId;
		$('#certificateIssueTbl tbody').on('click', '#detailsButton', function () {
			var data = issueDataTable.row($(this).parents('tr')).data();
		
			console.log(data)
			certificateId = data.certId;
			$('#collapseExample').show();
			
		});
		
		/**
		Form Submit for issue certificate
		**/
		$('#issueCertificateForm').submit(function(e){
			e.preventDefault();
			var issuedata = {
							  "certificatesId": certificateId,
							  "recievedBy": $('#receivedBy').val(),
							  "remarks": $('#issueRemarks').val()
							};
			
			var msg  = {
					title : "Save",
					msg : " Do you want to Issue Certificate?"
					}
					ConfirmDialog(msg,"SAVE").then( function(response){

						$.ajax({
							   type: "POST",
							   url: BASE_URL + "issue",
							   data:JSON.stringify(issuedata),
							   headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json'
							   },		   
							   success: function(data)
							   {		
							
								 $('#collapseExample').hide();
								 $('#certificateIssueTbl').DataTable().ajax.reload();
								 	 
								 toastr.success(data.message);
								 $("html, body").animate({ scrollTop: 0 }, "slow");
								
								 $('#receivedBy').val('');
								 $('#issueRemarks').val('');
								 //TODO Notification 
							   },
							   error: function(data)
							   {
								    toastr.error(data.message);
							   }
							 });


					},function(error){

					});
			
				
		})
	
});
