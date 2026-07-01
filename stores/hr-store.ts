"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { employees, leaveRequests, letterRequests, notifications } from "@/lib/mock-data";
import { todayIso } from "@/lib/utils";
import type { ApprovalType, Employee, LeaveRequest, LetterRequest, Notification, RequestStatus } from "@/types/hr";

type LeavePayload = {
  employeeId: string;
  employeeName: string;
  startDate?: string;
  endDate?: string;
  duration?: number;
  reason?: string;
};

type LetterPayload = {
  employeeId: string;
  employeeName: string;
  letterType?: string;
  purpose?: string;
};

type HrState = {
  employees: Employee[];
  leaveRequests: LeaveRequest[];
  letterRequests: LetterRequest[];
  notifications: Notification[];
  approveRequest: (id: string, type: ApprovalType) => void;
  rejectRequest: (id: string, type: ApprovalType) => void;
  createLeaveRequest: (payload: LeavePayload) => LeaveRequest;
  createLetterRequest: (payload: LetterPayload) => LetterRequest;
  markAllNotificationsRead: (userId?: string, roleTarget?: "HRD" | "EMPLOYEE") => void;
};

function nextId(prefix: string, count: number) {
  return `${prefix}-2026-${String(count + 1).padStart(4, "0")}`;
}

function statusText(status: RequestStatus) {
  return status === "APPROVED" ? "disetujui" : "ditolak";
}

export const useHrStore = create<HrState>()(
  persist(
    (set, get) => ({
      employees,
      leaveRequests,
      letterRequests,
      notifications,
      approveRequest: (id, type) => {
        const status: RequestStatus = "APPROVED";
        set((state) => {
      const listKey = type === "leave" ? "leaveRequests" : "letterRequests";
      const target = state[listKey].find((request) => request.id === id);
      const updatedNotifications = target
        ? [
            {
              id: `notif-${Date.now()}`,
              userId: employees.find((employee) => employee.id === target.employeeId)?.userId,
              title: "Request disetujui",
              message: `${id} ${statusText(status)} oleh HRD.`,
              type: type === "leave" ? "approval" : "letter",
              isRead: false,
              createdAt: todayIso(),
            } satisfies Notification,
            ...state.notifications,
          ]
        : state.notifications;

      return {
        [listKey]: state[listKey].map((request) => (request.id === id ? { ...request, status } : request)),
        notifications: updatedNotifications,
      } as Pick<HrState, typeof listKey | "notifications">;
        });
      },
      rejectRequest: (id, type) => {
        const status: RequestStatus = "REJECTED";
        set((state) => {
      const listKey = type === "leave" ? "leaveRequests" : "letterRequests";
      const target = state[listKey].find((request) => request.id === id);
      const updatedNotifications = target
        ? [
            {
              id: `notif-${Date.now()}`,
              userId: employees.find((employee) => employee.id === target.employeeId)?.userId,
              title: "Request ditolak",
              message: `${id} ${statusText(status)} oleh HRD.`,
              type: type === "leave" ? "approval" : "letter",
              isRead: false,
              createdAt: todayIso(),
            } satisfies Notification,
            ...state.notifications,
          ]
        : state.notifications;

      return {
        [listKey]: state[listKey].map((request) => (request.id === id ? { ...request, status } : request)),
        notifications: updatedNotifications,
      } as Pick<HrState, typeof listKey | "notifications">;
        });
      },
      createLeaveRequest: (payload) => {
        const request: LeaveRequest = {
      id: nextId("LV", get().leaveRequests.length),
      employeeId: payload.employeeId,
      employeeName: payload.employeeName,
      startDate: payload.startDate ?? "2026-07-12",
      endDate: payload.endDate ?? "2026-07-12",
      duration: payload.duration ?? 1,
      reason: payload.reason ?? "Diajukan melalui HIRA AI Agent",
      status: "PENDING",
      createdAt: todayIso(),
    };
        set((state) => ({
          leaveRequests: [request, ...state.leaveRequests],
          notifications: [
            {
              id: `notif-${Date.now()}`,
              roleTarget: "HRD",
              title: "Request cuti baru",
              message: `${payload.employeeName} mengajukan cuti ${request.id}.`,
              type: "leave",
              isRead: false,
              createdAt: todayIso(),
            },
            {
              id: `notif-${Date.now() + 1}`,
              userId: employees.find((employee) => employee.id === payload.employeeId)?.userId,
              title: "Cuti berhasil diajukan",
              message: `${request.id} menunggu approval HRD.`,
              type: "leave",
              isRead: false,
              createdAt: todayIso(),
            },
            ...state.notifications,
          ],
        }));
        return request;
      },
      createLetterRequest: (payload) => {
        const request: LetterRequest = {
      id: nextId("LET", get().letterRequests.length),
      employeeId: payload.employeeId,
      employeeName: payload.employeeName,
      letterType: payload.letterType ?? "Surat Keterangan Kerja",
      purpose: payload.purpose ?? "Diajukan melalui HIRA AI Agent",
      status: "PENDING",
      createdAt: todayIso(),
    };
        set((state) => ({
          letterRequests: [request, ...state.letterRequests],
          notifications: [
            {
              id: `notif-${Date.now()}`,
              roleTarget: "HRD",
              title: "Request surat baru",
              message: `${payload.employeeName} meminta ${request.letterType}.`,
              type: "letter",
              isRead: false,
              createdAt: todayIso(),
            },
            {
              id: `notif-${Date.now() + 1}`,
              userId: employees.find((employee) => employee.id === payload.employeeId)?.userId,
              title: "Surat berhasil diajukan",
              message: `${request.id} menunggu proses HRD.`,
              type: "letter",
              isRead: false,
              createdAt: todayIso(),
            },
            ...state.notifications,
          ],
        }));
        return request;
      },
      markAllNotificationsRead: (userId, roleTarget) => {
        set((state) => ({
          notifications: state.notifications.map((notification) => {
            const belongsToUser = userId && notification.userId === userId;
            const belongsToRole = roleTarget && notification.roleTarget === roleTarget;
            return belongsToUser || belongsToRole ? { ...notification, isRead: true } : notification;
          }),
        }));
      },
    }),
    {
      name: "hira-hr",
      skipHydration: true,
    },
  ),
);
