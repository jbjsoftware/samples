if not exists (select * from sys.objects where type = 'P' and object_id = object_id('dbo.SaveTopic_QuestionForQuestionId'))

	begin

		exec('create procedure [dbo].[SaveTopic_QuestionForQuestionId] as begin set nocount on; end')

	end
go

ALTER PROCEDURE [dbo].[SaveTopic_QuestionForQuestionId]
(
	  @p_questionId bigint
	, @p_topicIdList idDisplayOrder_table READONLY 
	, @p_user as bigint 
)
AS
/**********************************************************************************************************************
//  Purpose:	When saving dbo.Topic_Question - pass in 1 QuestionId with a list of TopicId's to associate to
//
//			    The list if TopicId's must be the FULL LIST
//                + if a TopicId in the List is NOT associated to the QuestionId passed in, it will be ADDED
//                + if a TopicId in not in the List but is associated to the QuestionId passed in, it will be REMOVED
//
//  Input:
//    @p_QuestionId - dbo.Question.QuestionId - you want to associate the list of Topics to this QuestionId
//    @p_topicIdList - list of 0 to many Id values that correspond to dbo.Topic.TopicId values + Display Order
//      Columns in the user defined data type: idDisplayOrder_table
//        Id - TopicId
//        DisplayOrder - the # corresponding to the order in which they should be displayed
//    @p_user - the ClearingHouse.dbo.AppUser.AppUserId for the user performing this update
//
//  Output:
//    No result sets returned
//
//  Change History:
//  --------------             Story/
//  Date        Developer      Task     Description
//  ----------  -------------- -------  ------------------------------------------------------------------------------
//  2020-07-10               Created procedure
//  
**********************************************************************************************************************/
BEGIN

	-- ===============================================================================================================
	-- Step 1:  Remove TopicId's from dbo.Topic_Question that are associated to the QuestionId passed in but NOT in the List
	--          Look at TopicId + DisplayOrder (even if DisplayOrder was changed for existing TopicId, remove it as it will be added below)
	-- ===============================================================================================================

	DELETE TQ
	FROM dbo.Topic_Question as TQ
	LEFT JOIN @p_topicIdList as LIST
	    ON TQ.TopicId = LIST.Id
	   AND TQ.DisplayOrder = LIST.DisplayOrder
	WHERE TQ.QuestionId = @p_questionId
	  AND LIST.Id IS NULL


	-- ===============================================================================================================
	-- Step 2:  Add TopicId's to dbo.Topic_Question that are in the List but NOT associated to the QuestionId passed in
	-- ===============================================================================================================

	INSERT INTO dbo.Topic_Question
	(	  QuestionId
		, TopicId
		, DisplayOrder
	)
	SELECT @p_questionId
	     , LIST.Id
		 , LIST.DisplayOrder
	FROM @p_topicIdList as LIST
	LEFT JOIN dbo.Topic_Question as TQ
	    ON TQ.QuestionId = @p_questionId
	   AND TQ.TopicId = LIST.Id
	   AND TQ.DisplayOrder = LIST.DisplayOrder
	WHERE TQ.QuestionId IS NULL


END