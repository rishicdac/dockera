var types;

$(document).ready(function() {

	getAllPrograms();
	getAllAcademicYear();
	
	 /* 
    	To Evaluation Types
	*/
	function loadEvaluationypes(programId){
		
        $.ajax(
        {
              "url":MARKS_CONFIG_URL+programId,
              success:function(data)
              {
                     types= data.data;
                     setUpDropDown("selectRevaluationType",types,"id","evaluationType");
              }
        });
	}

    /* 
      To list the programs
	*/
	
	function getAllPrograms()
	{
	
		$.ajax({
	   		url:'/course/getAllCourses',
	   		method:'GET',
	   		success:function(data)
	   		{
	   		    setUpDropDown("selectProgram",data,"courseId","courseCode");
	   			$('#selectProgram').unbind().bind('change',function()
	   			{
	   			
	   				getAllActiveBatchesOfProgram($(this).val());
	   				loadEvaluationypes($(this).val());
	   				
	   			});
	   		},
	   		error:function(err)
	   		{
	   			showMessage(err);
	   		}
	   	});
		
	}
	
	/**
	  To get all batches for the given programid
	*/
	 function getAllActiveBatchesOfProgram(programId)
	 {
	// $("#selectBatch").prop( "disabled", false );
		$.ajax(
		{
	  		url:'/batch/getAllActiveBatchesInAProgram',
	  	   	method:'GET',
	  	   	data:{"courseId":programId},
	  	   	success:function(data)
	  	   	{	  	   	
	  	        setUpDropDown("selectBatch",data,"batchId","batchCode");
	  	   		$('#selectBatch').unbind().bind('change',function()
	   			{	  	   			
	  	   			getAllActiveSemesterOfBatch($(this).val());	  
	  	   			getStudentList();
	   			});	  	   		
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
							   $('#selectSemester').append('<option selected disabled>Select</option>');
							   for(var i=0;i< data.length;i++){
							   	   $("#selectSemester").append('<option value='+data[i]['semesterIdentity']['semesterCode']+'>'+data[i]['semesterIdentity']['semesterCode']+'</option>');
							   }
						      }  		
						   		
							}
							catch(e){
							    console.error(e);
							    showMessage(" Error occurred while processing semester list"); 
							}
							$('#selectSemester').unbind().bind('change',function()
						   	{	
								var program = $( "#selectProgram option:selected" ).val();
								getCourses();	
								getVivaType();
								getExamTypes(program,batchId,$(this).val());
						   	});
							
					},
					error :function(e) {
					     showMessage(err);
					}
				});
		} 
	 /**
	  * To get Exam Names
	  */
	 function getExamTypes(program,batch,semester)
	 {
		 $.ajax({
             "url": EXAM_NAME_URL+"schedule/list",
             "type":"POST",
             "data":{"program":program,"batch":batch,"semester":semester},
             success: function(data)
             {
              var examDetails = data.data;    
             setUpDropDown("selectExamType",examDetails,"id","name_exam");
             },
             error:function(err)
             {
            	 showMessage(err);
             }
		 });
	 }
	 
	  /**
	  To get Courses under program
	  */
	 function getCourses()
	 {

		 var program = $('#selectProgram').val();
		 var batch = $('#selectBatch').val();
		 var semester = $('#selectSemester').val();
		
		 console.log(semester)
		 $.ajax({
			 url: "academic/getValidCourseSemMappingsV2",
			 method: 'GET',
			 data:{"program":program,"batch":batch,"sem":semester},
			 async:false,
			 success: function(data)
			 {
			 setUpDropDown("selectCourse",data,"course_code","course_name");		
			 },
			 error:function(err)
			 {
			 showMessage(err);
			 }
		 });
	 }
	  /**
	  To get Academic Year
	  */
	 function getAllAcademicYear()
		{
		
			$.ajax({
		   		url:'academics/api/v1/academics/getDetailsByMasterId/masterId/83',
		   		//url:'nualsTest/api/v1/academics/getDetailsByMasterId/masterId/83',
		   		method:'GET',
		   		success:function(data)
		   		{
		   		    setUpDropDown("selectAcademicYear",data,"detailName","detailName");
		   			
		   		},
		   		error:function(err)
		   		{
		   			showMessage(err);
		   		}
		   	});
		}
	
	 /**
	  To get Viva Type
	  */
	 function getVivaType()
		{
		  
			$.ajax({
		   		url:'/academic/getValidCourseSemMappingsWithOtherCourses',
		   		method:'GET',
		   		data:{"program":$('#selectProgram').val(),"batch":$('#selectBatch').val(),"sem":$('#selectSemester').val()},
		   		success:function(data)
		   		{
		   			console.log(data);
		   		    setUpDropDown("selectVivatype",data[1],"other_course_code","other_course_name");
		   			
		   		},
		   		error:function(err)
		   		{
		   			showMessage(err);
		   		}
		   	});
		}

});
/**
To get Student List
*/
function getStudentList()
{
	 var studentList;
	 $.ajax({
	   		url:'/students/getStudentsDetailsByProgramAndBatch-V2',
	   		method:'GET',
	   		data:{"programId":$('#selectProgram').val(),"batchId":$('#selectBatch').val()},
	   		async: false,
	   		success:function(data)
	   		{
	   			//console.log(data);	   			
	   			studentList = jQuery.map(data, function(val, index) { 
	                return { 
	                    "studentId":val.studentCode,
	                    "studentCode":val.regNo,
	                    "studentName": val.studentName,
	                    "report":0,
	                    "viva":0,
	                    "isPresent":true
	                }; 
	            }) 
	            setUpDropDown("selectStudent",studentList,"studentId","studentCode");
	   		},
	   		error:function(err)
	   		{
	   			showMessage(err);
	   		}
	   	});
	return studentList;
}

/**
 * Add Student 
 * 
 */

function AddStudentRegNo(studentList,studentDetails)
{	
	console.log(studentList);
	console.log(studentDetails);
	 $.each(studentList, function(i, el) {		 
		 $.each(studentDetails, function(i, sd) {
			 //console.log(el);
			// console.log(sd);
			 //console.log(el.student_id+"---"+sd.studentCode);
			// console.log(el.studentId+"---"+sd.studentCode);
			if(parseInt(el.student_id) === parseInt(sd.studentId) || parseInt(el.studentId) === parseInt(sd.studentId) )
				{
					el.studentCode = sd.studentCode;//Register Number
				}
		 })
	 })
	 console.log(studentList);
	 return studentList;
}