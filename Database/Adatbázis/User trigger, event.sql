CREATE DEFINER=`root`@`localhost` TRIGGER brakingpoint.ChangePictureFrame
        BEFORE UPDATE
	ON brakingpoint.users
	FOR EACH ROW
        BEGIN
             IF NEW.level < 50 THEN
                SET NEW.picture_frame = 'bronze.png';

             ELSEIF NEW.level >= 50 && NEW.level < 125 THEN
                SET NEW.picture_frame = 'silver.png';

             ELSEIF NEW.level >= 125 && NEW.level < 200 THEN
                SET NEW.picture_frame = 'gold.png';

             ELSEIF NEW.level >= 200 && NEW.level < 300 THEN
                SET NEW.picture_frame = 'diamond.png';

             ELSE
                SET NEW.picture_frame = 'amethyst.png';
             END IF;
         END

CREATE DEFINER = 'root'@'localhost' EVENT brakingpoint.UpBalanceEveryWeek
        ON SCHEDULE EVERY '1' WEEK
	ON COMPLETION PRESERVE
	   DO
             UPDATE users SET balance = balance + 500;

     ALTER DEFINER = 'root'@'localhost' EVENT brakingpoint.UpBalanceEveryWeek
	 ENABLE
