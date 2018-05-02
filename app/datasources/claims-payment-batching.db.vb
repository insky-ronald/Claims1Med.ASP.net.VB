With DBConnection.NewCommand("GetClaimsBatching", "GetClaimsBatching", CommandType.StoredProcedure)
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 50)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "")
	.AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "")
End With 

With DBConnection.NewCommand("AuthorizeBatchInvoice", "AuthorizeBatchInvoice", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("authorise", SqlDbType.int, ParameterDirection.Input, 0, 0)
	.AddParameter("module", SqlDbType.char, ParameterDirection.Input, 3, "INV")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
    .AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 2048, "")
End With 
