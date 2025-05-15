export declare function scrapeCDCDiabetesData(): Promise<Array<{
    headers: string[];
    data: Array<Record<string, string>>;
    caption?: string;
  }>>;