$(document)
		.ready(
				function() {

					$('#transcriptDiv').hide();
					$('#migrationDiv').hide();
					$('#duplicateDiv').hide();
					$('#collapseExample').hide();
					$('#err_alert').hide();
					$("input[data-bootstrap-switch]").each(
							function() {
								$(this).bootstrapSwitch('state',
										$(this).prop('checked'));
							});
					bsCustomFileInput.init();

					var certificateRequest = {};
					var errmsg = "";
					// var programId = 0; // TO -do bind
					var feeAmount = 0;
					var studentInfo = {};
					var loggedInStudentId = $("#usercode").val();
					getCertificateType();
					getStudentInfo(loggedInStudentId);

					/**
					 * To list the Certificate Types
					 */

					function getCertificateType() {

						$
								.ajax({
									url : '/fees/getCertificateTypes',
									method : 'GET',
									success : function(data) {
										setUpDropDown("certType", data,
												"sfsFeeHeadGroupId",
												"sfsFeeHeadGroupName");

									},
									error : function(err) {
										toastr
												.error("Failed to load Certificate Types");
									}
								});
					}

					/**
					 * To list the Certificate Names
					 */
					function getCertificateNames(type) {

						$.ajax({
							url : 'fees/getCertificatesByCertTypeID',
							method : 'GET',
							data : {
								"groupId" : type
							},
							success : function(data) {
								setUpDropDown("cert", data, "sfsFeeHeadId",
										"sfsFeeHeadName");

							},
							error : function(err) {
								toastr.error("Failed to load Certificates");
							}
						});
					}

					/**
					 * Get Fee amount for the given certificate
					 */
					function getCertificateFee(certificateId, programId) {

						$
								.ajax({
									url : 'fees/getFeeDetailsByCertificateAndCertificateType',
									method : 'GET',
									data : {
										"feeHeadId" : certificateId,
										"programId" : programId
									},
									success : function(data) {
										feeAmount = data.feeAmount;

									},
									error : function(err) {
										toastr
												.error("Failed to load Fee details");
									}
								});
					}

					/**
					 * check for the select event of certificate type dropdown
					 * and populate certificate types based on the selection
					 * "Original" or "Duplicate" If the selection is duplicate
					 * division for entering details of duplicate certificate
					 * was visible
					 */

					$("#certType").change(
							function() {
								// Hide Preview Division and Empty post json
								$('#collapseExample').hide();
								resetForm();
								certificateRequest = {};

								getCertificateNames($(
										"#certType option:selected").val());

								var certificate = parseInt(this.value);
								certificateRequest.type = $(this).find(
										'option:selected').text();
								certificateRequest.typeId = certificate;

								if (certificate === ORIGINAL_TYPE)// Original
																	// Certificates
								{
									$("#cert option").remove();

									$('#duplicateDiv').hide();
								}
								/*
								 * else if(certificate=== DUPLICATE_TYPE
								 * )//Duplicate Certificates { $("#cert
								 * option").remove();
								 * 
								 * $('#duplicateDiv').show();
								 * $('#transcriptDiv').hide();
								 * $('#migrationDiv').hide(); }
								 */

							})
					/**
					 * check for the select event of certificate dropdown to
					 * show/hide transcript and migration details
					 */
					$("#cert")
							.change(
									function() {
										// Hide Preview Division and Empty post
										// json
										$('#collapseExample').hide();

										resetForm();
										var certificateType = parseInt(this.value);

										getCertificateFee(certificateType,
												loggedStudentProgramId);

										certificateRequest.name = $(this).find(
												'option:selected').text();
										certificateRequest.nameId = certificateType;

										if (certificateType === TRANSCRIPT) // Transcription
																			// Id
										{
											$('#transcriptDiv').show();
											$('#migrationDiv').hide();

										} else if (certificateType === MIGRATION) // Migration
																					// Id
										{
											$('#migrationDiv').show();
											$('#transcriptDiv').hide();
										} else if (parseInt($(
												"#certType option:selected")
												.val()) === DUPLICATE_TYPE) {
											$('#duplicateDiv').show();
										} else {
											$('#transcriptDiv').hide();
											$('#migrationDiv').hide();
										}
									})
					/**
					 * Preview Button click event to show sample application
					 * format
					 */
					$("#previewBtn")
							.click(
									function() {

										var isError = checkErrors();
										if (isError) {
											$('#err_message').text(errmsg);
											$('#err_alert').show();

										} else {
											certificateRequest.paymentsAmount = feeAmount ? feeAmount
													: 0;
											certificateRequest.studentId = $(
													"#usercode").val();
											loadDataOnPreview(certificateRequest);
											$('#err_alert').hide();

											$('#collapseExample').show();
											console.log(certificateRequest);
										}

									})

					function checkErrors() {
						var isValid = false;
						certificateRequest.isAffidavit = false;// TODO want to
																// change after
																// fileupload
						if (certificateRequest.typeId === undefined
								|| certificateRequest.nameId === undefined) {
							isValid = true;
							errmsg = "Certificate & Type are required";

						} else {

							if (certificateRequest.typeId === DUPLICATE_TYPE)// Duplicate
							{

								if ($('#originalcertificateno').val().length === 0
										|| $('#duplicatePurpose').val().length === 0
										|| $('#affidavitFile').get(0).files.length === 0) {
									isValid = true;
									errmsg = "Original Certificate No. , Affidavit & Purpose required";
								} else {
									certificateRequest.originalNo = $(
											'#originalcertificateno').val();
									certificateRequest.isAffidavit = true;// TODO
																			// change
																			// status
																			// to
																			// true
																			// after
																			// fileupload
									certificateRequest.purpose = $(
											'#duplicatePurpose').val();
								}

							} else { // Original

								if (certificateRequest.nameId === TRANSCRIPT)// Transcript
								{
									if (!$('#certificatecount').val()) {
										isValid = true;
										errmsg = "No of copies required";
									} else {
										certificateRequest.noCopies = parseInt($(
												'#certificatecount').val());
										certificateRequest.purpose = $(
												'#purpose').val();
									}

								} else if (certificateRequest.nameId === MIGRATION)// Migration
								{
									// certificateRequest.noDues = true;
									if ((certificateRequest.noDues === true || certificateRequest.noDues === undefined)
											&& !$('#duecertificateno').val()) {
										isValid = true;
										errmsg = "No due certificate number required";

									} else {
										certificateRequest.remarks = $(
												'#duecertificateno').val();
										certificateRequest.purpose = $(
												'#noduepurpose').val();
									}

								} else {
									delete certificateRequest.noCopies;
									delete certificateRequest;
									delete certificateRequest.remarks;
									$('#certificatecount').val('');
									$('#purpose').val('');
									$('#duecertificateno').val('');
									$('#noduepurpose').val('');

								}
							}
						}

						return isValid;
					}

					/**
					 * change event of no due certificate switch
					 */
					$("input[data-bootstrap-switch]").on(
							'switchChange.bootstrapSwitch',
							function(event, state) {
								console.log(state);
								if (state === true) {
									$('#certNo').show();
									certificateRequest.noDues = state;
								} else {
									$('#certNo').hide();
									certificateRequest.noDues = state;
								}

							});
					/**
					 * Reset Form
					 */
					function resetForm() {
						// $("#certType").prop("selectedIndex", 0);
						// $("#cert").prop("selectedIndex", 0);
						$("#certificatecount").val('');
						$("#purpose").val('');
						$("#check").bootstrapSwitch('state', true);
						$("#duecertificateno").val('');
						$("#noduepurpose").val('');
						$("#originalcertificateno").val('');
						$("#exampleInputFile").val('');
						$("#duplicatePurpose").val('');
						$('input[type=checkbox]').prop('checked', false);
						$('#transcriptDiv').hide();
						$('#migrationDiv').hide();
						$('#duplicateDiv').hide();
						$("#affidavitFile").val('');
						// $("#affidavitFile").replaceWith($("#affidavitFile").clone());

					}
					// Form submit
					$("#requestCertificate")
							.submit(
									function(e) {
										e.preventDefault();
										var msg = {
											title : "Save",
											msg : " Do you want to proceed with Certificate Request?"
										}
										ConfirmDialog(msg, "SAVE")
												.then(
														function(response) {

															certificateRequest.declaration = $(
																	"#decleration")
																	.is(
																			":checked") ? true
																	: false;
															// TODO Assign
															// original student
															// id
															certificateRequest.status = "SUBMITTED";
															certificateRequest.approvalStatus = certificateRequest.nameId === 21 ? null
																	: "SUBMITTED";
															certificateRequest.orderId = null;
															if (certificateRequest.paymentsAmount > 0) {
																var timestamp = Number(new Date());
																var today = new Date();
																var dd = today
																		.getDate();
																var mm = today
																		.getMonth() + 1;
																var yyyy = today
																		.getFullYear();
																var today = mm
																		+ '/'
																		+ dd
																		+ '/'
																		+ yyyy
																		+ '/'
																		+ timestamp;
																var orderId = "CERT-"
																		+ $(
																				"#usercode")
																				.val()
																		+ "-"
																		+ timestamp;
																certificateRequest.orderId = orderId;
																// certificateData=
																// JSON.stringify(certificateRequest);
															}

															console
																	.log(JSON
																			.stringify(certificateRequest));
															var file = $('#affidavitFile')[0].files[0];

															if (file != undefined) {
																let formData = new FormData();
																formData
																		.append(
																				'RequestData',
																				JSON
																						.stringify(certificateRequest));
																formData
																		.append(
																				'file',
																				file);
																saveStudentDataFile(
																		formData,
																		certificateRequest.paymentsAmount,
																		certificateRequest.orderId);
															} else {
																certificateData = JSON
																		.stringify(certificateRequest);
																saveStudentData(
																		certificateData,
																		certificateRequest.paymentsAmount,
																		certificateRequest.orderId);
															}

														}, function(error) {

														});
									});

					/**
					 * store certificate details with affidavit attached
					 */
					function saveStudentDataFile(formData, amount, order_id) {

						$
								.ajax({
									type : "POST",
									url : "certificate-management_proxy/api/v1/academics/certificate-management/certificate-request-file-by-studentid",
									data : formData,
									cache : false,
									processData : false,
									contentType : false,
									success : function(data) {
										certificateNum = 255; // TO-DO
										// showMessage("Certificate request done
										// Successfully !! . Kindly pay the fees
										// at the fee section ");
										console.log(data);
										$("#certType").prop("selectedIndex", 0);
										$("#cert").prop("selectedIndex", 0);
										resetForm();
										$('#collapseExample').hide();
										certificateRequest = {};
										$("html, body").animate({
											scrollTop : 0
										}, "slow");
										toastr.success(data.message);
										// debitStudentFee(feeAmount,certificateNum,orderId);
										if (amount > 0)
											debitStudentFee(certificateNum,
													amount, order_id);

									},
									error : function(data) {
										toastr
												.error("Error occurred. Kindly contact Administrator");
									}
								});

					}

					/**
					 * store certificate details without affidavit
					 */
					function saveStudentData(certificateData, amount, order_id) {

						$
								.ajax({
									type : "POST",
									url : BASE_URL
											+ "certificate-request-by-studentid",

									data : certificateData,
									headers : {
										'Accept' : 'application/json',
										'Content-Type' : 'application/json'
									},
									success : function(data) {
										certificateNum = 255; //TO-DO
										toastr.success(data.message);
										//showMessage("Certificate request done Successfully !! . Kindly pay the fees at the fee section ");
										if (amount > 0)
											debitStudentFee(certificateNum,
													amount, order_id);
										$("#certType").prop("selectedIndex", 0);
										$("#cert").prop("selectedIndex", 0);
										resetForm();
										$('#collapseExample').hide();
										certificateRequest = {};
										$("html, body").animate({
											scrollTop : 0
										}, "slow");

									},
									error : function(data) {
										console.log(data)
										toastr.error(data.message);
									}
								});

					}
					/**
					 * Raise debit against student
					 */
					function debitStudentFee(certificateNum, amount, order_id) {
						var map = {};
						var formData = [];

						map['transactionIdentifierRemarkOrProcess'] = order_id;
						map['transactionIdentifierProcessId'] = $("#cert")
								.val();
						map['transactionAmount'] = amount;
						map['studentUserCode'] = $("#usercode").val();
						formData.push(map);
						console.log(formData);

						$
								.ajax({
									type : "POST",
									url : "fees/generateFeeDebitsV1-v1",
									data : {
										"transactionWrappers" : formData
									},

									success : function(data) {
										//  showMessage("Fee Debit done Successfully !! . Kindly pay the fees at the fee section ");
										toastr
												.success("Kindly pay the fees to process your certificate request !!! ");
										//addPaymentDetails(certificateNum,orderId,feeAmount);
									},
									error : function(data) {
										toastr.error(data.message);
									}
								});

					}

					function addPaymentDetails(certificateNum, orderId,
							feeAmount) {

						$.ajax({
							type : "POST",
							url : BASE_URL + "payment-details",
							data : {
								"certificatesId" : certificateNum,
								"orderId" : orderId,
								"amount" : feeAmount
							},
							success : function(data) {
								//showMessage("Fee Debit done Successfully !! . Kindly pay the fees at the fee section ");

							},
							error : function(err) {
								toastr.error("Failed to add payment details");
							}
						});

					}

				});
