$(document).ready(function(){

var departments = [
		{
			"id": 31,
			"detailName": "DEPARTMENT OF LAW",
			"active": true,
			"enteredBy": null,
			"entryDate": null
		},
		{
			"id": 32,
			"detailName": " DEPARTMENT OF ECONOMICS",
			"active": true,
			"enteredBy": null,
			"entryDate": null
		}
	]
loadDepartments();
function loadDepartments(){
	
	
	$.ajax({
   		url:'/ems/getAllValidDept',
   		method:'GET',
   		success:function(data)
   		{
   		    setUpDropDown("deptselect",data,"dept_id","dept_name");
   			
   		},
   		error:function(err)
   		{
   		  toastr.error("Failed to load Departments");
   		}
   	});
}

$('#nodueDetails').hide();


var fdata=$('#depttbl').DataTable({
	 "language": {
         "emptyTable": "No data available for entry"
       },
	"destroy": true,
	"ajax":BASE_URL+"no-due-certificate-requests-student/",
	"columns":[
		{ "data": "requestDate","render": function(data){return moment(data).format('D/MM/YYYY')}}, /*"render": $.fn.dataTable.render.moment(  'x', 'Do MMM YY' ) */ 
		{"data":"studentId"},
		{"data":"departmentName"},
		{"data":"amount"},
		{
			"data": null,
			"defaultContent":
				'<button type="button" class="btn btn-info btn-sm" id="addbtn" >Add no-dues</button> '
		}
	]	
});
/**
	Reset Form
	**/
	function resetForm()
	{
		 $("#deptselect").prop("selectedIndex", 0);
		 $("#dueamt").val('');
		 $("#remarks").val('');
	}
	
	
	//Add No Dues Button click event to show modal
	$('#depttbl tbody').on('click', '#addbtn', function () {
			$('#nodueDetails').show();	
		    var data = fdata.row($(this).parents('tr')).data();
		    console.log(data);
		    certificateId = data.certificateId;
	});   
	/*
	 * No Due Form Submit
	 * 
	 */
	$('#nodueForm').submit(function (event) {
		event.preventDefault();
		var msg  = {
			title : "Save",
			msg : " Do you want to Save?"
			}
			ConfirmDialog(msg,"SAVE").then( function(response){
	
				  var formData = {
	             		  departmentName:$("#deptselect").find('option:selected').text(),
	  					  departmentId:$("#deptselect").val(),
	  					  certificateId:certificateId,
	                      dueAmount: $('#dueamt').val(),
	                      remarks: $('#remarks').val()
	                 }
				console.log(formData);
	             
					$.ajax({
	
	                     type: "POST",
	                     contentType: "application/json",
	                     url: BASE_URL+"no-due-by-department",
	                     data: JSON.stringify(formData),
	                     dataType: 'json',
	                     success: function (data) {
	                     toastr.success(data.message);
	                     	$('#depttbl').DataTable().ajax.reload();                                     	
							$('#nodueDetails').hide();	
							resetForm();
	                        $("html, body").animate({ scrollTop: 0 }, "slow"); 
	                     },
	                     error: function (error) {
	                        toastr.error(data.message);
	                     }
	              });
	
	
			},function(error){
	
			});    
		});
});