//global variables and fns
	
	/* base url for exam management */
	//var BASE_URL = "certificate-management/api/v1/academics/certificate-management/";
	//var BASE_URL = "certificate-management/api/v1/academics/certificate-management/";
	//var BASE_URL = "certificate-management/api/v1/academics/certificate-management/";
	var BASE_URL = "certificate-management/certificate-management/api/v1/academics/certificate-management/";
	//var BASE_URL = "certificate-management/api/v1/academics/certificate-management/";
	
	/* CERTIFICATE TYPES */
	var ORIGINAL_TYPE = 1388;
	var DUPLICATE_TYPE = 1389;
	var MIGRATION = 1400;
	var TRANSCRIPT = 1399;
	var DEGREE = 1397;
	var PROVISIONAL = 1398;
	var NO_DUES = 1655;
	var TRANSFER = 1401;
	var CONDUCT = 2166; //need to check
	var ATTENDENCE = 2168 ; //need to check
	var CONSOLIDATED_MARK_SHEET = 2170;//need to check
	
	/* fn to convert form data to json */
	$.fn.serializeObject = function()
	{
	    var o = {};
	    var a = this.serializeArray();
	    $.each(a, function() {
	        if (o[this.name] !== undefined) {
	            if (!o[this.name].push) {
	                o[this.name] = [o[this.name]];
	            }
	            o[this.name].push(this.value || '');
	        } else {
	            o[this.name] = this.value || '';
	        }
	    });
	    return o;
	 };

 
 	$('.datepicker').datepicker({
	    format: 'yyyy-mm-dd',							   
		autoclose:true,
		clearBtn:true,
		pickerPosition: "bottom-left"
	});  
	
	$('.datepicker-month-year').datepicker({
	    format: 'M-yyyy',	
	    startView: "months", 
        minViewMode: "months",						   
		autoclose:true,
		clearBtn:true
	});
	
	
	function openCertificates(certificateId){
		
			$.ajax({
				   type: "GET",
				   url:  BASE_URL + "getAffidavitCertificate/"+certificateId,
				   headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				   },		   
				   success: function(result)
				   {
					  console.log(result);
					  window.open(result.DownloadLink, '_blank');
					// $('#affidavitUrl').attr("href",result.DownloadLink);
					 
				   }
				 });
		
	}
	
	
	
	/*$('.datetimepicker').datetimepicker({
      language: 'en'
    //  pick12HourFormat: true
    });*/
    
     /**
    *  Get the logged in student details
    **/
         
   function getStudentInfo(studentId)
	{
       var studentData = {};       
	    $.ajax({
	   		url: "students/getStudentsDetails-V3",
	   		method: 'GET',
	   		async:false,
	   		data:{"userCodes":studentId},
	   		success: function(data)
	   		{
	   		  studentData = data;
	   		  console.log(data);	   		
	   		  setStudentInfo(data,studentId);	   		  
	   		  return data;
	   		  	   			
	   		},
	   		error:function(err)
	   		{
	   		 toastr.success("Failed to load student details");
	   		}
	   	});
	   	
	   	return studentData; 
	 }
	 
	 
	 /**
    *  set the student details
    **/
         
   function setStudentInfo(data,studentId)
	{
	  var studentDetails = data[studentId];
	  console.log( studentDetails);
	  loggedStudentProgramId = studentDetails.programCode;
 		//alert(programId);
 		
	  $("#student_reg_no").text(studentDetails.regNo ? studentDetails.regNo : "----");
      $("#student_name").text(studentDetails.studentName);
      $("#student_gender").text(studentDetails.studentPersonalGender);
      $("#student_code").text(studentDetails.studentCode);
      $("#program_name").text(studentDetails.programName);
      $("#batch_name").text(studentDetails.batchName);
      $("#semester").text(studentDetails.semester);
      $("#division").text(studentDetails.division ? studentDetails.division: "-----")
      $("#student_roll_no").text(studentDetails.rollNo ? studentDetails.rollNo:"-----");
     
	}

   
   function loadDataOnPreview(data)
	{
		console.log("Data :: "+JSON.stringify(data));
		console.log(data.purpose);
		
		
	   if(data.originalNo)
		   {
		   $('#duplicate_org_no').show();
		   $('#label_duplicate_org_no').show();
		   $('#duplicate_org_no').text(data.originalNo);
		   }
	   else{
		   $('#duplicate_org_no').hide();
		   $('#label_duplicate_org_no').hide();
	   }
	 
	   if(data.isAffidavit===true)
		   {
		   $('#isAffidavit').text('Yes');
		   $('#isAffidavit').show();
		   $('#label_isAffidavit').show();
		   $('.AffidavitLink').show();
		   }
		 
	   else{
		   $('#isAffidavit').hide();
		   $('#label_isAffidavit').hide();
		   $('.AffidavitLink').hide();
	   }
	  
	   if(parseInt(data.noCopies)>0)
		   {
			  $('#transcript_copy').show();
			  $('#label_transcript_copy').show();
			  $('#transcript_copy').text(data.noCopies);
		   }
	   else{
		  $('#transcript_copy').hide();
		  $('#label_transcript_copy').hide();
	   }
	  
	   if(data.remarks)
		   {
		   $('#noduenumber').text(data.remarks);
		   $('#noduenumber').show();
		   $('#label_noduenumber').show();
		   }		
	   else{
		   $('#noduenumber').hide();
		   $('#label_noduenumber').hide();
	   }
	  
	   if(data.nameId == TRANSFER || data.nameId == MIGRATION)
		   {
		   loadInterUniversityData(data.studentId);
		   $('#interuniversity').show();
		   $('#label_interuniversity').show();
		   
		   }
	   else
		   {
		   $('#interuniversity').hide();
		   $('#label_interuniversity').hide();
		   
		   }
	  
	   if(data.purpose)
		   {
		   $('#purpose_certificate').text(data.purpose);
		   $('#purpose_certificate').show();
		   $('#label_purpose_certificate').show();
		   }
		
	   else{
		   $('#purpose_certificate').hide();
		   $('#label_purpose_certificate').hide();
	   }
		//$('#fee').text(data.paymentsAmount?data.paymentsAmount:0);//TODO Add Fee details
		$('#fee').text(data.paymentsAmount?data.paymentsAmount+" Rs/-":"0 Rs/-");
		$('#applnType').text(data.name+"("+data.type+")");
		$('#collapseExample').show();
		$('html, body').animate({
		        scrollTop: $("#previewCertificate").offset().top
		}, 1000);
		
	}
	/**
	* To load inter university details of loggedin student
	*/
	 function loadInterUniversityData(loggedInStudentId)
	 {
	    
	      $.ajax({
		         url: "students/getStudentDetails",
		         data:{"studentAdmissionUserCode":loggedInStudentId },
				 success: function(data)
		           {
					 console.log(data);
					if(data.sa.studentAdmissionInterUniversity){
						
						$('#interuniversity').text(
						 	"  Inter-University Admission No -- "+data.sa.studentAdmissionInterUniversityAdmissionNo +
						    "  , ProgramName -- "+data.sa.studentAdmissionInterUniversityOldProgramName +
							"  , RollNo -- " +data.sa.studentAdmissionInterUniversityOldRollNo +
							"  , University -- " + data.sa.studentAdmissionInterUniversityOldUniversity +
							"  , Semesters completed -- " + data.sa.studentAdmissionInterUniversitySemestersCompleted						
						);
						
						
					  
						
					}
					else{
						
						$('#interuniversity').text("NO");
					}
					
		           }
		         });
	 }
	 
   
    /**
   * Fee Settings
   */
   
   var studentListWithData=new Array();
   var studentCodeList=new Array();
   
   
	function loadData(url)
	{
		let dataWithPayment=[];
		$.ajax(
		{
			url:url,
			async:false,
			success:function(data)
			{
			studentListWithData=data.data;
			console.log(studentListWithData);
			if(studentListWithData.length>0){
			  var studfeeidmapArray=generateFeeIdenMapArray(studentListWithData);
			  console.log(studfeeidmapArray);
			  dataWithPayment = getFeeOrderStatus(studfeeidmapArray);
			}
		}
	})
	
	return dataWithPayment;
  }
	
 function generateFeeIdenMapArray(data)
	{
		var mapArray=new Array();
		for(let i=0;i<data.length;i++)
		{
			var map={};
			var studCode=data[i]['studentId'];
			map['feeOrderStudent']=studCode;//maintain the same key feeOrderStudent in map
			map['feeOrderIdentity']=data[i]['orderId'];//maintain the same key feeOrderIdentity in map
			mapArray.push(map);
			}
			return mapArray;
	}

 function addTostudentListWithData(data)
	{
		for(let i=0;i<studentListWithData.length;i++)
		{
		for(let j=0;j<data.length;j++)
		{
		if(String(studentListWithData[i]['studentId'])==data[j]['feeOrderStudentCode'])
		{
		studentListWithData[i]['feeOrderStatusValue']=data[j]['feeOrderStatusValue'];
		}
		}
	}
	
	}
	
	
 function getFeeOrderStatus(datatosend)
	{
		console.log("calling getFeeOrderStatus function")
		$.ajax(
		{
			   url:'/fees/getManyFeeOrderStatusByFeeIdentifierAndAccount',
			   data:{'feeOrderStudents':datatosend},
			   method:"post",
			   async:false,
			   success:function(data)
			   {
					console.log(data); 
					if(data.length>0)
					{
					addTostudentListWithData(data);
					//loadDatatable(studentListWithData);
					//return studentListWithData;
					}
	           },
		    error:function(err)
				{
				showMessage(err);
				}
		});
		return studentListWithData;
}


 var ConfirmDialog = function (data,type){

 var TYPE;
 var ICON ;
 var BTN_CLASS;

	 if ( type == 'SAVE'){
		 TYPE = 'green';
		 ICON =  'fa fa-save';
		 BTN_CLASS = 'btn-success';
	 }
	 else if ( type == 'DELETE'){
		 TYPE = 'red';
		 ICON =  'fa fa-trash';
		 BTN_CLASS = 'btn-danger';	 
	 }
	 else
	 {
		 TYPE = 'orange';
		 ICON =  'fa fa-warning';
		 BTN_CLASS = 'btn-warning';	
	 }
	 var DialogPromise = function (resolve, reject) {
	    
	     $.confirm({
	        title: data.title,
	        content:data.msg,
	        closeIcon : true,
	        type: TYPE,
	        icon: ICON,
	        offsetTop: 40,	      
	        bgOpacity :'0.7',
	        buttons: {  
	            ok: {
	                text: "<b> Yes </b>",	            
	                keys: ['enter'],
	                action: function(){	                    
	                     resolve(true); 	                    
	                }
	            },
	            no: function(){
	              text: "<b> No </b>",	                  
	                    reject(false); 
	            }
	        }
     });    
    
   };    
    return  new  Promise (DialogPromise);
 }