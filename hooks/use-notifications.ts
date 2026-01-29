/**
 * Notifications Data Hook - Centralized notification management
 */

"use client";

import { useState, useCallback, useMemo } from "react";
import type { Notification, NotificationType } from "@/lib/types/self-service";
import { notificationsService } from "@/lib/api";

interface UseNotificationsOptions {
  filter?: NotificationType | "all" | "unread";
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  refetch: () => Promise<void>;
}

export function useNotifications(options: UseNotificationsOptions = {}): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await notificationsService.getAll({ page: 1, pageSize: 100 });
      if (response.success && response.data) {
        setNotifications(response.data.notifications);
      }
      if (!response.success) {
        setError(response.error || "فشل تحميل الإشعارات");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل تحميل الإشعارات");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAsRead = useCallback((id: string) => {
    if (!id) return;
    setReadIds((prev) => new Set([...prev, id]));
    void notificationsService.markAsRead(id);
  }, []);

  const markAllAsRead = useCallback(() => {
    setReadIds(new Set(notifications.map((n) => n.id)));
    void notificationsService.markAllAsRead();
  }, [notifications]);

  const deleteNotification = useCallback((id: string) => {
    if (!id) return;
    setDeletedIds((prev) => new Set([...prev, id]));
    void notificationsService.delete(id);
  }, []);

  const processedNotifications = useMemo(() => {
    return notifications
      .filter((n) => !deletedIds.has(n.id))
      .map((n) => ({
        ...n,
        isRead: n.isRead || readIds.has(n.id),
      }));
  }, [notifications, deletedIds, readIds]);

  const filteredNotifications = useMemo(() => {
    const { filter } = options;
    if (!filter || filter === "all") return processedNotifications;
    if (filter === "unread") return processedNotifications.filter((n) => !n.isRead);
    return processedNotifications.filter((n) => n.type === filter);
  }, [processedNotifications, options.filter]);

  const unreadCount = useMemo(() => {
    return processedNotifications.filter((n) => !n.isRead).length;
  }, [processedNotifications]);

  return {
    notifications: filteredNotifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch: fetchNotifications,
  };
}

export default useNotifications;
