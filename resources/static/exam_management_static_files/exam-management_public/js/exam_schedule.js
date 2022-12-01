$(document).ready(function() {
 
   //$("nameExam").prop( "disabled", true );
   

	loadExamTypes();
	loadAcademicYear();
	
	
 	/* Automatic generation of the exam name */
	$('#selectExamType').unbind().bind('change',function(){
		 var examName = $( "#selectProgram option:selected" ).text()+'-'+$( "#selectBatch option:selected" ).text()+'-'+$( "#selectSemester option:selected" ).text()+"-"+$('#selectExamType option:selected').text();
	   		$('#nameExam').val(examName);		
	});
	
 
	/* file upload */
	$(".custom-file-input").on("change", function() {
	
	  var fileName = $(this).val().split("\\").pop();
	  $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
	});
	

	
	/* **************************************************************************/
	/* exam fee settings  by rishi*/
	/* ****************************************************************************/
	
	var feeConfigMap={};// in case nuals need dynamic addition of fee config, we can set the values from an //api
    //var selectedConfigArray=new Array();
	//selectedConfigArray ="Exam-fee,Testing-Fee";
	//var pgmId=200;// set this from ur code
	//var examScheduleId="abc";//set this from ur code
	
	$.ajax(
	{
		"url":"/fees/getAllConfigByType",
		"data":{"configType":"Examination"},
		success:function(data)
		{
			console.log(data);
			if(data)
			{
				for(let i=0;i<data.length;i++)
				{
					feeConfigMap[data[i]['processName']]=data[i]['processName'];
				}
				setUpCheckBox(feeConfigMap,'checkBoxTable');
			}
		}
	});
	
	function setUpCheckBox(maparray,tableId)
	{
		selectedConfigArray=[];
		for (let key in maparray) 
		{
			if (maparray.hasOwnProperty(key)) 
			{
				var tr=$('<tr><td>'+maparray[key]+'</td><td><input  configkey="'+key+'"  id="'+key+'" type="checkbox" class="configList" style:"margin-right: 20px"></td></tr>');
				$('#'+tableId).append(tr);
				//selectedConfigArray.push(key);
				
			}
			$("#scheduleDiv").show();
		}
		
		$('.configList').unbind().bind('change',function()
		{
			var configKey=$(this).attr('id');
		
			if($('#selectProgram').val() =="" ){
				
				toastr.error("Kindly select program!!");
				$(this).prop('checked', false);
							
			}
			else{
				if(this.checked)
				{
					addToArray(configKey);
				}
				else
				{
					removeFromArray(configKey);
				}
				getAmountDetails(configKey);
			}
		});
		
	}
	
	
	function addToArray(stud)
	{
	   if(selectedConfigArray.indexOf(String(stud)) !== -1)
	   {
	   }
	   else
	   {
		   selectedConfigArray.push(String(stud));  
	   }
	}
	
	function removeFromArray(stud)
	{
	   if(selectedConfigArray.indexOf(String(stud)) !== -1)
	   {
		   stud=String(stud)
		   selectedConfigArray = jQuery.grep(selectedConfigArray,function(value) 
		   {
			   return value != stud;
		   }); 
	   }
	}
	function displayInfo(data)
	{
		$('#displayTable').empty();
		for(let i=0;i<data.length;i++)
		{
			var tr=$('<tr><td>'+feeConfigMap[data[i]['configKey']]+'</td><td>'+data[i]['feeAmount']+'</td></tr>');
			$('#displayTable').append(tr);
		}
	}
	function getAmountDetails(configKey)
	{
		//alert("inside amount"+selectedConfigArray);
		if(selectedConfigArray.length>0 && $('#selectProgram').val() != "" )
		{
			$.ajax(
			{
				"url":"/fees/getManyFeeHeadAmountMap",
				"data":{"pgmId":$('#selectProgram').val(),"feeIdentifierList":String(selectedConfigArray)},
				success:function(data)
				{
					
					var feeHeads = data.length;
					var configArray = selectedConfigArray.length;
										
					if(data.length == 0  || configArray != feeHeads ){
						toastr.error("No fee set for this program!!");
						 $('#'+configKey).prop('checked', false);
					     removeFromArray(configKey);
					}
					//else if( configArray != feeHeads )
						//toastr.error("No fee set for this program!!");
					else
					displayInfo(data);
				},
				error:function(e)
				{
					console.log("Error in calling ajax "+e);
				}
			});
		}
		else
		{
			
			$('#displayTable').empty();
		}	
	}
	

   /**
   * function to confirm for exam schedule
   */
    $('#formExamSchedule').unbind().bind('submit',function(event)
	{
				event.preventDefault();
							
		        var scheduleData = $(this).serializeObject();
		        scheduleData.tentative_date =  moment($("#tentativeDate").val(),'DD-MM-YYYY').format('YYYY-MM-DD');
		        scheduleData.pay_date = moment($("#dateWithouFine").val(),'DD-MM-YYYY').format('YYYY-MM-DD');
		        scheduleData.pay_date_fine = moment($("#pay_date_fine").val(),'DD-MM-YYYY').format('YYYY-MM-DD');
		        
		        if (scheduleData.pay_date > scheduleData.pay_date_fine) {
		        	toastr.error("Date of Payment with fine cannot be eariler !!");
		        	return;
		        }
		        if ($("#instructions").val().length == 0) {
		        	toastr.error("Instructions cannot be empty   !!");
		        	return;
		        }
		        
		        scheduleData.academic_year = $( "#selectAcademicYear option:selected" ).text();
		        scheduleData.programName = $( "#selectProgram option:selected" ).text();
		        scheduleData.batchName = $( "#selectBatch option:selected" ).text();
		        scheduleData.exam_type = $( "#selectExamType option:selected" ).text();
		        scheduleData.status = "IN ACTIVE";
		        scheduleData.approval_status = "SUBMITTED";
		        
			    if(selectedConfigArray.length ==0 )
		        {
		        	toastr.error(" Fee heads cannot be empty  !!");
		        	return;
		        	
		        } 
			     
		        scheduleData.config_list = String(selectedConfigArray);
		       
		     	var scheduleFormDataJson = scheduleData;
		        console.log(scheduleFormDataJson);
		        
				var msg = {
					 title : "Exam Schedule",
					 msg : "Do you want to schedule this exam ?"
				}
				
		        ConfirmDialog(msg, "SAVE").then(function(response) {
					 
		        	createExamSchedule(scheduleFormDataJson);
									
			    }, function(error) {
					
				    toastr.error("Exam Schedule cancelled !!");
					
			    });
      
   });

    
    /* post the schedule data */
	function createExamSchedule(scheduleFormDataJson)
	{
		    $.ajax(
	   		{
	   			"url":BASE_URL+"schedule/create-schedule",
	   			"method":"POST",
	   			data:scheduleFormDataJson,
	   			success:function(data){
   				    toastr.success("Schedule created Successfully");
	   			    //reset  	
	   			    $("#formExamSchedule")[0].reset(); 
	   			 	var  scheduleId = data.data;
	   			    createFeeDetails(scheduleFormDataJson,scheduleId);
	   			 selectedConfigArray =[];
	   			},
	   			
				error:function(err)
		   		{
		   			if (err.status == 409) {
                         
                         toastr.error("Schedule already exists for the given program, batch and semester !!");
                        }
                        else
		   			toastr.error("Saving Exam Schedule failed !!");
		   			 			
		   		}
	   		});	
	 }	
	
	  	/* change date format */
		function reorderdate(d)//expected incoming format is dd-mm-yyyy
		{
			var nd=d.split('-')[2]+"-"+d.split('-')[1]+"-"+d.split('-')[0];
			return nd;
		}
	 
	  /*
	   *  Create a fee details against the schedule 
	   */
	  function createFeeDetails(data,scheduleId)
	  {
	
		//  var today = new Date();
		  var today = moment().format('YYYY-MM-DD');
		
		  var level1Date = (data.pay_date) ;
		  var level2Date = (data.pay_date_fine) ; 
		
		  var feeData =  	{   
					  "batchId":data.batch ,
					  "collectionEndtDate":level2Date,
					  "collectionStartDate": today,
					  "feeCollectionUniqueName": scheduleId,
					  "level1CollectionEndtDate":level1Date,
					  "level1CollectionStartDate":today,
					  "level1FineAmount": 0,
					  "level2CollectionEndtDate": level2Date,
					  "level2CollectionStartDate":level1Date ,
					  "level2FineAmount": 0,
					  "level3DailyFineAmount": 0,
					  "level3ReAdmissionFineAmount": 0,
					  "programId":data.program,
					  "semester": data.semester,
					  "sfsFeeGroupDueDateMapBlackOutDate":level2Date,
					  "sfsFeeGroupDueDateMapEneteredDate":level2Date,
					 
					}

	
			    $.ajax(
		   		{
		   			"url":"fees/saveFeeSettings-v5",
		   			"method":"POST",
		   		     data:feeData,
		   			success:function(data){
		   				$("#formExamSchedule")[0].reset();
		   				toastr.success(" Fee settings created successfully!!");
		   			},
		   			error:function(error)
		   			{
		   			  toastr.error(" Fee settings Failed !!");
		   				
		   			}
		   		 
		   		});	
	  
	  }
  });              





