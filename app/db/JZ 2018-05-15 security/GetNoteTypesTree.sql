USE [MEDICS52]
GO

DROP PROCEDURE [dbo].[GetNoteTypesTree]
GO

CREATE PROCEDURE [dbo].[GetNoteTypesTree]
-- ***************************************************************************************************
-- Last modified on
-- 
-- *************************************************************************************************** 
(
    @visit_id as bigint = 0
)
AS
BEGIN
    SET NOCOUNT ON;

	with CTE as (
		select 
			code as id,
			'000' as parent_id,
			code as main_code,
			cast('' as char(3)) as sub_code,
			note_type as description
		from note_types
		union
		select 
			note_type+'.'+code as id,
			note_type as parent_id,
			note_type as main_code,
			code as sub_code,
			note_sub_type as description
		from note_sub_types
	) select * from cte order by id
END
