' ****************************************************************************************************
' Database objects used:
' W:\MediCSV5\app\db\db upgrade\GeClaimDocuments.sql
' W:\MediCSV5\app\db\db upgrade\v_claim_documents.sql
' W:\MediCSV5\app\db\db upgrade\f_document_status.sql
' W:\MediCSV5\app\db\db upgrade\f_document_source.sql
' ****************************************************************************************************
With DBConnection.NewCommand("GetDocuments", "GetDocuments", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("filter", SqlDbType.nvarchar, ParameterDirection.Input, 100, "")
    .AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With
