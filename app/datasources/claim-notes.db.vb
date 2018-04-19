With DBConnection.NewCommand("GetClaimNotes", "GetClaimNotes", CommandType.StoredProcedure)
	.AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)	
	.AddParameter("type", SqlDbType.char, ParameterDirection.Input, 1, "")
	.AddParameter("claim_id", SqlDbType.int, ParameterDirection.Input, 0, 0)	
	.AddParameter("service_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
	.AddParameter("sort", SqlDbType.char, ParameterDirection.Input, 100, "")
	.AddParameter("order", SqlDbType.char, ParameterDirection.Input, 100, "")
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 
