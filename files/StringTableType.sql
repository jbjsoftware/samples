if not exists (select * from sys.types where is_table_type = 1 and name = 'string_table')

	begin

		create type string_table as table
		(
			StringValue nvarchar(100) not null
		)

	end