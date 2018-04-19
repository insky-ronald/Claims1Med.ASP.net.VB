<%@ WebHandler Language="VB" Class="Api" %>

Imports System.Drawing
Imports System.Drawing.Imaging
Imports System.Drawing.Drawing2D

Public Class Api
	Inherits DataHandler.BaseApi
		
	Protected Overrides Function CheckAuthorization As Boolean
		Return False
	End Function
	
	Public Function grayscale(ByVal img As Image) As Boolean
		Dim cm As ColorMatrix = New ColorMatrix(New Single()() _
							   {New Single() {0.299, 0.299, 0.299, 0, 0}, _
								New Single() {0.587, 0.587, 0.587, 0, 0}, _
								New Single() {0.114, 0.114, 0.114, 0, 0}, _
								New Single() {0, 0, 0, 1, 0}, _
								New Single() {0, 0, 0, 0, 1}})

		REM Return draw_adjusted_image(img, cm)
		Return True 'draw_adjusted_image(img, cm)
	End Function
	
	Private Function GetEncoder(ByVal format As ImageFormat) As ImageCodecInfo

		Dim codecs As ImageCodecInfo() = ImageCodecInfo.GetImageDecoders()

		Dim codec As ImageCodecInfo
		For Each codec In codecs
			If codec.FormatID = format.Guid Then
				Return codec
			End If
		Next codec
		Return Nothing

	End Function
	
	Protected Overrides Sub ReturnOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ReturnOutput(Cmd, Output)
		
		If Cmd = "test" ' Return one image from file
			Response.Clear
			Response.ContentType = "image/jpeg"
			Using Img = New Bitmap("C:\inetpub\wwwroot\TNP5\images\main-location-bangkok.jpg")
				Img.Save(Response.OutputStream, ImageFormat.Jpeg)
			End Using
			Response.End
		Else If Cmd = "optimize" ' Return one image from file
			Response.Clear
			Response.ContentType = "image/jpeg"
			Using Img = New Bitmap("C:\inetpub\wwwroot\TNP5\images\main-location-bangkok.jpg")
				
				Dim jpgEncoder As ImageCodecInfo = GetEncoder(ImageFormat.Jpeg)

				' Create an Encoder object based on the GUID
				' for the Quality parameter category.
				Dim myEncoder As System.Drawing.Imaging.Encoder = System.Drawing.Imaging.Encoder.Quality

				' Create an EncoderParameters object.
				' An EncoderParameters object has an array of EncoderParameter
				' objects. In this case, there is only one
				' EncoderParameter object in the array.
				Dim myEncoderParameters As New EncoderParameters(1)

				Dim myEncoderParameter As New EncoderParameter(myEncoder, 0&)
				REM Dim myEncoderParameter As New EncoderParameter(myEncoder, 50&)
				myEncoderParameters.Param(0) = myEncoderParameter
				Img.Save("C:\inetpub\wwwroot\TNP5\images\main-location-bangkok-2.jpg", jpgEncoder, myEncoderParameters)
				
				REM Img.Save("C:\inetpub\wwwroot\TNP5\images\main-location-bangkok-2.jpg", ImageFormat.Jpeg)
			End Using
			Response.End
		Else If Cmd = "gray" ' Return one image from file in grayscale
			Response.Clear
			Response.ContentType = "image/jpeg"
									
			Using Img = New Bitmap("C:\inetpub\wwwroot\TNP5\images\main-location-bangkok.jpg")
				Dim cm As ColorMatrix = New ColorMatrix(New Single()() _
									   {New Single() {0.299, 0.299, 0.299, 0, 0}, _
										New Single() {0.587, 0.587, 0.587, 0, 0}, _
										New Single() {0.114, 0.114, 0.114, 0, 0}, _
										New Single() {0, 0, 0, 1, 0}, _
										New Single() {0, 0, 0, 0, 1}})

				Dim bmp As New Bitmap(img) ' create a copy of the source image 
				Dim imgattr As New ImageAttributes()
				Dim rc As New Rectangle(0, 0, img.Width, img.Height)
				Dim g As Graphics = Graphics.FromImage(img)
				
				' associate the ColorMatrix object with an ImageAttributes object
				imgattr.SetColorMatrix(cm) 
				
				' draw the copy of the source image back over the original image, 
				'applying the ColorMatrix
				g.DrawImage(bmp, rc, 0, 0, img.Width, img.Height, GraphicsUnit.Pixel, imgattr)
				g.Dispose()
				bmp.Dispose
				
				Img.Save(Response.OutputStream, ImageFormat.Jpeg)
			End Using
			Response.End
		End if
	End Sub
	
End Class
