if not exists (select * from sys.types where is_table_type = 1 and name = 'id_table')

	begin

		create type id_table as table
		(
			Id bigint not null
		)

	end