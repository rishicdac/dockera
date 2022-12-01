$( document ).ready(function() {
	var BASE_URL = "certificate-management/api/v1/academics/certificate-management/";
	getCertificateType();
	$("#certType").change(
			function() {
				
				getCertificateNames($(
				"#certType option:selected").val());
			});
	/**
	 * To list the Certificate Types
	 */

	function getCertificateType() {

		$
				.ajax({
					url : '/fees/getCertificateTypes',
					method : 'GET',
					success : function(data) {
						setUpDropDown("certType", data,
								"sfsFeeHeadGroupId",
								"sfsFeeHeadGroupName");

					},
					error : function(err) {
						toastr
								.error("Failed to load Certificate Types");
					}
				});
	}

	/**
	 * To list the Certificate Names
	 */
	function getCertificateNames(type) {

		$.ajax({
			url : 'fees/getCertificatesByCertTypeID',
			method : 'GET',
			data : {
				"groupId" : type
			},
			success : function(data) {
				setUpDropDown("cert", data, "sfsFeeHeadId",
						"sfsFeeHeadName");

			},
			error : function(err) {
				toastr.error("Failed to load Certificates");
			}
		});
	}
    	
	var mapTable =  $('#certificatesTbl').DataTable({
		 "language": {
             "emptyTable": "No data available "
           },
			"destroy": true,
		   "ajax": BASE_URL +"getCertificateMapping" ,
		 	"columns": [
			
			{ "data": "certName" },
			{ "data": "mappedName" },
			] 
			
		});
		
	
	$("#map_btn").click(function(){
		  save($('select[name=certType] option:selected').text(),$('select[name=certMappedTypes] option:selected').text(),$("#certType").val());
		});
	
	$("#map1_btn").click(function(){
		  save($('select[name=cert] option:selected').text(),$('select[name=certMapped] option:selected').text(),$("#cert").val());
		});
	
	
	function save(certName,mappedName, mappedId){
		var mapping = {};
		mapping.certName = mappedName;
		mapping.mappedId = parseInt(mappedId);
		mapping.mappedName = certName;
		console.log(certName + "   " +mappedName + " "+mappedId);
		$.ajax({
			   type: "POST",
			   url:  BASE_URL + "saveCertificateMapping",
			   data: JSON.stringify(mapping),
			   async:false,
			   headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			   },		   
			   success: function(result)
			   {
				
				   toastr.success("Mapped Certificate details");
				   $('#certificatesTbl').DataTable().ajax.reload();
			   },
		   		error:function(err)
		   		{
		   		  toastr.error("Failed to get issued Certificate details");
		   		}
			 });
		
		
	}
			
});
