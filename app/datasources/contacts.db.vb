With DBConnection.NewCommand("GetContacts", "GetContacts", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("name_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

With DBConnection.NewCommand("AddContacts", "AddContacts", CommandType.StoredProcedure)
	.AddParameter("id", SqlDbType.Int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("name_id", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	.AddParameter("title", SqlDbType.VarChar, ParameterDirection.Input, 20, "")
	.AddParameter("full_name", SqlDbType.VarChar, ParameterDirection.Input, 50, "")
	.AddParameter("department", SqlDbType.VarChar, ParameterDirection.Input, 50, "")
	.AddParameter("position", SqlDbType.VarChar, ParameterDirection.Input, 50, "")
	.AddParameter("phone", SqlDbType.VarChar, ParameterDirection.Input, 20, "")
	.AddParameter("mobile", SqlDbType.VarChar, ParameterDirection.Input, 20, "")
	.AddParameter("fax", SqlDbType.VarChar, ParameterDirection.Input, 20, "")
	.AddParameter("email", SqlDbType.VarChar, ParameterDirection.Input, 60, "")

	.AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
End with

With DBConnection.NewCommand("SetDefaultContact", "SetDefaultContact", CommandType.StoredProcedure)
	.AddParameter("name_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
	.AddParameter("contact_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
End with 
