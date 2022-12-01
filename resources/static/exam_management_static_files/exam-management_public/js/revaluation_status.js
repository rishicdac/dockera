$(document).ready(function() {
 
    var studentData = {};
    var studentFullDetails ={};
    var loggedStudentId = $("#usercode").val();
    var courses;
    var selectedScheduleId;
   // getStudentInfo(loggedStudentId,make_base);
    StudentDetails();
    
    /*** initial setup **/
    var url = BASE_URL+"revaluation/registration/status/";
    datawithPayment =  loadData(url);
    loadExamNotifications(datawithPayment);

    

    var canvasLogo = document.getElementById('logo'),
    logo_context = canvasLogo.getContext('2d');
   
    make_logo();
   
    
    function make_logo()
    {
    
      base_image = new Image();
      
     base_image.src = "exam-management_proxy/exam-management_public/img/nuals.jpg";
      base_image.onload = function(){
        logo_context.drawImage(base_image, 0, 0);
      }
    }
    
    
     
    /**
    *  Get the logged in student details
    **/
         
   function getStudentInfo(scheduleData,regSubjects,callback)
	{
        $.ajax({
	   		url: "students/getStudentsDetails-V3",
	   		method: 'GET',
	   		async:false,
	   		data:{"userCodes":loggedStudentId},
	   		success: function(data)
	   		{
	   		  studentData = data[loggedStudentId];
	   	
	   	      	callback(scheduleData,regSubjects);	
	   		
               
              },
	   		error:function(err)
	   		{
	   			showMessage(err);
	   		}
	   	});
	   	
       
	   	//return studentData; 
	 }
	 
   
	  
   /**
	* To load loggedin student details
	*/
	 function StudentDetails()
	 {
	    
	      $.ajax({
		         url: "students/getStudentDetails",
		         data:{"studentAdmissionUserCode":loggedStudentId },
				 success: function(data)
		           {
					 //console.log(data);
					 studentFullDetails=data;
					
		           },
		           error:function(e)
					{
						//console.log("Error in calling ajax "+e);
						toastr.error("Error in getting student admission details ");
					}
		         });
	 }
	 
	 
	/**
    *  list active exam schedules
    **/
         
   function loadExamNotifications(data)
   {	
	   //console.log(data);
      var examNotificationsDataTable =  $('#tblExamHallTickets').DataTable({
            "language": {
                    "emptyTable": "Request for Revaluation / Scrutiny is not found !!"
                  },
			"processing": true,
			"destroy": true,
			"data":data,
			"columns": [
		    { "data": "academic_year"},
			{ "data": "null",
			            "render": function (data, type, full, meta) {
		                
		                    return (full.program + " / " + full.batch + " / " + full.semester)   
			            }
		      },
			{ "data": "name_exam" },
			{ "data": "exam_type" },
			{ "data": "evalTypeName" },
			{"data": "feeOrderStatusValue"}, // Payment status
		     {"data": "approvalStatus"},
			{
				"data": null,"render": function (data, type, full, meta) {
	                
					if(full.feeOrderStatusValue == 'settled')
                     return  '<a data-toggle="collapse" href="#"  class=""small-box-footer text-danger" id="btnEdit"> <i class="fas fa-print"></i></a>';
                    else
                    	 //return "Payment Pending";
                    	return  '<a data-toggle="collapse" href="#"  class=""small-box-footer text-danger" id="btnEdit"> <i class="fas fa-print"></i></a>';
				}	
			}
			]
		});
   
    
      $('#tblExamHallTickets tbody').on('click', '#btnEdit', function () {
    	     
          var scheduleData = examNotificationsDataTable.row($(this).parents('tr')).data();
         
         var regSubjects;
           
		   $.ajax({
		      url: BASE_URL+"registration/schedule/"+scheduleData.scheduleId+"/reval" +
		      		"-reg-id/"+scheduleData.id,
		      method: 'GET',
		      async:false,
		      success: function(data)
		      {
		     
		       regSubjects = data.data;
		       //generateRegistrationForm(scheduleData,regSubjects, generateRegistrationForm);
		       getStudentInfo(scheduleData,regSubjects, generateRegistrationForm);
		    // generateRegistrationForm(scheduleData,regSubjects);
		           },
		      error:function(err)
		      {
		      showMessage(err);
		      }
		      });
           
        //    generateHallTicket(data,regSubjects);
     
         });
         
         

    }
		

  
	
	


    /**
    Generate PDF Templates for registration form
    **/
    function generateRegistrationForm(data,regSubjects)
    {
    console.log(studentData);
	    var doc = new jsPDF("p", "mm", "a4");
	  	
	 //   var photoUrl = canvasPhoto.toDataURL('image/jpg');
	    var logoUrl = canvasLogo.toDataURL('image/jpg');
	   
	    doc.addImage(logoUrl,'jpg',90,5,30,20);
	
	    doc.setTextColor(0,0,0);
	    doc.setFont("Lucida Handwriting");
	    doc.setFontType("bold");
	    doc.setFontSize(14);
	    doc.text("THE NATIONAL UNIVERSITY OF ADVANCED LEGAL STUDIES (NUALS)",  18,32);
	    doc.setFontType("bold");
	    doc.setFontSize(12);
	    doc.text("Kochi - 683503",  90, 37);
	    doc.setFontType("bold");
	    doc.text("Application for " + data.name_exam +" Exam  - "+data.evalTypeName,  35,50);
	    doc.setFontSize(11);
	   
    
       doc.setFontType("bold");doc.text("Payment Status : "+data.feeOrderStatusValue,  80,65);
       doc.setFontType("normal");doc.text("Academic Year : ",  20,80); doc.setFontType("bold");doc.text(data.academic_year, 50, 80);
       doc.setFontType("normal");doc.text("Exam Name : ",  20,90);doc.setFontType("bold");doc.text(data.name_exam, 50, 90);
       doc.setFontType("normal");doc.text("Exam Type : ",   20,100); doc.setFontType("bold");doc.text(data.exam_type, 50,100);
       doc.setLineWidth(0.2);doc.line(10, 105, 200, 105);
       
       if(studentData.regNo == null) studentData.regNo ="NIL";
       doc.setFontType("normal"); doc.text("Register Number      : ",  20, 110);doc.setFontType("bold");doc.text(studentData.regNo,  60, 110);
       doc.setFontType("normal"); doc.text("Name of Candidate    : ",  20, 120); doc.setFontType("bold");doc.text(studentData.studentName, 60, 120);
   

       doc.setFontType("normal");doc.text("Programme : ",  20,130);doc.setFontType("bold");doc.text(data.program,45, 130);
       doc.setFontType("normal");doc.text("Batch : ",   90,130); doc.setFontType("bold");doc.text(data.batch, 105,130);
       doc.setFontType("normal");doc.text("Semester : ",  140,130); doc.setFontType("bold");doc.text(data.semester, 160, 130);

       doc.setFontType("bold");doc.text("Courses Applied for  : "+data.evalTypeName,  20,140);
       
       var head = [['Sl.no', 'Course Code', 'Course Name']]
       var rows = [];
       var i=1;
       var date, startTime, endTime, day;
       regSubjects.forEach(element => {
             	 
             temp = [i,element.courseId,element.courseName];
             rows.push(temp);
           
             i=i+1;
       
         });        

     doc.autoTable({head:head,   body:rows, margin: {top: 150,left:40}, columnWidth: 'wrap',  showHeader: 'everyPage',
	     tableLineColor: 200,  tableLineWidth: 0,columnStyles: {
	         0: { columnWidth: 50 },
	         1: { columnWidth: 50 },
	         2: { columnWidth: 50}
	       
	         
	         
      }, theme: 'grid',tableWidth: 150 });
             
      
     let tableY = doc.lastAutoTable.finalY; // The y position on the page
      
     doc.setFontType("normal");doc.text(20, tableY+10, "I here by declare that the entries made above are best of my knowledge");
     
      doc.setFontSize(10);
      doc.setFontType("normal"); doc.text("Signature of the Candidate : ",  20, tableY+20);
      doc.rect(70, tableY+15, 100, 10 );
    //  doc.setFontType("normal"); doc.text("Office of the National University Of Advanced Legal Studies",  20, tableY+20);
      doc.setFontSize(12);
      doc.setFontType("bold"); doc.text("Controller of Examinations",  120, tableY+70);
      doc.setFontSize(10);
      doc.setFontType("normal"); doc.text("Dated :", 20,tableY+35);

      doc.setFontType("normal"); doc.text("( The National University Of Advanced Legal Studies )", 100, tableY+75);

    


        window.open(doc.output('bloburl'), '_blank');

    }

});
		
		
		

	