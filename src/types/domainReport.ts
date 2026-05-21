export type AnalysisCategory =
  | "malicious"
  | "suspicious"
  | "undetected"
  | "harmless"
  | "timeout";

export type AnalysisStats = Record<AnalysisCategory, number>;

export type AnalysisResult = {
  method?: string;
  engine_name: string;
  category: AnalysisCategory | string;
  result: string;
};

export type DnsRecord = {
  type: string;
  ttl: number;
  value: string;
};

export type VcardItem = {
  name: string;
  values?: string[];
};

export type RdapEntity = {
  roles?: string[];
  vcard_array?: VcardItem[];
  entities?: RdapEntity[];
};

export type RdapEvent = {
  event_action: string;
  event_date: string;
};

export type Nameserver = {
  ldh_name: string;
};

export type Certificate = {
  validity?: {
    not_after?: string;
    not_before?: string;
  };
  public_key?: {
    algorithm?: string;
    ec?: {
      oid?: string;
    };
  };
  thumbprint_sha256?: string;
  issuer?: {
    O?: string;
    CN?: string;
  };
  subject?: {
    CN?: string;
  };
  extensions?: {
    subject_alternative_name?: string[];
  };
};

export type DomainAttributes = {
  last_analysis_date?: number;
  last_analysis_stats?: Partial<AnalysisStats>;
  tld?: string;
  tags?: string[];
  last_analysis_results?: Record<string, AnalysisResult>;
  last_dns_records?: DnsRecord[];
  rdap?: {
    events?: RdapEvent[];
    nameservers?: Nameserver[];
    entities?: RdapEntity[];
  };
  reputation?: number;
  creation_date?: number;
  last_update_date?: number;
  last_https_certificate?: Certificate;
};

export type DomainReportData = {
  id: string;
  type: string;
  links?: {
    self?: string;
  };
  attributes?: DomainAttributes;
  scanOptions?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ScannerResponse = {
  status: number;
  data?: {
    data?: DomainReportData;
  };
}
