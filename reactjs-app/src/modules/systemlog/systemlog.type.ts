export interface SystemLog {
  id: number;
  actor: string;
  action: string;
  description: string;
  ipAddress: string;
  timestamp: string;
  level: string;
  targetUserId?: number | null;
}


