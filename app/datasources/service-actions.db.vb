With DBConnection.NewCommand("GetServiceActions", "GetServiceActions", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("service_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("AddServiceAction", "AddServiceAction", CommandType.StoredProcedure)
	.AddParameter("id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)	
	.AddParameter("service_id", SqlDbType.int, ParameterDirection.Input, 0, 0)	
	.AddParameter("action_type_code", SqlDbType.char, ParameterDirection.Input, 3, "")
	.AddParameter("action_code", SqlDbType.char, ParameterDirection.Input, 3, "")
	.AddParameter("action_owner", SqlDbType.varchar, ParameterDirection.Input, 10, "")
	.AddParameter("due_date", SqlDbType.datetime, ParameterDirection.Input, 0, Nothing)
	.AddParameter("notes", SqlDbType.varchar, ParameterDirection.Input, -1, "")
	.AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
End With 

With DBConnection.NewCommand("lookup_actions", "GetActionTypesTree", CommandType.StoredProcedure)
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With
