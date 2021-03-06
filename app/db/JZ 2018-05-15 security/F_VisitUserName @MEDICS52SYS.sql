USE [MEDICS52SYS]
GO
/****** Object:  UserDefinedFunction [dbo].[F_VisitUserName]    Script Date: 5/15/2018 10:39:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER FUNCTION [dbo].[F_VisitUserName]
-- ***************************************************************************************************
-- Last modified on
-- 04-JAN-2015 ihms.0.0.1.8
-- *************************************************************************************************** 
(
  @visit_id as bigint = 0
) RETURNS varchar(50)
AS
BEGIN
  DECLARE @user_name AS varchar(50)
  SELECT 
    @user_name = u.[user_name] 
  FROM dbo.visits v
  --JOIN INSKY02.dbo.users u ON v.USER_ID = u.id
  JOIN tb_users u ON v.USER_ID = u.id
  WHERE v.[id] = @visit_id AND v.[id] > 0
  
  RETURN @user_name
END
