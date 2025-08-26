export type Message = {
  id: number;
  type: 'request' | 'response';
  text: string;
};
