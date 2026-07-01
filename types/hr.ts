export type UserRole = "HRD" | "EMPLOYEE";
export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  employeeId?: string;
};

export type Employee = {
  id: string;
  userId: string;
  nik: string;
  name: string;
  email: string;
  department: string;
  position: string;
  managerName: string;
  joinDate: string;
  leaveBalance: number;
  status: "Aktif" | "Kontrak" | "Probation";
};

export type LeaveRequest = {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  duration: number;
  reason: string;
  status: RequestStatus;
  createdAt: string;
};

export type LetterRequest = {
  id: string;
  employeeId: string;
  employeeName: string;
  letterType: string;
  purpose: string;
  status: RequestStatus;
  createdAt: string;
  fileUrl?: string;
};

export type Notification = {
  id: string;
  userId?: string;
  roleTarget?: UserRole;
  title: string;
  message: string;
  type: "leave" | "letter" | "approval" | "system";
  isRead: boolean;
  createdAt: string;
};

export type ApprovalType = "leave" | "letter";
