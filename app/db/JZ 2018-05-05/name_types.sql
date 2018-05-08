DROP VIEW [dbo].[name_types]
GO

CREATE VIEW [dbo].[name_types]
AS
	SELECT
		ACCT_TYPE as code,
		ACCT_DESC as name_type,
		INTERNAL as is_internal
	FROM [tb_name_types]
