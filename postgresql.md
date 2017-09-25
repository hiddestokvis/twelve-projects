```SQL
CREATE OR REPLACE FUNCTION increase_no_pitches() RETURNS TRIGGER AS
$$
	BEGIN
		UPDATE slot SET no_pitches = no_pitches + 1 WHERE id = NEW.slot;
		RETURN NULL;
	END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrease_no_pitches() RETURNS TRIGGER AS
$$
	BEGIN
		UPDATE slot SET no_pitches = no_pitches - 1 WHERE id = OLD.slot;
		RETURN NULL;
	END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION email_in_slot(mail TEXT, slot_id INT) RETURNS BOOLEAN AS
$$
	DECLARE
		count INT;
		count_free INT;
	BEGIN
		SELECT COUNT(pitch.id) FROM pitch LEFT JOIN personalia ON personalia.id = pitch.person WHERE personalia.email = mail AND pitch.slot != 1 INTO count;
		SELECT COUNT(pitch.id) FROM pitch LEFT JOIN personalia ON personalia.id = pitch.person WHERE personalia.email = mail AND pitch.slot = 1 INTO count_free;
		IF count > 0 OR count_free > 0 THEN
			RETURN TRUE;
		ELSE
			RETURN FALSE;
		END IF;
	END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER insert_pitch AFTER INSERT ON pitch FOR EACH ROW EXECUTE PROCEDURE increase_no_pitches();
CREATE TRIGGER delete_pitch AFTER DELETE ON pitch FOR EACH ROW EXECUTE PROCEDURE decrease_no_pitches();

CREATE OR REPLACE FUNCTION watch_table(target_table regclass, channel text) RETURNS void AS $$

DECLARE

  stmt text;

BEGIN

    -- Drop existing triggers if they exist.

    EXECUTE unwatch_table(target_table);



    -- Row level watch trigger.

    stmt = 'CREATE TRIGGER watch_trigger_row AFTER INSERT OR UPDATE OR DELETE ON ' ||

             target_table || ' FOR EACH ROW EXECUTE PROCEDURE if_modified_func(' ||

             quote_literal(channel) || ');';

    RAISE NOTICE '%', stmt;

    EXECUTE stmt;



    -- Truncate level watch trigger. This will not contain any row data.

    stmt = 'CREATE TRIGGER watch_trigger_stmt AFTER TRUNCATE ON ' ||

             target_table || ' FOR EACH STATEMENT EXECUTE PROCEDURE if_modified_func(' ||

             quote_literal(channel) || ');';

    RAISE NOTICE '%', stmt;

    EXECUTE stmt;



END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION if_modified_func() RETURNS TRIGGER AS $$

DECLARE

    channel text;

    payload jsonb;

    rowdata jsonb;

BEGIN

    IF TG_WHEN <> 'AFTER' THEN

        RAISE EXCEPTION 'if_modified_func() may only run as an AFTER trigger';

    END IF;



    -- Determine operation type

    IF (TG_OP = 'UPDATE' AND TG_LEVEL = 'ROW') THEN

        rowdata = row_to_json(OLD.*);

    ELSIF (TG_OP = 'DELETE' AND TG_LEVEL = 'ROW') THEN

        rowdata = row_to_json(OLD.*);

    ELSIF (TG_OP = 'INSERT' AND TG_LEVEL = 'ROW') THEN

        rowdata = row_to_json(NEW.*);

    ELSIF NOT (TG_LEVEL = 'STATEMENT' AND TG_OP IN ('INSERT','UPDATE','DELETE','TRUNCATE')) THEN

        RAISE EXCEPTION '[if_modified_func] - Trigger func added as trigger for unhandled case: %, %',TG_OP, TG_LEVEL;

        RETURN NULL;

    END IF;



    -- Construct JSON payload

    payload = jsonb_build_object('schema_name', TG_TABLE_SCHEMA::text,

                                 'table_name', TG_TABLE_NAME::text,

                                 'operation', TG_OP,

                                 'transaction_time', transaction_timestamp(),

                                 'capture_time', clock_timestamp(),

                                 'data', rowdata);



    channel = TG_ARGV[0];



    -- Notify to channel with serialized JSON payload.

    perform pg_notify(channel, payload::text);



    RETURN NULL;

END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION unwatch_table(target_table regclass) RETURNS void AS $$
BEGIN

    EXECUTE 'DROP TRIGGER IF EXISTS watch_trigger_row ON ' || target_table;

    EXECUTE 'DROP TRIGGER IF EXISTS watch_trigger_stmt ON ' || target_table;

END;

$$ LANGUAGE plpgsql;

select watch_table('pitch'::regclass, 'changefeed');
```
