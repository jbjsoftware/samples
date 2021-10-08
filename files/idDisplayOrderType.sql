if not exists (select * from sys.types where is_table_type = 1 and name = 'idDisplayOrder_table')

	begin

		create type idDisplayOrder_table as table
		(
			  Id bigint not null
            , DisplayOrder int not null
		)

	end