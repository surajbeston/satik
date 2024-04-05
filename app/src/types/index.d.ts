interface CreateCPMContractParams {
  uniqueId: number;
  initialAmount?: number;
  initialAmountOnReach?: number;
  startsOn: Date;
  startsOnReach: number;
  endsOn: Date;
  endsOnReach: number;
  cpm: number;
  contentUrl: number;
}
