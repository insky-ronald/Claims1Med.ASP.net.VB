With DBConnection.NewCommand("GetMembersEnquiry", "GetMembersEnquiry", CommandType.StoredProcedure)
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
    .AddParameter("client_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("policy_no", SqlDbType.varchar, ParameterDirection.Input, 20, "")
    .AddParameter("certificate_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
	
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 
