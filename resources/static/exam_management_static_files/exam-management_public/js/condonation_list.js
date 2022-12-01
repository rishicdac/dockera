$(document).ready(function() {
 
   $("#condonationList").hide();
 
   
  /*
  * load condoantion list
  */ 
  $('#formCondonationList').submit(function (event) {
         event.preventDefault();
          $("#condonationList").show();
          loadCondonationList();
   });
    
  
   
   
   var condonationList = {};
   
   /*
   *  Function to load the condonation list which satisfies the criteria 
   */
   function loadCondonationList(){ 
      var condonationListDataTable =  $('#tblCondonationList').DataTable({
            "language": {
                    "emptyTable": "No students found satisfying your criteria"
                  },
			"processing": true,
			"destroy": true,
			"ajax":{ 
			   "url":"/academic/getSemesterwiseCondonationList", 
			   "data":{"program":$('#selectProgram').val(),"batch":$('#selectBatch').val(),"sem":$('#selectSemester').val(),"minAttendence":$('#minAttendence').val()},
			   "dataSrc":function (data) {
			   
			       if(data == null){
			         data = [];
			         }
			         condonationList = data;
			        return data; 
			        
			     }  
			  
			    },
			"columns": [
			{ "data": "studentId"},
			{ "data": "studentName" },
			{ "data": "null",
	            "render": function (data, type, full, meta) {
	            
	                    return (full.programName + " / " + full.batchName + " / " + full.semester)   
	            
	            }
			          		            
			  },   
			{ "data": "attendancePercentage" }
							
		]
				
		});
    }
    
    
    
    /**
	 Generate condonation list 
	**/
	
    $("#btnGenerateList").click(function(){
            
          var msg = {
					 title : "Save",
					 msg : " Do you want to generate condonation list?"
				}
		  ConfirmDialog(msg, "SAVE").then(function(response) {
							
					saveCondonationList();
									
			}, function(error) {
					
				toastr.error("Condonation list generation cancelled !!");
					
			});
							
  
       });
       
    	/**
		 * store  condonation list 
  		**/
      
      function saveCondonationList()
      {
           var condonationArr = [];
           var jsonData = condonationList;
         
		   for (var i = 0; i < jsonData.length; i++) {
		      var list = jsonData[i];
			  condonationArr.push({
			        studentId:list.studentId ,
			        studentName: list.studentName,
			        percentage: list.attendancePercentage ,
			        programId:list.programId ,
			        program:list.programName ,
			        batchId:list.batchId ,
			        batch:list.batchName ,
			        semester:list.semester 
       	       
			    });
			}
			                   
           var condonationJson = JSON.stringify(condonationArr); 
            $.ajax({
	   		url: BASE_URL+"condonation/generate",
	   		method: 'POST',
	   		async:false,
	   		data:condonationJson,
	   		contentType: "application/json",
	   		success: function(data)
	   		{
	   		   // showMessage("Generated Condonation list Successfully");
	   		   	toastr.success("Condonation list generated Successfully");
	   		   	  $("#condonationList").hide();
	   		  	   			
	   		},
	   		error:function(err)
	   		{
	   			//showMessage(err);
	   			toastr.error("Condonation list generation failed !!");
	   			 			
	   		},
	   		statusCode: {
                409: function() {
                   // alert('Resource Conflict');
                    //TO-DO
                    replaceCondonation(condonationJson);
                    
                   }
               }
	   	});	  
          
        }    
  

   /**
   * function to confirm for replace the existing program/batch/semester
   */
   
   function replaceCondonation(condonationJson){
          var msg = {
					 title : "Update",
					 msg : " Condonation list already exists !! Do you want to overwrite the list?"
				}
		  ConfirmDialog(msg, "SAVE").then(function(response) {
							
					replaceCondonationList(condonationJson);
									
			}, function(error) {
					
				toastr.error("Condonation list generation cancelled !!");
					
			});
   
   
   
   }
   
  /**
   * function to replace the existing program/batch/semester
   */
   
   function replaceCondonationList(condonationJson){
   
     $.ajax({
	   		url: BASE_URL+"condonation/replace",
	   		method: 'POST',
	   		async:false,
	   		data:condonationJson,
	   		contentType: "application/json",
	   		success: function(data)
	   		{
	   		   // showMessage("Generated Condonation list Successfully");
	   		   	toastr.success("Condonation list generated Successfully");
	   		   	  $("#condonationList").hide();
	   		  	   			
	   		},
	   		error:function(err)
	   		{
	   			//showMessage(err);
	   			toastr.error("Condonation list generation failed !!");
	   			 			
	   		}
	   	});	  
          
        }    
 




 });               