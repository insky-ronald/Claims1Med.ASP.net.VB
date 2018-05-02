With DBConnection.NewCommand("GetAddress", "GetAddress", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("name_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
	.AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)	
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 
    
With DBConnection.NewCommand("AddAddress", "AddAddress", CommandType.StoredProcedure)
	.AddParameter("id", SqlDbType.Int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("name_id", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	.AddParameter("address_type", SqlDbType.Char, ParameterDirection.Input, 3, "")
	.AddParameter("street", SqlDbType.VarChar, ParameterDirection.Input, 100, "")
	.AddParameter("city", SqlDbType.VarChar, ParameterDirection.Input, 20, "")
	.AddParameter("province", SqlDbType.VarChar, ParameterDirection.Input, 30, "")
	.AddParameter("zip_code", SqlDbType.VarChar, ParameterDirection.Input, 20, "")
	.AddParameter("country_code", SqlDbType.Char, ParameterDirection.Input, 3, "")
	.AddParameter("phone_no1", SqlDbType.VarChar, ParameterDirection.Input, 20, "")
	.AddParameter("phone_no2", SqlDbType.VarChar, ParameterDirection.Input, 20, "")
	.AddParameter("fax_no1", SqlDbType.VarChar, ParameterDirection.Input, 20, "")
	.AddParameter("fax_no2", SqlDbType.VarChar, ParameterDirection.Input, 20, "")
	.AddParameter("email", SqlDbType.VarChar, ParameterDirection.Input, 60, "")

	.AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
End with

With DBConnection.NewCommand("GetAddressTypes", "GetAddressTypes", CommandType.StoredProcedure)
    .AddParameter("code", SqlDbType.VarChar, ParameterDirection.Input, 3, "")
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
    .AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 0)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "code")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("AddAddressTypes", "AddAddressTypes", CommandType.StoredProcedure)
	.AddParameter("code", SqlDbType.VarChar, ParameterDirection.InputOutput, 3, "")
	.AddParameter("address_type", SqlDbType.VarChar, ParameterDirection.Input, 60, "")

	.AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
End with 

With DBConnection.NewCommand("SetDefaultAddress", "SetDefaultAddress", CommandType.StoredProcedure)
	.AddParameter("name_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
	.AddParameter("address_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
End with 

With DBConnection.NewCommand("lookup_address_types", "GetAddressTypes", CommandType.StoredProcedure)
    ' .AddParameter("code", SqlDbType.VarChar, ParameterDirection.Input, 3, "")
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
    .AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With
