import InputCharactorInterface from "./InputCharactorInterface";

export const IS_DEBUG=false;

export const FOVY=60;

export const COUNTDOWN_DURATION=3;
export const GAME_DURATION=30;
export const TIMEOUT_DURATION=3;

export const PREPARING_DURATION=1;
export const READY_DURATION=1;
export const POPPING_DURATION=0.5;
export const AWAY_DURATION=1;
export const RESULT_PLAYER_SCORE_LIST_QTY=10;

export const NAME_LENGTH=3;
export const NAME_INPUT_CHARACTOR_LIST:InputCharactorInterface[]=
(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ"+
  "0123456789"+
  "!?._"
)
.split("")
.map((c)=>({label:c,charactor:c})).concat([]);

export const RANK_TEXT_LIST=[
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  "6th",
  "7th",
  "8th",
  "9th",
  "10th",
];

export const INPUT_BLINK_CYCLE=0.25;

export const FOOT_LIFT_Y=2;
export const FOOT_MOVE_UP_DURATION=0.2;
export const FOOT_MOVE_DOWN_DURATION=0.1;

export const GAME_HEIGHT=7;

export const STAR_EFFECT_QTY=10;
export const STAR_EFFECT_MOVE_LENGTH=1;


