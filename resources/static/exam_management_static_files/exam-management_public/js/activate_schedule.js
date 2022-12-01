$(document).ready(function() {

  
   

	loadAcademicYear();
	var scheduleDataTable;
	
	
	function loadAcademicYear(){
		$.ajax(
		{
			"url":ACADEMIC_YEAR_URL,
			//"url":"nualsTest/api/v1/academics/getDetailsByMasterId/masterId/83",
			success:function(data)
			{
				 
				setUpDropDown("selectAcademicYear",data,"id","detailName");
				
			}
		});
	
	}
 function loadExamSchedules(){
	 scheduleDataTable =  $('#tblExamSchedule').DataTable({
         "language": {
                 "emptyTable": "No data available for the selected program / batch / semester"
               },
			"processing": true,
			"destroy": true,
			"ajax":{ 
			    "url": BASE_URL+"schedule/month/year/list",
			    "type":"POST",
			     "data":{"academic_year": $("#selectAcademicYear option:selected" ).text(),"month_year":$("#monthYear").val()},
			    },
			"columns": [
			
			{ "data": "academic_year" },
			{ "data": "name_exam"},
			{ "data": "month_year" },//,"render": $.fn.dataTable.render.moment('Do MMM YY' )
		//	{ "data": "tentative_date"},
		   {"data":"status"},
		    {"data":"approval_status"},
		    
			
			{
				"data": null,
				"render":function (data, type, full, meta) {
					console.log(full.approval_status)
					if(full.approval_status === "APPROVED")
							return '<i class="fas fa-edit text-primary" id="btnEdit"></i>';
							
					else
						return null;
								
				}
					 
			},
			
		]
		
		});
	 
 
	    /*
		   *  Action function to update the condonation list 
		   */
		    $('#tblExamSchedule tbody').on('click', '#btnEdit', function () {
		    	var data = scheduleDataTable.row($(this).parents('tr')).data();
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
			    $('#tblExamSchedule tbody').on('click', '#saveIcon', function () {
			    	
			    	var data = scheduleDataTable.row($(this).parents('tr')).data();
			    	
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
				        	 $('#tblExamSchedule').dataTable().fnUpdate(txt, [$row], $(this), false); 
				        	
				        	 
				        	 }
				        });
			       // alert(txt);
			          saveActiveStatus(data.id,txt);
			         
			    });
			    

 
 
 }
 /**
  * function to save status on change
  */
 
 function saveActiveStatus(id,txt){
	 
	   $.ajax(
		   		{
		   			url:BASE_URL+"schedule/update/status",
		   			method:"POST",
		   		    data:{"id":id,"status":txt},
		   			success:function(data){
	   			
		   		  		toastr.success("Schedule updatetd Successfully");
		   		 			 $('#tblExamSchedule').DataTable().ajax.reload();
		   		
			   			
		   			},
			   		error:function(err)
			   		{
			   			toastr.error("Saving Exam Schedule failed !!");
			   			 			
			   		}
		   		});	
	 
 }
 
 /**
  * function to load for exam schedule
  */
   $('#formActiveSchedule').unbind().bind('submit',function(event)
	{

   	event.preventDefault();
   	$("#divSchedules").show();
   	loadExamSchedules();
		
   	
	});
 });               