DROP VIEW relationships
GO

CREATE VIEW relationships
AS
	SELECT
		REL_CODE as code,
		RELATION as relationship,
		SEX as sex
	FROM [tb_relationships]