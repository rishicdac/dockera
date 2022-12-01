	var table = document.getElementById("tblCondonationList");
			var condonationArr = [];
			for ( var i = 1; i < table.rows.length; i++ ) {
			    condonationArr.push({
			        studentId: table.rows[i].cells[0].innerHTML,
			        studentName: table.rows[i].cells[1].innerHTML,
			        percentage: table.rows[i].cells[3].innerHTML,
			       //program: table.rows[i].cells[4].innerHTML,
			      //  batch:table.rows[i].cells[5].innerHTML ,
			      //  semester: table.rows[i].cells[6].innerHTML
       
			       
			    });
			}