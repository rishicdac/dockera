$( document ).ready(function() {
  

  var scheduleDataTable;
  var scheduleId;
  var activeScheduleId;
 
 
  $('#selectSemester').unbind().bind('change',function(){
	
	   var program = $( "#selectProgram option:selected" ).val();
	   var batch = $( "#selectBatch option:selected" ).val();
	   var semester = $( "#selectSemester option:selected" ).val();

	   $.ajax({
   	   	   "url": BASE_URL+"schedule/list",
		   "type":"POST",
		    "data":{"program":program,"batch":batch,"semester":semester},
	   		success: function(data)
	   		{
	   		    var examDetails = data.data;
	   		  	
	   		 setUpDropDown("selectExamName",examDetails,"id","name_exam");
	   		   
	   		   
	   		},
	   		error:function(err)
	   		{
	   			showMessage(err);
	   		}
       });
	});

  
  /*
   * load revaluation details
   */ 
   $('#formRevaluation').submit(function (event) {
          event.preventDefault();
     
   	   		  	
   	   	       bindDetails();
   	   		   
   	   		
   	});
  
   /*
    * bind the schedule and revaluation details
    */   
   function bindDetails()
   {
	   var scheduleId = $( "#selectExamName option:selected" ).val();
   	   var evalType = $( "#selectEvalType option:selected" ).val();
   	   
	   
		$("#divRevaluation").show();
	 	var statusDataTable =  $('#tblRevaluation').DataTable({
	           "language": {
                    "emptyTable": "Revaluation/ Scrutiny Schedule not found  for the selected exam name"
                  },
			"processing": true,
			"destroy": true,
			"ajax":BASE_URL+"revaluation/list/schedule-id/"+scheduleId,
			"columns": [
			{ "data": "examName" },
			{ "data": "evalTypeName"},
		    { "data": "lastDateApply","render": function(data){return moment(data).format('DD-MM-YYYY')}},
		    {"data":"status"},
			{"data":"approvalStatus"},
			
		
			{
				"data": null,
				"render":function (data, type, full, meta) {
					console.log(full.approval_status)
					if(full.approvalStatus === "APPROVED")
							return '<i class="fas fa-edit text-primary" id="btnEdit"></i>';
							
					else
						return null;
								
				}
			}
		]
		});
		
	 	
	 	
	
		  $('#tblRevaluation tbody').on('click', '#btnEdit', function () {
	 	      
	 	      var data = statusDataTable.row($(this).parents('tr')).data();
	 	     $(this).removeClass().addClass("fas fa-edit text-primary");
	    	 $(this).removeClass().addClass("fa fa-save text-primary").attr("id","saveIcon");	
		        var $row = $(this).closest("tr").off("mousedown");
		        var $columns = $row.find("td").not(':first').not(':last').not(':nth-child(2)');
		
		        $.each($columns, function(i, el) {
		        	
		             if(i==1)
		        	 
		        	 {	        	 
		        	  $(this).html("").append('<input type="checkbox" '+(data.status == 'ACTIVE'? 'checked' : '')+'>');
		        	 }
		        });
	 	  	
	 	 	
	 	  });
		  /*
		   *  Action function to update the condonation list 
		   */
		    $('#tblRevaluation tbody').on('click', '#saveIcon', function () {
		    	
		    	var data = statusDataTable.row($(this).parents('tr')).data();
		    	
		      	 $(this).removeClass().addClass("fa fa-save text-primary");
		    	  $(this).removeClass().addClass("fas fa-edit text-primary").attr("id","btnEdit");
		          var $row = $(this).closest("tr");
		          var $columns = $row.find("td").not(':first').not(':last').not(':nth-child(2)');
		          var txt;
		          $.each($columns, function(i, el) {
			        
			          if(i==1){
			        	 
			        	 var  chk = $(this).find("input[type='checkbox']").is(':checked');
			        	 if(chk){  txt = "ACTIVE";}
			        	 else 
			        	 txt="IN ACTIVE";
			        	 $(this).html(txt);
			        	 $('#tblRevaluation').dataTable().fnUpdate(txt, [$row], $(this), false); 
			        	
			        	 
			        	 }
			        });
		          saveActiveStatus(data.id,txt);
		       //   $('#tblRevaluation').DataTable().ajax.reload();
		    });
		    

   }

	
	/**
	* function to save status on change
	*/
	
	function saveActiveStatus(id,txt){
	 
	   $.ajax(
		   		{
		   			url:BASE_URL+"revaluation/schedule/update/status",
		   			method:"POST",
		   		    data:{"id":id,"status":txt},
		   			success:function(data){
	   			
		   		  		toastr.success("Schedule updated Successfully");
		   		 			 $('#tblRevaluation').DataTable().ajax.reload();
		   		
			   			
		   			},
			   		error:function(err)
			   		{
			   			toastr.error("Updating revaluation schedule  status failed !!");
			   			 			
			   		}
		   		});	
 
}
	   
   

   



});
