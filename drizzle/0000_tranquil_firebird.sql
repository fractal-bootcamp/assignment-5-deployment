CREATE TABLE "tic_tac_toe_games" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"currentPlayer" varchar(1) NOT NULL,
	"board" jsonb NOT NULL,
	"result" varchar(1) NOT NULL
);
