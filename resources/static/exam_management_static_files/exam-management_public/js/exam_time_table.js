$(document).ready(function() {

    $("#divTimetable").hide();
    $("#divExamTimetable").hide();
     $("#divTable").hide();
     $("#divEditTimetable").hide();
     
       var selectedExam;
       var selectedTimtableId;
       var scheduleId;
     
    var courseCode = [];
    
    if(courseCode.length == 0)
    {
     	$("#btnResetTimetable").hide();
     	$("#btnSubmitTimetable").hide();
     	
    
    }
    /* 
      To list all scheduled exams
	*/
	
		
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
	   		    $('#selectExamName').unbind().bind('change',function()
				  {
					    selectedExam = examDetails.find(item => {
			                  return item.id == $(this).val();
			            })
			               $("#divEditTimetable").hide();
			            scheduleId =$(this).val();
			           	CheckTimeTable(selectedExam, $(this).val());			
				  });
	   		   
	   		},
	   		error:function(err)
	   		{
	   			showMessage(err);
	   		}
	   	});
	   
	  }); 
	   
	   
	function getAllExamSchedules()
	{
	
		$.ajax({
	   		url: BASE_URL+"schedule/active-list",
	   		method: 'GET',
	   		success: function(data)
	   		{
	   		    var examDetails = data.data;
	   		    console.log(examDetails); 
	   		    
	   		 },
	   		error:function(err)
	   		{
	   			showMessage(err);
	   		}
	   	});
	}
	
	function CheckTimeTable(selectedExam,scheduleId){
	
	 
		    $.ajax({
	   		url: BASE_URL+"time-table/list-schedule-id/"+scheduleId,
	   		method: 'GET',
	   		success: function(data)
	   		{
	   		    var timetable = data.data;
	   		    
	   		      if(timetable.length <= 0)
	   		      {
	   		           $("#divTimetable").show();
		               getCourses( selectedExam);
		               $("#divExamTimetable").hide();
		               toastr.error("Time Table not found !!"); 
		          }
		          else
		          {
		           toastr.success("Time Table Already exists !!");
		          $("#divExamTimetable").show();
		           $("#divTimetable").hide();
		           $("#divTable").hide();
		          loadTimeTable(timetable);
		          }
	   		  	   			
	   		},
	   		error:function(err)
	   		{
	   			   toastr.error("Error in loading Time Table details!!"); 
	   		}
	   	});     
	
	
	}
	
    /**
	 * Load time table on change of the exam name
	 *
	 **/
	 
	 function loadTimeTable(data)
	 {
	 
	 var nEditing = null;
	 $("#divExamTimetable").show();
	 var statusDataTable =  $('#tblExamTimetable').DataTable({
            "language": {
                    "emptyTable": "No data available for the selected exam name"
                  },
			"processing": true,
			"bSort" : false,
			"destroy": true,
			"data":data,
		//	"ajax": BASE_URL+"time-table/list-schedule-id/"+$(this).val(),
			"columns": [
		
			{ "data": "courseId" },
			{ "data": "courseName"},
			{ "data": "examDate" , "render": function(data){return moment(data).format('DD-MM-YYYY')}},
			{ "data": "examDate" , "render": function(data){return  moment(data).format('dddd') }},
			{ "data": "startDateTime" },//,"render": function(data){return moment(data, ["HH.mm"]).format("hh:mm A") }},
			{ "data": "endDateTime" },//"render": function(data){return moment(data, ["HH.mm"]).format("hh:mm A") }},
				{
				"data": null,
				 "render": function (data, type, full, meta) {
		            if(full.approvalStatus == "APPROVED")
		              return "APPROVED";
		            else  
					  return '<a data-toggle="collapse" href="#"  class="edit small-box-footer" id="btnEdit"> <i class="fa fa-edit"></i></a>' 
				}	
			}
		]
		
		});
		
		
	    
     $('#tblExamTimetable tbody').on('click', '#btnEdit', function () {
      
        

            var data = statusDataTable.row($(this).parents('tr')).data();
            $("#divEditTimetable").show();
            getCourses(selectedExam);
            selectedTimtableId = data.id;
           
            $("#editExamDate").val(moment(data.examDate).format('D-MM-YYYY'));
            $("#editStartDateTime").val(data.startDateTime);
            $("#editEndDateTime").val(data.endDateTime);
            $("#selectEditCourse").val(data.courseId).trigger("change");
         	$('html, body').animate({
		        scrollTop: $("#divEditTimetable").offset().top
		  }, 1000);
           
     });
   
	 $('#tblExamTimetable tbody').on( 'click', 'tr', function () {
	
	        if ( $(this).hasClass('selected') ) {
	            $(this).removeClass('selected');
	        }
	        else {
	            statusDataTable.$('tr.selected').removeClass('selected');
	            $(this).addClass('selected');
	        }
	    } );

	}
	/**
	 *  Get courses for the selected program, batch and sem 
	 */			
	   			
	function getCourses(selectedExam)
	{

	  var program = selectedExam.program; 
      var batch = selectedExam.batch;
      var semester = selectedExam.semester;
      $.ajax({
	   		url: "academic/getValidCourseSemMappingsV2",
	   		method: 'GET',
	   		data:{"program":program,"batch":batch,"sem":semester},
	   		async:false,
	   		success: function(data)
	   		{
	   		    setUpDropDown("selectCourse",data,"course_code","course_name");
	   		    setUpDropDown("selectEditCourse",data,"course_code","course_name");
	   		  	   			
	   		},
	   		error:function(err)
	   		{
	   			showMessage(err);
	   		}
	   	});
	 }
	 
	 /**
	 *  Button click event to add course to timetable 
	 */
 $('#frmAddCourse').submit(function (event) {
      event.preventDefault();
     
	 console.log(courseCode);
	 $("#divTable").show();
	 
	 if( $("#endDateTime").val() <  $("#startDateTime").val())
	 {
	   toastr.error("Start time is greater than end time  !!");
	 }
	 else if(courseCode.includes($("#selectCourse" ).val().replace(/\s+/g, "-")))
	   {
	       toastr.error("Course already added !!");
	   }
	   else{
	        courseCode.push($("#selectCourse" ).val().replace(/\s+/g, "-") );
  			 var html = "<tr id="+$("#selectCourse" ).val().replace(/\s+/g, "-") +"><td>"+$("#selectCourse" ).val()+"</td><td>"+$("#selectCourse option:selected" ).text()+"</td><td>"+ $("#examDate").val()+"</td><td>"+ moment($("#startDateTime").val(), ["HH.mm"]).format("hh:mm A")+"</td><td>"+ moment($("#endDateTime").val(), ["HH.mm"]).format("hh:mm A")+"</td> <td><i class='fas fa-trash-alt text-danger remove' style='cursor: pointer;'></i> </td></tr>"; 
             //$('#timeTable tr:last').after(html);
               $('#tbody').append(html); 
             	$("#frmAddCourse")[0].reset(); 
        }
      if(courseCode.length > 0)
      {
     	$("#btnResetTimetable").show();
     	$("#btnSubmitTimetable").show();
        }
                
	});
	
	
	 /**
	 *  Button click event to edit timetable 
	 */
 $('#frmEditTimetable').submit(function (event) {
      event.preventDefault();
     
	 var data={};
	
	 data.id = selectedTimtableId;
	 data.courseId = $("#selectEditCourse" ).val();
	 data.courseName = $("#selectEditCourse  option:selected" ).text();
	 data.examDate = moment($("#editExamDate").val(),'D-MM-YYYY').format('YYYY-MM-D')
	 data.startDateTime = moment($("#editStartDateTime").val(), ["HH.mm"]).format("hh:mm A");//$("#editStartDateTime").val();
	 data.endDateTime = moment($("#editEndDateTime").val(), ["HH.mm"]).format("hh:mm A");// $("#editEndDateTime").val();
	 data.scheduleId = scheduleId;
	 
	  var msg = { title : "Update",	 msg : " Do you want to update time table?"	}
      ConfirmDialog(msg, "UPDATE").then(function(response) {
							
				updateTimeTable(data);
									
			}, function(error) {
					
				toastr.error("Time table saving cancelled !!");
					
			});
			
				       
                
	});
	
	  /**
	 *  Table to json to add timetable to schedule 
	 */
	 $("#btnSubmitTimetable").click(function(){
	 
	 
	   var msg = {
					 title : "Save",
					 msg : " Do you want to save time table?"
				}
		  ConfirmDialog(msg, "SAVE").then(function(response) {
							
					saveTimeTable();
									
			}, function(error) {
					
				toastr.error("Time table saving cancelled !!");
					
			});
	});
		
		/**
		* save the timetable
		*/
		function saveTimeTable()
		{
			var table = document.getElementById("timeTable");
			var timeTableArr = [];
			
			if(table.rows.length != 1){
				for ( var i = 1; i < table.rows.length; i++ ) {
				    timeTableArr.push({
				        courseId:table.rows[i].cells[0].innerHTML ,
				        courseName: table.rows[i].cells[1].innerHTML,
				        examDate: moment(table.rows[i].cells[2].innerHTML,'D-MM-YYYY').format('YYYY-MM-DD'),
				        startDateTime: table.rows[i].cells[3].innerHTML,
				        endDateTime: table.rows[i].cells[4].innerHTML,
				        scheduleId: scheduleId
				       
				    });
				}
				addNewTimetable(timeTableArr);
			}
			else{
			toastr.error("Empty time table cannot be saved !!");
			
			}
          
    }
    
     /**
	 * Adding new timetable to schedule 
	 */
    function addNewTimetable(timeTableArr)
	{
      var timeTableJson = JSON.stringify(timeTableArr);
      $.ajax({
	   		url: BASE_URL+"time-table/create",
	   		method: 'POST',
	   		data:timeTableJson,
	   		contentType: "application/json",
	   		success: function(data)
	   		{
	   		  //showMessage("Schedule created Successfully");
	   		  toastr.success("Time table created successfully !!");
	   		      $("#divTimetable").hide();
	   		  	   			
	   		},
	   		error:function(err)
	   		{
	   			showMessage(err);
	   		}
	   	});
	 }
	 
	 /**
	 * Adding new timetable to schedule 
	 */
    function updateTimeTable(timeTable)
	{
      var timeTableJson = JSON.stringify(timeTable);
      $.ajax({
	   		url: BASE_URL+"time-table/update-id",
	   		method: 'POST',
	   		data:timeTableJson,
	   		contentType: "application/json",
	   		success: function(data)
	   		{
	   		  //showMessage("Schedule created Successfully");
	   		 // $('#tblExamTimetable').DataTable().ajax.reload();
	   		 CheckTimeTable(selectedExam,scheduleId)
	   		  toastr.success("Time table updated successfully !!");
	   		      $("#divEditTimetable").hide();
	   		   
	   		  	   			
	   		},
	   		error:function(err)
	   		{
	   			showMessage(err);
	   		}
	   	});
	 }
	 
	 
	$('#tbody').on('click', '.remove', function () { 
		  
		  
		    // Getting all the rows next to the  
		    // row containing the clicked button 
		    var child = $(this).closest('tr').nextAll(); 
		  
		    console.log(courseCode);
		    console.log($(this).closest('tr').attr('id'));
		    console.log($.inArray($(this).closest('tr').attr('id'), courseCode));
		    
		    courseCode.splice( $.inArray($(this).closest('tr').attr('id'), courseCode), 1 );
		    console.log(courseCode);
		    
		    
		    // Iterating across all the rows  
		    // obtained to change the index 
		    child.each(function () { 
		          
		        // Getting <tr> id. 
		      //  var id = $(this).attr('id'); 
		
		       
			    
		        // Getting the <p> inside the .row-index class. 
		    //    var idx = $(this).children('.row-index').children('p'); 
		  
		        // Gets the row number from <tr> id. 
		      //  var dig = parseInt(id.substring(1)); 
		  
		        // Modifying row index. 
		       // idx.html(`Row ${dig - 1}`); 
		  
		        // Modifying row id. 
		      //  $(this).attr('id', `R${dig - 1}`); 
		    }); 
		  
		   
		   
		    // Removing the current row. 
		    $(this).closest('tr').remove(); 
		  
		
		}); 
      
      
      
     
	
	});