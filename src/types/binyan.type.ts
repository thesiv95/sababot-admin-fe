type BinyanPast = {
  me: string;
  youMaleSingle: string;
  youFemaleSingle: string;
  he: string;
  she: string;
  we: string;
  youMalePlural: string;
  youFemalePlural: string;
  theyMalePlural: string;
  theyFemalePlural: string;
};

type BinyanPresent = {
  maleSingle: string;
  femaleSingle: string;
  malePlural: string;
  femalePlural: string;
};

export type Binyan = {
  translit: string;
  ru: string;
  infinitive: string;
  binyanType: string;
  root: string;
  timePresent: BinyanPresent;
  timePast: BinyanPast;
};
