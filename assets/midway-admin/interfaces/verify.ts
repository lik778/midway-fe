import { AiTaskStatus } from '../enums/verify';

export interface VerifyWordItem {
  usrId: number;
  shopId: number;
  taskId: number;
  contentCateName: string;
  createdTime: number;
  status: AiTaskStatus;
  memo: string;
  wordA: string[];
  wordB: string[];
  wordC: string[];
  wordD: string[];
}

export interface VerifyWordParams {
  approve: boolean;
  id: number;
  memo?: string;
}
