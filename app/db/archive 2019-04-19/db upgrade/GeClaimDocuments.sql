DROP PROCEDURE [dbo].[GeClaimDocuments]
GO

CREATE PROCEDURE [dbo].[GeClaimDocuments] 
-- ***************************************************************************************************
-- Last modified on
-- 06-OCT-2017
-- *************************************************************************************************** 
(
    @claim_id int = 0, 
	@service_id int = 0, 
	@document_source char(1) = '',
	@sort varchar(200) = '',
	@order varchar(10) = '',

    @visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;

    --DECLARE @user_id AS int = dbo.F_VisitUserID(@visit_id)
	DECLARE @user_id AS int = 0
    DECLARE @where AS varchar(100)
	DECLARE @sql nvarchar(MAX)
	DECLARE @params nvarchar(max)
	DECLARE @param_id int

	IF LEN(@document_source) = 0 SET @document_source = 'O'
	IF LEN(@sort) = 0 SET @sort = 'service_no'
	IF LEN(@order) = 0 SET @order = 'asc'

	IF @service_id = 0
	BEGIN
		SET @param_id = @claim_id
		SET @params = '@claim_id int, @document_source char(1)'
		SET @where = 'claim_id = @claim_id AND document_source = @document_source'
	END ELSE BEGIN
		SET @param_id = @service_id
		SET @params = '@service_id int, @document_source char(1)'
		SET @where = 'service_id = @service_id AND document_source = @document_source'
	END

	SET @sql = '
		SELECT
			*
		FROM v_claim_documents
		WHERE
	' + @where + ' ORDER BY ' + @sort +' '+ @order

	EXEC sp_executesql @sql, @params, @param_id,  @document_source
END
GO
