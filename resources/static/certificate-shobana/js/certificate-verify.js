$( document ).ready(function() {
    $('#collapseExample').hide();
	
	var certificateId = 0;
    var verificationDataTable,affidavit; 
    
	loadDatatableWithPayment();
	   
function loadDatatable(data){
	
	
	 verificationDataTable =  $('#certificateVerificationTbl').DataTable({
         "language": {
                    "emptyTable": "No data available for the verification"
                  },
			//"processing": true,
			"destroy": true,
		
			"data":data,
			"columns": [
				
			//	{"data":"id"},
			{ "data": "createdTime" , "render": function(data){return moment(data).format('D/MM/YYYY')}},	
			{ "data":"createdBy"},
			{ "data": "studentId"},
			{ "data": "type" },
			{ "data": "name" },
			{"data":"feeOrderStatusValue"},
			{ "data": "approvalStatus"},
			{
				"data": null,
				"defaultContent":
					'<a data-toggle="collapse" href="#"  class="small-box-footer text-danger" id="detailsButton">More info <i class="fas fa-arrow-circle-down"></i></a>' 
			}]
		});
		
		$('#certificateVerificationTbl tbody').off().on('click', '#detailsButton', function () {
			var data = verificationDataTable.row($(this).parents('tr')).data();
			//CHECKING FOR DOM REMOVAL
			//$('#verifyBtn').hide();
			//console.log($('#verifyBtn'));
			$('#verifyBtn').detach();
			$('#feeStatusText').hide();
			certificateId = data.id;
			
			$.ajax({
				   type: "GET",
				   url:  BASE_URL + "getCertificateDetailsById/"+data.id,
				   headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				   },		   
				   success: function(result)
				   {
					   if(data.feeOrderStatusValue==="settled")
					   {
						  // $('#verifyBtn').show();
						   $('#createBtn').after('<button type="submit" class="btn btn-danger" id="verifyBtn">Verify Request</button>');
					   }else
						   {
						  
							$('#feeStatusText').show();
						   	
						   }
					   affidavit = result.data.affidavit;
					   loadDataOnPreview(result.data);
					   getStudentInfo(data.studentId);
					// if(result.data.approvalStatus!="SUBMITTED"){
					//	  $("#verifyBtn").hide();
					// }
                    					 
					// $('#collapseExample').show();
					 
				   },
			   		error:function(err)
			   		{
			   		  toastr.error("Failed to load Certificate details");
			   		}
				 });
			});
}
		
	
		/**
		*Verify Form Submit
		*
		**/
		$('#verifyForm').submit(function(e){
			e.preventDefault();
			var data = {"appType":"VERIFIED","certificatesId":certificateId};
			var msg  = {
					title : "Save",
					msg : " Are you sure to verify?"
					}
			ConfirmDialog(msg,"SAVE").then( function(response){
				$.ajax({
					   type: "POST",
					   url:  BASE_URL +"changeApprovalStatus",
					   data:JSON.stringify(data),
					   headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					   },		   
					   success: function(data)
					   {
						   $("html, body").animate({ scrollTop: 0 }, "slow");
						   $('#collapseExample').hide();	
						  // $('#certificateVerificationTbl').DataTable().ajax.reload();
						   loadDatatableWithPayment();
						   toastr.success(data.message);
					   },
					   error: function(data)
					   {
						   toastr.error(data.message);
					   }
					 });

				},function(error){

			});
		
		});
		
		
		function loadDatatableWithPayment()
		{
			$('#certificateVerificationTbl').DataTable().destroy();
			var url = BASE_URL +"getAllCertificateRequests/SUBMITTED";
			 var datawithPayment =  loadData(url);			    
			 loadDatatable(datawithPayment);
		}
	
		$("#affidavitUrl").on('click',function(){
			console.log(affidavit)
			openCertificates(affidavit);
		})
});
