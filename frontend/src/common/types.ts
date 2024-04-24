export interface Document {
  documentId: string;
  userId: string;
  filename: string;
  filesize: string;
  docStatus: string;
  created: string;
  pages: string;
  conversations: {
    conversationId: string;
    created: string;
  }[];
}

export interface Conversation {
  messages: {
    type: string;
    content: string;
    debug: any;
  }[];
}
