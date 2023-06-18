CREATE 
	DEFINER = 'root'@'localhost'
TRIGGER brakingpoint.updateTicketsStatus
	AFTER UPDATE
	ON brakingpoint.available_bets
	FOR EACH ROW
BEGIN
IF NEW.status = 'winFirst' THEN
    UPDATE tickets SET status = 'win'
    WHERE betID = NEW.available_betID AND sum_odds = NEW.odds;
ELSEIF NEW.status = 'winSecond' THEN
    UPDATE tickets SET status = 'win'
    WHERE betID = NEW.available_betID AND sum_odds = NEW.odds2;
ELSEIF NEW.status = 'win' THEN
    UPDATE tickets SET status = 'win'
    WHERE betID = NEW.available_betID;
ELSEIF NEW.status = 'lose' THEN
    UPDATE tickets SET status = 'lose'
    WHERE betID = NEW.available_betID;
  END IF;
END

CREATE 
	DEFINER = 'root'@'localhost'
TRIGGER brakingpoint.ticketPayout
	AFTER UPDATE
	ON brakingpoint.tickets
	FOR EACH ROW
BEGIN
 IF NEW.status = 'win' AND OLD.status <> 'win' THEN
    UPDATE users 
      SET balance = balance + (NEW.sum_odds * NEW.debt)
      WHERE userID = NEW.userID;
  END IF;
END

CREATE 
	DEFINER = 'root'@'localhost'
TRIGGER brakingpoint.deductDebt
	AFTER INSERT
	ON brakingpoint.tickets
	FOR EACH ROW
BEGIN
  DECLARE user_balance DECIMAL(10,2);
    SELECT balance INTO user_balance FROM users WHERE userID = NEW.userID;
    IF user_balance >= NEW.debt THEN
        UPDATE users SET balance = balance - NEW.debt WHERE userID = NEW.userID;
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient balance';
    END IF;
END
