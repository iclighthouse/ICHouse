export type Vol = string;
export type PNL = string;

export interface CompetitionSort {
  vol?: Vol;
  pnl?: PNL;
  volRank?: number;
  pnlRank?: number;
  score?: number;
  scoreRank?: number;
}
