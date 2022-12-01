$( document ).ready(function() {
	
    var loggedStudentId = $("#usercode").val();
var affidavit;
    $('#collapseExample').hide();
    var url = BASE_URL +"getAllCertificateRequestsWithStatus/";
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
			{ "data": "status"},
			{
				"data": null,
				"defaultContent":
					'<a data-toggle="collapse" href="#"  class="small-box-footer text-danger" id="detailsButton">More info <i class="fas fa-arrow-circle-down"></i></a>' 
			}] 
			
		});
		
		$('#certificateStatusTbl tbody').on('click', '#detailsButton', function () {
			
			var data = statusDataTable.row($(this).parents('tr')).data();
			
			var issuedDetails = getIssuedCertificateDetails(data.id);
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
					   affidavit = result.data.affidavit;
						console.log(result)
						console.log(affidavit)
					 loadDataOnPreview(result.data);
					 getStudentInfo(data.studentId);
					
					 
				   },
			   		error:function(err)
			   		{
			   		  toastr.error("Failed to load Certificate details");
			   		}
				 });
			 loadIssuerDetails(issuedDetails);
			});
    }
	
  
		
		$("#affidavitUrl").on('click',function(){
			console.log(affidavit)
			openCertificates(affidavit);
		})
		
		function loadIssuerDetails(data)
		{
			console.log(data)
			if(data.recievedBy!=null){
				$('#receivedBy').text(data.recievedBy);
				$('#receiveRemark').text(data.remarks);
				
			}else
				{
				$('#receivedBy').text("N.A");
				$('#receiveRemark').text("N.A");
				}
		}

		function getIssuedCertificateDetails(id)
		{
			var data;
			$.ajax({
				   type: "GET",
				   url:  BASE_URL + "getIssuedCertificateDetails/"+id,
				   async:false,
				   headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				   },		   
				   success: function(result)
				   {
					 data = result.data;
					
					 
				   },
			   		error:function(err)
			   		{
			   		  toastr.error("Failed to get issued Certificate details");
			   		}
				 });
			return data;
		}
		
			 
});
