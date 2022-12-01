$(document).ready(function() {

	//getAllExamSchedule();
    $("#divExamTimetable").hide();
    var loggedStudentId = $("#usercode").val();
    getStudentInfo();
	  
    /**
 	* To load loggedin student details
 	*/
    function getStudentInfo()
	{
        $.ajax({
	   		url: "students/getStudentsDetails-V3",
	   		method: 'GET',
	   		async:false,
	   		data:{"userCodes":loggedStudentId},
	   		success: function(data)
	   		{
	   		  studentData = data[loggedStudentId];
	   		 
	   		studentProgram = studentData.programCode;
			 studentBatch = studentData.batchCode;
			 getAllActiveSemesterOfBatch(studentBatch);
               
              },
	   		error:function(err)
	   		{
	   			showMessage(err);
	   		}
	   	});
        
	}
 	 
 	 /**
	  To get all semesters the given batchid
	  */
	 function getAllActiveSemesterOfBatch(batchId)
	 {
		//$("#selectSemester").prop( "disabled", false );
		  $.ajax({
					"url" : "/batch/getAllSemestersInABatch",
					"method" : "GET",
					data : {"batchId":batchId},
					success :function(data) {
					console.log(data);
					    try{
						   if(data && data.length >0){
							   $('#selectSemester').empty();
							   $('#selectSemester').append('<option>Select Semester</option>');
							   for(var i=0;i< data.length;i++){
							   	   $("#selectSemester").append('<option value='+data[i]['semesterIdentity']['semesterCode']+'>'+data[i]['semesterIdentity']['semesterCode']+'</option>');
							   }
						 }
						}
						catch(e){
						    console.error(e);
						    showMessage(" Error occurred while processing semester list"); 
						}
													
						
					},
					error :function(e) {
					     showMessage(err);
					}
				});
		}
 	 
    /* 
      To list all scheduled exams
	*/
	
	$('#selectSemester').unbind().bind('change',function(){
	   
	 //  var program = $( "#selectProgram option:selected" ).val();
	 //  var batch = $( "#selectBatch option:selected" ).val();
	  var program =studentProgram;
	  var batch = studentBatch;
	  var semester = $( "#selectSemester option:selected" ).val();
	   $.ajax({
	   	   	   "url": BASE_URL+"schedule/list",
			   "type":"POST",
			    "data":{"program":program,"batch":batch,"semester":semester},
	   		success: function(data)
	   		{
	   		    var examDetails = data.data;
	   		  	
	   		   setUpDropDown("selectExamNameTimetable",examDetails,"id","name_exam");
	   		   
	   		   
	   		},
	   		error:function(err)
	   		{
	   			showMessage(err);
	   		}
	   	});
	   
	  }); 
	   
	   

	
    /**
	 * Load time table on change of the exam name
	 *
	 **/
	 
	 $('#selectExamNameTimetable').unbind().bind('change',function()
	 {
	   		$("#divExamTimetable").show();
	 	var statusDataTable =  $('#tblExamTimetable').DataTable({
	 	/* dom: 'Bfrtip',
	 	 buttons: [ 
            { 
                     extend: 'print',
                title:'Time table - '+$("#selectExamNameTimetable option:selected").text(), 
                     customize: function ( win ) {
                        $(win.document.body).find('h1').css('text-align', 'center');
                        $(win.document.body).css( 'font-size', '8px' );
                        $(win.document.body).find( 'table' )
                        .addClass( 'compact' )
                        .css( 'font-size', 'inherit' );
                }
            },
               { 
                     extend: 'pdf',
                      title:'Time table - '+$("#selectExamNameTimetable option:selected").text()
                                
                           
          }  ],*/
            "language": {
                    "emptyTable": "No time table available for the selected exam name"
                  },
			"processing": true,
			"bSort" : false,
			"destroy": true,
			"ajax": BASE_URL+"time-table/list-schedule-id/approved/"+$(this).val(),
			"columns": [
			{ "data": "examDate" , "render": function(data){return moment(data).format('DD/MM/YYYY')}},
			{ "data": "courseId" },
			{ "data": "courseName"},
		
			{ "data": "examDate" , "render": function(data){return  moment(data).format('dddd') }},
			{ "data": "startDateTime" },//"render": function(data){return moment(data, ["HH.mm"]).format("hh:mm A") }},
			{ "data": "endDateTime" },//"render": function(data){return moment(data, ["HH.mm"]).format("hh:mm A") }},
		]
		});
		
	  });
});