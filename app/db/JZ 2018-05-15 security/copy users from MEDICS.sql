USE [MEDICS52SYS]
GO

DELETE users WHERE id > 1
GO

SET IDENTITY_INSERT users on

INSERT INTO [dbo].[users]
           ([id]
		   ,[organisation_id]
           ,[last_name]
           ,[middle_name]
           ,[first_name]
           ,[gender]
           ,[dob]
           ,[email]
           ,[status_code_id])
     SELECT
			id
		   ,1
           ,name
           ,''
           ,''
           ,''
           ,NULL
           ,''
           ,CASE WHEN is_active = 1 THEN 10 ELSE 0 END
	 FROM tb_users WHERE id > 1

SET IDENTITY_INSERT users off
GO

DELETE application_users WHERE user_id > 1
GO

INSERT INTO [dbo].[application_users]
           ([application_id]
		   ,[user_id])
     SELECT
			5002
		   ,id
	 FROM tb_users WHERE id > 1
GO

DELETE user_login_info WHERE id > 1
GO

INSERT INTO [dbo].user_login_info
           (id
		   ,user_name
		   ,password)
     SELECT
			id
		   ,user_name
		   ,HASHBYTES ('SHA1', 'pass1234')
	 FROM tb_users WHERE id > 1
GO


DELETE application_users WHERE application_id > 0
GO

INSERT INTO [dbo].application_users
           (user_id
		   ,application_id)
     SELECT
			id
		   ,5002
	 FROM tb_users WHERE id > 1
GO


DELETE user_roles WHERE user_id > 1
GO

INSERT INTO [dbo].user_roles
           (user_id
		   ,role_id)
     SELECT
			id
		   ,10
	 FROM tb_users WHERE id > 1
GO


INSERT INTO [dbo].user_roles
           (user_id
		   ,role_id)
     SELECT
			id
		   ,233
	 FROM MEDICS40LDA..USERGROUPS ug
	 JOIN tb_users u on ug.USER_ID = u.user_name
	 WHERE ug.GROUP_ID = 'ADMIN'
GO

INSERT INTO [dbo].user_roles
           (user_id
		   ,role_id)
     SELECT
			id
		   ,220
	 FROM MEDICS40LDA..USERGROUPS ug
	 JOIN tb_users u on ug.USER_ID = u.user_name
	 WHERE ug.GROUP_ID = 'LEV2'
GO


INSERT INTO [dbo].user_roles
           (user_id
		   ,role_id)
     SELECT
			id
		   ,234
	 FROM MEDICS40LDA..USERGROUPS ug
	 JOIN tb_users u on ug.USER_ID = u.user_name
	 WHERE ug.GROUP_ID = 'LEV3'
GO

INSERT INTO [dbo].user_roles
           (user_id
		   ,role_id)
     SELECT
			id
		   ,235
	 FROM MEDICS40LDA..USERGROUPS ug
	 JOIN tb_users u on ug.USER_ID = u.user_name
	 WHERE ug.GROUP_ID = 'LEV4'
GO
