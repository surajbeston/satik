export interface CreateCPMContractParams {
  uniqueId: string;
  initialAmount?: number;
  initialAmountOnReach?: number;
  startsOn: Date;
  startsOnReach: number;
  endsOn: Date;
  endsOnReach: number;
  cpm: number;
  contentUrl: number;
}
