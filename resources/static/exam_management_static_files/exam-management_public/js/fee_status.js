

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
  
  function loadURLData(url,data)
	{
		let dataWithPayment=[];
		$.ajax(
		{
			url:url,
			method:"POST",
			data:data,
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
			//if(data[i]['orderId'] != null)
			 map['feeOrderIdentity']= data[i]['orderId'];//maintain the same key feeOrderIdentity in map
			//else 
			// map['feeOrderIdentity']= "";//maintain the same key feeOrderIdentity in map
			
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
		//if(String(studentListWithData[i]['studentId'])==data[j]['feeOrderStudentCode'])
		if(String(studentListWithData[i]['orderId'])==data[j]['feeOrderId'])
		{
		studentListWithData[i]['feeOrderStatusValue']=data[j]['feeOrderStatusValue'];
		}
		if(String(studentListWithData[i]['orderId'])== null){
		
			studentListWithData[i]['feeOrderStatusValue']= "No Fee";
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
