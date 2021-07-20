
export type SecurityQuestion = {
  question: string,
  answer: string,
};

export type ChatRoomId = string;

export interface IEntity {
  id: string;
}

export interface User {
  id?: string,
  email: string,
  phoneNumber?: string,
  username: string,
  password: string,
  contacts?: User[],
  interests: string[],
  isSuperAdmin: boolean,
  chatRooms?: ChatRoomId[],
  imageUri?: string,
  securityQuestionOne: SecurityQuestion,
  securityQuestionTwo: SecurityQuestion,
  securityQuestionThree: SecurityQuestion,
  status?: string,
}

export interface Message {
  id: string,
  user: User,
  content: string,
  createdAt: string,
}

export interface ChatRoomUser  {
  id: string,
  user: User,
  isModerator: boolean,
  isAdmin: boolean,
}

export interface ChatRoom {
  id: string,
  title: string,
  users: ChatRoomUser[],
  messages: Message[],
  lastMessage: Message,
}

export interface Forum  {
  id: string,
  title: string,
  tags: string[],
  username: string,
  createdAt: string,
  content: string,
  likes?: number,
  numberOfComments?: number,
  comments?: ForumComment[]
}

export interface ForumComment  {
  id: string,
  username: string,
  createdAt: string,
  content: string,
  likes: number,
  numberOfComments?: number,
  comments?: ForumComment[]
}