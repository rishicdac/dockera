$( document ).ready(function() {
	
    var loggedStudentId = $("#usercode").val();

    $('#collapseExample').hide();
    var url = BASE_URL +"getAllCertificateRequestsWithStatus/"+loggedStudentId;
   var datawithPayment =  loadData(url);
    
   loadDatatable(datawithPayment);

    function loadDatatable(data){
    	
	var statusDataTable =  $('#certificateStatusTbl').DataTable({
		 "language": {
             "emptyTable": "No data available "
           },
			"destroy": true,
		//	"ajax": BASE_URL +"getAllCertificateRequestsWithStatus/"+loggedStudentId,
			  "data": data,
			"columns": [
			{ "data": "createdTime" ,"render": function(data){return moment(data).format('D/MM/YYYY')}},//$.fn.dataTable.render.moment(  'x', 'Do MMM YY' )  }, //"render": $.fn.dataTable.render.moment( 'DD/MM/YYYY' )},
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
		
		$('#certificateStatusTbl tbody').on('click', '#detailsButton', function () {
			var data = statusDataTable.row($(this).parents('tr')).data();
			$.ajax({
				   type: "GET",
				   url:  BASE_URL + "/getCertificateDetailsById/"+data.id,
				   headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				   },		   
				   success: function(result)
				   {
					 //loadCertificateDetails(result.data);
					 loadDataOnPreview(result.data);
					 getStudentInfo(data.studentId);
					 
					 
				   },
			   		error:function(err)
			   		{
			   		  toastr.error("Failed to load Certificate details");
			   		}
				 });
			});
    }
	
  
		
		$("#affidavitUrl").on('click',function(){
			openCertificates(certificateId);
		})


	
		
			 
});
