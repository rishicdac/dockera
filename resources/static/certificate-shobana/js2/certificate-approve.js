$( document ).ready(function() {
    $('#collapseExample').hide();
	
	var certificateId = 0;
	loadDatatableWithPayment();
	   
	    function loadDatatable(data){
	    	
	    
	var approveDataTable =  $('#certificateApproveTbl').DataTable({
		 "language": {
             "emptyTable": "No data available for the verification"
           },
		//	"processing": true,
			"destroy": true,
			"data":data,
			"columns": [
			{ "data": "createdTime" , "render": function(data){return moment(data).format('D/MM/YYYY')}},	
			{ "data": "createdBy"},
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
		
		$('#certificateApproveTbl tbody').on('click', '#detailsButton', function () {
			var data = approveDataTable.row($('#certificateApproveTbl tbody').parents('tr')).data();
			certificateId = data.id;
			
			$.ajax({
				   type: "GET",
				   url:BASE_URL +"getCertificateDetailsById/"+data.id,
				   headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				   },		   
				   success: function(result)
				   {
					   loadDataOnPreview(result.data);
					   getStudentInfo(data.studentId);							 
					   $('#collapseExample').show();
					 
				   },
			   		error:function(err)
			   		{
			   		 toastr.error("Failed to load certificate details");
			   		}
				 });
			});
	    }
		
		/**
		*Approve Form Submit
		*
		**/
		$('#approveForm').submit(function(e){
			e.preventDefault();
			var data = {"appType":"APPROVED","certificatesId":certificateId};
			
			var msg  = {
					title : "Save",
					msg : "Are you sure to approve?"
					}
					ConfirmDialog(msg,"SAVE").then( function(response){

						$.ajax({
							   type: "POST",
							   url: BASE_URL + "changeApprovalStatus",
							   data:JSON.stringify(data),
							   headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json'
							   },		   
							   success: function(data)
							   {
								   $("html, body").animate({ scrollTop: 0 }, "slow");
								   $('#collapseExample').hide();	
								  // $('#certificateApproveTbl').DataTable().ajax.reload();
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
			 var url =  BASE_URL +"getAllCertificateRequests/VERIFIED";
			 var datawithPayment =  loadData(url);			    
			 loadDatatable(datawithPayment);
		}
		
		$("#affidavitUrl").on('click',function(){
			openCertificates(certificateId);
		})
});
