if not exists (select * from sys.objects where type = 'P' and object_id = object_id('dbo.SaveTopic_QuestionForTopicId'))

	begin

		exec('create procedure [dbo].[SaveTopic_QuestionForTopicId] as begin set nocount on; end')

	end
go

ALTER PROCEDURE [dbo].[SaveTopic_QuestionForTopicId]
(
	  @p_topicId bigint
	, @p_questionIdList idDisplayOrder_table READONLY 
	, @p_user as bigint 
)
AS
/**********************************************************************************************************************
//  Purpose:	When saving dbo.Topic_Question - pass in 1 TopicId with a list of QuestionId's to associate to
//
//			    The list if QuestionId's must be the FULL LIST
//                + if a QuestionId in the List is NOT associated to the TopicId passed in, it will be ADDED
//                + if a QuestionId in not in the List but is associated to the TopicId passed in, it will be REMOVED
//
//  Input:
//    @p_topicId - dbo.Topic.TopicId - you want to associate the list of Questions to this TaskId
//    @p_questionIdList - list of 0 to many Id values that correspond to dbo.Question.QuestionId values + Display Order
//      Columns in the user defined data type: idDisplayOrder_table
//        Id - QuestionId
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
//  2020-07-10                   Created procedure
//  
**********************************************************************************************************************/
BEGIN

	-- ===============================================================================================================
	-- Step 1:  Remove QustionId's from dbo.Topic_Question that are associated to the TopicId passed in but NOT in the List
	--          Look at QuestionId + DisplayOrder (even if DisplayOrder was changed for existing QuestionId, remove it as it will be added below)
	-- ===============================================================================================================

	DELETE TQ
	FROM dbo.Topic_Question as TQ
	LEFT JOIN @p_questionIdList as LIST
	    ON TQ.QuestionId = LIST.Id
	   AND TQ.DisplayOrder = LIST.DisplayOrder
	WHERE TQ.TopicId = @p_topicId
	  AND LIST.Id IS NULL


	-- ===============================================================================================================
	-- Step 2:  Add QustionId's to dbo.Topic_Question that are in the List but NOT associated to the TopicId passed in
	-- ===============================================================================================================

	INSERT INTO dbo.Topic_Question
	(	  TopicId
		, QuestionId
		, DisplayOrder
	)
	SELECT @p_topicId
	     , LIST.Id
		 , LIST.DisplayOrder
	FROM @p_questionIdList as LIST
	LEFT JOIN dbo.Topic_Question as TQ
	    ON TQ.TopicId = @p_topicId
	   AND TQ.QuestionId = LIST.Id
	   AND TQ.DisplayOrder = LIST.DisplayOrder
	WHERE TQ.TopicId IS NULL


END