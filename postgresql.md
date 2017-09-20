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
	BEGIN
		SELECT COUNT(pitch.id) FROM pitch LEFT JOIN personalia ON personalia.id = pitch.person WHERE personalia.email = mail AND pitch.slot = slot_id INTO count;
		IF count > 0 THEN
			RETURN TRUE;
		ELSE
			RETURN FALSE;
		END IF;
	END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER insert_pitch AFTER INSERT ON pitch FOR EACH ROW EXECUTE PROCEDURE increase_no_pitches();
CREATE TRIGGER delete_pitch AFTER DELETE ON pitch FOR EACH ROW EXECUTE PROCEDURE decrease_no_pitches();
```
