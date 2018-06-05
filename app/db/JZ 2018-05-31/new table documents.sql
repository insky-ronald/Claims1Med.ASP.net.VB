USE [MEDICS52]
GO

DROP TABLE [dbo].[documents]
GO

CREATE TABLE [dbo].[documents] (
	[id] [int] IDENTITY(1,1) NOT NULL,
	[file_name] [nvarchar](500) NOT NULL DEFAULT '',
	[file_extension] [nvarchar](30) NOT NULL DEFAULT '',
	[type_id] [int] NOT NULL DEFAULT 0, -- 0: unknwon, 1:raster image, ...
	[size] [int] NOT NULL DEFAULT 0,
	[archive_location] [nvarchar](200) NOT NULL DEFAULT '',
	[update_date] [datetime] NULL,
	[update_user] [varchar](10) NULL,
	[create_date] [datetime] NULL,
	[create_user] [varchar](10) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
