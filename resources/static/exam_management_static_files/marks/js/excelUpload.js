
	
	
	/** 	  
		Parse Excel File Content
	**/
	function ExportToTable(excelfile,callback) {  
	
		var xlsJsonData;
		
		 var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;  
		 /*Checks whether the file is a valid excel file*/  
		 if (regex.test($("#"+excelfile).val().toLowerCase())) {  
			 var xlsxflag = false; /*Flag for checking whether excel is .xls format or .xlsx format*/  
			 if ($("#"+excelfile).val().toLowerCase().indexOf(".xlsx") > 0) {  
				 xlsxflag = true;  
			 }  
			 /*Checks whether the browser supports HTML5*/  
			 if (typeof (FileReader) != "undefined") {  
				 var reader = new FileReader();  
				 reader.onload = function (e) {  
					 var data = e.target.result;  
					 /*Converts the excel data in to object*/  
					 if (xlsxflag) {  
						 var workbook = XLSX.read(data, { type: 'binary' });  
					 }  
					 else {  
						 var workbook = XLS.read(data, { type: 'binary' });  
					 }  
					 /*Gets all the sheetnames of excel in to a variable*/  
					 var sheet_name_list = workbook.SheetNames;  
	  
					 var cnt = 0; /*This is used for restricting the script to consider only first sheet of excel*/  
					 sheet_name_list.forEach(function (y) { /*Iterate through all sheets*/  
						 /*Convert the cell value to Json*/  
						 if (xlsxflag) { 
							var  exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);  
						 }  
						 else {  
							var  exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]); 
						 }  
						
						 if (exceljson.length > 0 && cnt == 0) { 
							 
							 xlsJsonData  = exceljson;
							 console.log(xlsJsonData);
							 callback(exceljson);                                              
							 cnt++; 
							 /*if(compareJson(exceljson))
								 {
									 xlsJsonData  = exceljson;
									 console.log(xlsJsonData);
									 callback(exceljson);                                              
									 cnt++; 
								 }else
								 {
									 $('#err_message').text("Sorry! Your File content was not in specified format!");
									 $('#err_alert').show();
								 }*/
							  
						 } 
					 });  
					
				 }  
				 if (xlsxflag) {
					 /*If excel file is .xlsx extension than creates a Array Buffer from excel*/  
					 reader.readAsArrayBuffer($("#"+excelfile)[0].files[0]);  
				 }  
				 else {  
					 reader.readAsBinaryString($("#"+excelfile)[0].files[0]);  
				 }  
			 }  
			 else {  
				 toastr.error("Sorry! Your browser does not support HTML5!");
				
				
			 }  
		 }  
		 else { 
			 toastr.error("Please upload a valid Excel file!");
			
		 }  
		 console.log("At End: "+xlsJsonData);
	 }  

	 function callBack(d)
	 {	
		
		xlsData = d;
		console.log("callback data : "+xlsData);
		xlsData.forEach( obj =>   obj.__proto__=null);		
		populateTable(xlsData);
		populateDataTable(xlsData);
		$('#totalRecords').text(Object.keys( xlsData ).length );
		if(xlsData)
			$('#markTable').show();
	 }
	 
	 function compareJson(remoteJSON)
	 {	
		
		 return  _.isEqual(remoteJSON, localJSON);
	 }
	 
