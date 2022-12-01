$( document ).ready(function() { 
	PopulateDatatable();
	$('#collapseExample').hide();	
	var affidavit;
	
});
/**
 * Initailize Datatable
 */
function PopulateDatatable()
{
	var allRequestsDatatable =  $('#allRequestsTbl').DataTable({
		 "language": {
            "emptyTable": "No data available"
          },
		"destroy": true,	
		"ajax":  BASE_URL + "getCertificatesWithPrintCount",			
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
				return "<button  class='btn btn-xs btn-primary print' id='view'> View</button>";
			}
		}]
	});
	
	/**
	 Print Button Click Event
	**/
	$('#allRequestsTbl tbody').on('click', '#view', function () {
		var data = allRequestsDatatable.row($(this).parents('tr')).data();
		certificateId = data.certId;							
		certificateDetailsOnPreview(certificateId);
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
			   getPrintingHistory(id);
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
			   $("#approvaldetailsTbl").append($('<thead><tr><th>Approval Type</th><th>Action Done By</th><th>Date</th></tr></thead>'));
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
Get Status - Print History
**/
function getPrintingHistory(certId)
{
	$("#printdetailsTbl tbody").remove();	
	$("#issuedetailsTbl tbody").remove();	
	$.ajax({
		   type: "GET",
		   url:  BASE_URL + "printAndIssueHistory/certificateId/"+certId,
		   headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		   },		   
		   success: function(result)
		   {
			   var issuedBy = result.data.issuedBy?result.data.issuedBy:'Not Issued';
			   var receivedBy = result.data.recievedBy?result.data.recievedBy:'----';
			   $("#issuedetailsTbl").empty();
			   $("#issuedetailsTbl").append($('<thead><tr><th>Issued By</th><th>Received By</th><th>Remarks</th></tr></thead>'));
			   $("#issuedetailsTbl").append($('<tbody><tr><td>' +issuedBy+ '</td><td>' +receivedBy+ '</td><td>' +result.data.remarks+ '</td></tr></tbody>'));
			   
			   $("#printdetailsTbl").empty();
			   $("#printdetailsTbl").append($('<thead><tr><th>Print No.</th><th>Printed By</th><th>Remarks</th></tr></thead>'));
			   $.each(result.data.remarklist, function (key, value) {
					if(value.modifiedBy===null)
						$("#printdetailsTbl").append($('<tbody><tr><td>' +value.noPrint+ '</td><td>' +result.data.generatedBy+ '</td><td>---</td></tr></tbody>'));
					else
						$("#printdetailsTbl").append($('<tbody><tr><td>' +value.noPrint+ '</td><td>' +value.modifiedBy+ '</td><td>' +value.rePrintRemark+ '</td></tr></tbody>'));
			   });
		   },
	   		error:function(err)
	   		{
	   		 toastr.error("Failed to load approval history");
	   		}
		 });
}
$("#affidavitUrl").on('click',function(){
	console.log(affidavit)
	openCertificates(affidavit);
})