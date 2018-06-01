DBConnection.NewCommand("GetServiceTypes", "
	select 
		distinct(module) as service_type,
		service_type as code
	from v_service_status_codes
", CommandType.Text)

With DBConnection.NewCommand("GetServiceStatusCodes", "GetServiceStatusCodes", CommandType.StoredProcedure)
	.AddParameter("service_type", SqlDbType.char, ParameterDirection.Input, 3, "")
	.AddParameter("service_code", SqlDbType.char, ParameterDirection.Input, 1, "")
    .AddParameter("code", SqlDbType.VarChar, ParameterDirection.Input, 7, "")
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	.AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "sub_status_code")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("lookup_service_status_codes", "GetServiceStatusCodes", CommandType.StoredProcedure)
	.AddParameter("service_type", SqlDbType.char, ParameterDirection.Input, 3, "")
	.AddParameter("status_code", SqlDbType.char, ParameterDirection.Input, 1, "")
    .AddParameter("code", SqlDbType.VarChar, ParameterDirection.Input, 7, "")
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	.AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "sub_status_code")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("GetClaimServices", "GetClaimServices", CommandType.StoredProcedure)
    .AddParameter("claim_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("service_type", SqlDbType.char, ParameterDirection.Input, 3, "")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

With DBConnection.NewCommand("GetService", "GetService", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("service_type", SqlDbType.char, ParameterDirection.Input, 3, "")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

With DBConnection.NewCommand("GetServiceItem", "GetServiceItem", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

With DBConnection.NewCommand("GetNewServiceInfo", "GetNewServiceInfo", CommandType.StoredProcedure)
    .AddParameter("claim_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("service_type", SqlDbType.char, ParameterDirection.Input, 3, "")
    .AddParameter("service_sub_type", SqlDbType.char, ParameterDirection.Input, 4, "")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

With DBConnection.NewCommand("AddGop", "AddGop", CommandType.StoredProcedure)
	.AddParameter("id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("sequence_no", SqlDbType.int, ParameterDirection.Input, 0, 0)
	.AddParameter("claim_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
	.AddParameter("claim_type", SqlDbType.char, ParameterDirection.Input, 4, "")
	.AddParameter("service_type", SqlDbType.char, ParameterDirection.Input, 3, "")
	.AddParameter("service_no", SqlDbType.varchar, ParameterDirection.InputOutput, 22, "")
	.AddParameter("service_date", SqlDbType.datetime, ParameterDirection.Input, 0, Nothing)
	.AddParameter("version_no", SqlDbType.tinyint, ParameterDirection.Input, 0, 0)
	.AddParameter("service_sub_type", SqlDbType.char, ParameterDirection.Input, 4, "")
	.AddParameter("document_type", SqlDbType.varchar, ParameterDirection.Input, 10, "")
	.AddParameter("start_date", SqlDbType.datetime, ParameterDirection.Input, 0, Nothing)
	.AddParameter("end_date", SqlDbType.datetime, ParameterDirection.Input, 0, Nothing)
	.AddParameter("provider_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
	.AddParameter("provider_contact_person", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	.AddParameter("provider_fax_no", SqlDbType.varchar, ParameterDirection.Input, 20, "")
	.AddParameter("doctor_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
	.AddParameter("length_of_stay", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("discount_type", SqlDbType.char, ParameterDirection.Input, 1, "")
	.AddParameter("discount_percent", SqlDbType.smallmoney, ParameterDirection.Input, 0, 0)
	.AddParameter("discount_amount", SqlDbType.money, ParameterDirection.Input, 0, 0)
	.AddParameter("claim_currency_code", SqlDbType.char, ParameterDirection.Input, 3, "")
	.AddParameter("claim_currency_to_base", SqlDbType.float, ParameterDirection.Input, 0, 0)
	.AddParameter("claim_currency_to_client", SqlDbType.float, ParameterDirection.Input, 0, 0)
	.AddParameter("claim_currency_to_eligibility", SqlDbType.float, ParameterDirection.Input, 0, 0)
	.AddParameter("claim_currency_rate_date", SqlDbType.datetime, ParameterDirection.Input, 0, Nothing)
	.AddParameter("notes", SqlDbType.char, ParameterDirection.Input, -1, "")
	.AddParameter("room_expense", SqlDbType.money, ParameterDirection.Input, 0, 0)
	.AddParameter("misc_expense", SqlDbType.money, ParameterDirection.Input, 0, 0)
	.AddParameter("hospital_medical_record", SqlDbType.varchar, ParameterDirection.Input, 30, "")
	
	.AddParameter("action", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.Int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.VarChar, ParameterDirection.InputOutput, 200, "")
End With

With DBConnection.NewCommand("GetServiceSubType", "GetServiceSubType", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("service_type", SqlDbType.char, ParameterDirection.Input, 3, "")
    .AddParameter("sub_type", SqlDbType.varchar, ParameterDirection.Input, 4, "")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

' With DBConnection.NewCommand("GetServiceStatusHistory", "GetServiceStatusHistory", CommandType.StoredProcedure)
    ' .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    ' .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    ' .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "")
    ' .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
' End With

' With DBConnection.NewCommand("GetServiceActions", "GetServiceActions", CommandType.StoredProcedure)
    ' .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    ' .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    ' .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "")
    ' .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
' End With

With DBConnection.NewCommand("GetGopCalculationDates", "GetGopCalculationDates", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

With DBConnection.NewCommand("GetGopEstimates", "GetGopEstimates", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

With DBConnection.NewCommand("lookup_service_type_name", "
	select 
		code, 
		sub_type, 
		display_name 
	from service_sub_types 
	where service_type = @module and code = @code
	
	", CommandType.Text)
	.AddParameter("module", SqlDbType.varchar, ParameterDirection.Input, 3, "")
	.AddParameter("code", SqlDbType.varchar, ParameterDirection.Input, 4, "")
End With

With DBConnection.NewCommand("GetGopContacts", "GetGopContacts", CommandType.StoredProcedure)
    .AddParameter("provider_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("doctor_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("is_hospital", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("ChangeServiceStatus", "ChangeServiceStatus", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("status_code", SqlDbType.char, ParameterDirection.Input, 1, "")
    .AddParameter("sub_status_code", SqlDbType.char, ParameterDirection.Input, 3, "")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.Int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.VarChar, ParameterDirection.InputOutput, 2048, "")
End With

With DBConnection.NewCommand("SupercedeGop", "SupercedeGop", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("new_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.Int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.VarChar, ParameterDirection.InputOutput, 2048, "")
End With

With DBConnection.NewCommand("InvoiceReceived", "InvoiceReceived", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("new_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("service_no", SqlDbType.varchar, ParameterDirection.InputOutput, 20, "")
    .AddParameter("service_sub_type", SqlDbType.char, ParameterDirection.Input, 4, "")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.Int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.VarChar, ParameterDirection.InputOutput, 2048, "")
End With

With DBConnection.NewCommand("AddEligibleItem", "AddEligibleItem", CommandType.StoredProcedure)
	.AddParameter("id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("service_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
	.AddParameter("schedule_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
	.AddParameter("benefit_code", SqlDbType.char, ParameterDirection.Input, 15, "")
	.AddParameter("diagnosis_code", SqlDbType.char, ParameterDirection.Input, 10, "")
	.AddParameter("units_required", SqlDbType.bit, ParameterDirection.Input, 0, 0)
	.AddParameter("units", SqlDbType.smallmoney, ParameterDirection.Input, 0, 0)
	.AddParameter("amount", SqlDbType.money, ParameterDirection.Input, 0, 0)
	.AddParameter("is_split", SqlDbType.bit, ParameterDirection.Input, 0, 0)	
	.AddParameter("action", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.Int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.VarChar, ParameterDirection.InputOutput, 200, "")
End With

With DBConnection.NewCommand("AddExclusionItem", "AddExclusionItem", CommandType.StoredProcedure)
	.AddParameter("id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("service_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
	.AddParameter("schedule_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
	.AddParameter("benefit_code", SqlDbType.char, ParameterDirection.Input, 15, "")
	.AddParameter("amount", SqlDbType.money, ParameterDirection.Input, 0, 0)
	.AddParameter("action", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.Int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.VarChar, ParameterDirection.InputOutput, 200, "")
End With

With DBConnection.NewCommand("AddServiceItem", "AddServiceItem", CommandType.StoredProcedure)
	.AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
	.AddParameter("schedule_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
	.AddParameter("benefit_code", SqlDbType.char, ParameterDirection.Input, 10, "")
	.AddParameter("diagnosis_code", SqlDbType.char, ParameterDirection.Input, 10, "")
	.AddParameter("procedure_code", SqlDbType.char, ParameterDirection.Input, 10, "")
	.AddParameter("room_type", SqlDbType.char, ParameterDirection.Input, 5, "")
	.AddParameter("estimate_units", SqlDbType.smallint, ParameterDirection.Input, 0, 0)
	.AddParameter("units", SqlDbType.smallmoney, ParameterDirection.Input, 0, 0)
	.AddParameter("units_declined", SqlDbType.smallmoney, ParameterDirection.Input, 0, 0)
	.AddParameter("units_approved", SqlDbType.smallmoney, ParameterDirection.Input, 0, 0)
	.AddParameter("estimate", SqlDbType.money, ParameterDirection.Input, 0, 0)
	.AddParameter("actual_amount", SqlDbType.money, ParameterDirection.Input, 0, 0)
	.AddParameter("discount_percent", SqlDbType.smallmoney, ParameterDirection.Input, 0, 0)
	.AddParameter("discount_amount", SqlDbType.money, ParameterDirection.Input, 0, 0)
	.AddParameter("declined_amount", SqlDbType.money, ParameterDirection.Input, 0, 0)
	.AddParameter("approved_amount", SqlDbType.money, ParameterDirection.Input, 0, 0)
	.AddParameter("ex_gratia", SqlDbType.money, ParameterDirection.Input, 0, 0)
	.AddParameter("deductible", SqlDbType.money, ParameterDirection.Input, 0, 0)
	.AddParameter("payable", SqlDbType.money, ParameterDirection.Input, 0, 0)
	.AddParameter("is_novalidate", SqlDbType.bit, ParameterDirection.Input, 0, 0)
	.AddParameter("is_recover", SqlDbType.tinyint, ParameterDirection.Input, 0, 0)
	.AddParameter("message", SqlDbType.text, ParameterDirection.Input, -1, "")
	.AddParameter("remarks", SqlDbType.text, ParameterDirection.Input, -1, "")
	.AddParameter("status_code", SqlDbType.char, ParameterDirection.Input, 1, "")
	.AddParameter("sub_status_code", SqlDbType.char, ParameterDirection.Input, 3, "")
	
	.AddParameter("action", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.Int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.VarChar, ParameterDirection.InputOutput, 200, "")
End With

With DBConnection.NewCommand("ValidateService", "ValidateService", CommandType.StoredProcedure)
	.AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.Int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.VarChar, ParameterDirection.InputOutput, 200, "")
End With
