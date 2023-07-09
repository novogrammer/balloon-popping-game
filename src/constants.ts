import InputCharactorInterface from "./InputCharactorInterface";

export const IS_DEBUG=true;

export const COUNTDOWN_DURATION=3;
export const GAME_DURATION=3;
export const TIMEOUT_DURATION=3;

export const PREPARING_DURATION=1;
export const READY_DURATION=1;
export const POPPING_DURATION=1;
export const AWAY_DURATION=1;
export const RESULT_PLAYER_SCORE_LIST_QTY=10;

export const NAME_LENGTH=3;
export const NAME_INPUT_CHARACTOR_LIST:InputCharactorInterface[]=
(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ"+
  "0123456789"
)
.split("")
.map((c)=>({label:c,charactor:c})).concat([
  {
    label:"_",
    charactor:" ",
  },
]);

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


