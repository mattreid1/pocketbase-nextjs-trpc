import { type RecordModel } from "pocketbase";

export interface UserRecord extends RecordModel {
  created: string;
  updated: string;
  avatar: string;
  email: string;
  emailVisibility: boolean;
  name: string;
  verified: boolean;
}
