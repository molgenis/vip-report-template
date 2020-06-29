export interface Alert {
  type: 'success' | 'info' | 'warning' | 'error';
  messageId: string;
  messageArgs: Array<string>;
}
