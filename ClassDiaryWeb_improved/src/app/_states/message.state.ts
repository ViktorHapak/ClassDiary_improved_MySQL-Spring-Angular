export interface MessageState {
  messageMode: boolean;
  messageText: string;
}

export const initialMessageState: MessageState = {
  messageMode: false,
  messageText: ''
};
