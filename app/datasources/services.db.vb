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
