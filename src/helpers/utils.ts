export function capitalizedMessage(message: any): string {
  // Ensure that the message is a string
  const strMessage = typeof message === 'string' ? message : String(message);

  return strMessage.charAt(0).toUpperCase() + strMessage.slice(1);
}

export function trimUrl(url: string): string {
  // Regular expression to remove "http://", "https://", and "www."
  return url.replace(/^(https?:\/\/)?(www\.)?/, '');
}

export enum DnsRecordType {
  ALL = 'all',
  A = 'A',
  AAAA = 'AAAA',
  MX = 'MX',
  NS = 'NS',
  SOA = 'SOA',
  TXT = 'TXT',
  SPF = 'SPF',
}
