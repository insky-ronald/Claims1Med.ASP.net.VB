USE [MEDICS52SYS]
GO

/****** Object:  Table [dbo].[user_types]    Script Date: 5/15/2018 9:54:00 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[user_types](
	[id] [int] NOT NULL,
	[code] [varchar](10) NOT NULL,
	[role_id] [int] NOT NULL,
	[user_type] [varchar](100) NOT NULL,
	[description] [varchar](200) NOT NULL,
	[insert_visit_id] [bigint] NOT NULL,
	[inserted_at] [datetime] NOT NULL,
	[update_visit_id] [bigint] NOT NULL,
	[updated_at] [datetime] NOT NULL,
	[status_code_id] [int] NOT NULL,
 CONSTRAINT [PK_user_types] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO

ALTER TABLE [dbo].[user_types] ADD  CONSTRAINT [DF_user_types_code]  DEFAULT ('') FOR [code]
GO

ALTER TABLE [dbo].[user_types] ADD  CONSTRAINT [DF_user_types_role_id]  DEFAULT ((0)) FOR [role_id]
GO

ALTER TABLE [dbo].[user_types] ADD  CONSTRAINT [DF_user_types_user_type]  DEFAULT ('') FOR [user_type]
GO

ALTER TABLE [dbo].[user_types] ADD  CONSTRAINT [DF_user_types_description]  DEFAULT ('') FOR [description]
GO

ALTER TABLE [dbo].[user_types] ADD  CONSTRAINT [DF_user_types_insert_visit_id]  DEFAULT ((0)) FOR [insert_visit_id]
GO

ALTER TABLE [dbo].[user_types] ADD  CONSTRAINT [DF_user_types_inserted_at]  DEFAULT (getdate()) FOR [inserted_at]
GO

ALTER TABLE [dbo].[user_types] ADD  CONSTRAINT [DF_user_types_update_visit_id]  DEFAULT ((0)) FOR [update_visit_id]
GO

ALTER TABLE [dbo].[user_types] ADD  CONSTRAINT [DF_user_types_updated_at]  DEFAULT (getdate()) FOR [updated_at]
GO

ALTER TABLE [dbo].[user_types] ADD  CONSTRAINT [DF_user_types_status_code_id]  DEFAULT ((10)) FOR [status_code_id]
GO


