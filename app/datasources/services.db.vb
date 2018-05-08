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
