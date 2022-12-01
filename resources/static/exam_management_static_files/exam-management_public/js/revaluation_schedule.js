 $(document).ready(function() {
 
   //$("nameExam").prop( "disabled", true );
   

	loadExamTypes();
	loadAcademicYear();

	
	$('#selectExamType').unbind().bind('change',function(){
		
	      var exam_type = $( "#selectExamType option:selected" ).text();
	      var program = $( "#selectProgram option:selected" ).val();
		   var batch = $( "#selectBatch option:selected" ).val();
		   var semester = $( "#selectSemester option:selected" ).val();
	      
		 $.ajax({
	   	   	   "url": BASE_URL+"schedule/type/list",
			   "type":"POST",
			    "data":{"program":program,"batch":batch,"semester":semester,"exam_type":exam_type},
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
	
	
	/* ***************************************************************************************************** */
   /**
   * function to confirm for exam schedule
   */
    $('#formExamSchedule').unbind().bind('submit',function(event)
	{
				event.preventDefault();
				
			     var scheduleData = {};
			 //    scheduleData.id =  scheduleId ; 
		        scheduleData.scheduleId = $( "#selectExamName option:selected" ).val(); 
		        scheduleData.scheduleName = $( "#selectExamName option:selected" ).text(); 
		        scheduleData.program =  $( "#selectProgram option:selected" ).val();
		        scheduleData.batch =  $( "#selectBatch option:selected" ).val();
		        scheduleData.evalType = $( "#selectRevaluationType option:selected" ).val(); 
		        scheduleData.evalTypeName = $( "#selectRevaluationType option:selected" ).text(); 
		        scheduleData.instructions = $( "#instructions" ).val(); 
		        scheduleData.lastDateApply =  moment($("#tentativeDate").val(),'DD-MM-YYYY').format('YYYY-MM-DD');
		        scheduleData.dateWithoutFine = moment($("#dateWithouFine").val(),'DD-MM-YYYY').format('YYYY-MM-DD');
		        scheduleData.dateWithFine = moment($("#pay_date_fine").val(),'DD-MM-YYYY').format('YYYY-MM-DD');
		     
		        if (scheduleData.dateWithoutFine > scheduleData.dateWithFine) {
		        	toastr.error("Date of Payment with fine cannot be eariler   !!");
		        	return;
		        }
		        if ($("#instructions").val().length == 0) {
		       
		        	toastr.error("Instructions cannot be empty   !!");
		        	return;
		        }
		        
		   
		       scheduleData.status = "IN ACTIVE";
		        scheduleData.approvalStatus = "SUBMITTED";
		  
		        scheduleData.feeSettings = String(selectedConfigArray);
		       
		     	var scheduleFormDataJson = scheduleData;
		     	
	
				
				
          var msg = {
					 title : "Revaluation/ Scrutiny Schedule",
					 msg : "Do you want to schedule this exam ?"
				}
          
		  ConfirmDialog(msg, "SAVE").then(function(response) {
							
					//examSchedule(formData,scheduleFormDataJson);
			  createRevaluationSchedule(scheduleFormDataJson);
									
			}, function(error) {
					
				toastr.error("Revaluation/ Scrutiny  Schedule cancelled !!");
					
			});
      
   });

	
	
			
	
	function createRevaluationSchedule(scheduleFormDataJson)
	{
		
               				
			    $.ajax(
		   		{
		   			"url":BASE_URL+"revaluation/create-schedule",
		   			"method":"POST",
		   			data:scheduleFormDataJson,
		   			success:function(data){
	   			
			   			 toastr.success("Schedule created Successfully");
			   			 $('#displayTable').empty();
			   			 //reset  	
			   			  $("#formExamSchedule")[0].reset(); 
			   			 selectedConfigArray =[];
			   		  	  var  scheduleId = data.data;
			   			  createFeeDetails(scheduleFormDataJson,scheduleId);
			   			
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
	
	   /*
	   *  Create a fee against the 
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
					  "feeCollectionUniqueName": data.scheduleName+"-"+scheduleId,
					  "level1CollectionEndtDate":level1Date,
					  "level1CollectionStartDate":today,
					  "level1FineAmount": 0,
					  "level2CollectionEndtDate": level2Date,
					  "level2CollectionStartDate":level1Date ,
					  "level2FineAmount": 0,
					  "level3DailyFineAmount": 0,
					  "level3ReAdmissionFineAmount": 0,
					  "programId":data.program,
					  "semester": data.scheduleName+"-"+scheduleId,
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
		   			//  showMessage("Fee Details created Successfully");
		   				toastr.success(" Fee settings created successfully!!");
		   			},
		   			error:function(error)
		   			{
		   			  toastr.error(" Fee settings Failed !!");
		   				
		   			}
		   		 
		   		});	
	  
	  }
  });              





