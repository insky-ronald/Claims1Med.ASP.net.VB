' ****************************************************************************************************
' Database objects used:
' W:\MediCSV5\app\db\db upgrade\GeClaimDocuments.sql
' W:\MediCSV5\app\db\db upgrade\v_claim_documents.sql
' W:\MediCSV5\app\db\db upgrade\f_document_status.sql
' W:\MediCSV5\app\db\db upgrade\f_document_source.sql
' ****************************************************************************************************
With DBConnection.NewCommand("GetTemplate_GOP_GM01", "GetTemplate_GOP_GM01", CommandType.StoredProcedure)
    .AddParameter("claim_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("service_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With
