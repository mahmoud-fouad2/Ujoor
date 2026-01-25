import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { useAuth } from "@/components/auth-provider";
import { useAppSettings } from "@/components/app-settings-provider";
import { apiFetch } from "@/lib/api";
import { humanizeApiError, t } from "@/lib/i18n";

type AttendanceRecordRow = {
  id: string;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
};

export default function HistoryScreen() {
  const { accessToken } = useAuth();
  const { language } = useAppSettings();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<AttendanceRecordRow[]>([]);
  const [days, setDays] = useState<7 | 30 | 90>(30);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const hasMore = rows.length < total;

  const buildRangeQuery = (daysBack: 7 | 30 | 90) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - (daysBack - 1));

    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    return { startDate: fmt(start), endDate: fmt(end) };
  };

  const load = useCallback(
    async (opts?: { nextPage?: number; reset?: boolean; nextDays?: 7 | 30 | 90 }) => {
      if (!accessToken) return;

      const nextDays = opts?.nextDays ?? days;
      const nextPage = opts?.nextPage ?? 1;
      const reset = opts?.reset ?? false;

      if (reset) setBusy(true);
      else setLoadingMore(true);

      setError(null);

      try {
        const range = buildRangeQuery(nextDays);
        const limit = 20;
        const qs = new URLSearchParams({
          page: String(nextPage),
          limit: String(limit),
          startDate: range.startDate,
          endDate: range.endDate,
        });

        const res = await apiFetch<{ data: { items: AttendanceRecordRow[]; page: number; limit: number; total: number } }>(
          `/api/mobile/attendance?${qs.toString()}`,
          { token: accessToken }
        );

        setTotal(res.data.total || 0);
        setPage(res.data.page || nextPage);
        setRows((prev) => (reset ? (res.data.items || []) : [...prev, ...(res.data.items || [])]));
      } catch (e: any) {
        setError(humanizeApiError(language, e?.message || ""));
      } finally {
        setBusy(false);
        setLoadingMore(false);
      }
    },
    [accessToken, days, language]
  );

  useEffect(() => {
    void load({ reset: true, nextPage: 1 });
  }, [load]);

  const setFilter = (d: 7 | 30 | 90) => {
    setDays(d);
    setRows([]);
    setTotal(0);
    setPage(1);
    void load({ reset: true, nextDays: d, nextPage: 1 });
  };

  const loadMore = () => {
    if (busy || loadingMore || !hasMore) return;
    void load({ reset: false, nextPage: page + 1 });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{t(language, "history_title")}</Text>
        <Pressable onPress={() => void load({ reset: true, nextPage: 1 })} disabled={busy} style={[styles.refresh, busy && styles.refreshDisabled]}>
          {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.refreshText}>{t(language, "refresh")}</Text>}
        </Pressable>
      </View>

      <View style={styles.filtersRow}>
        <Pressable onPress={() => setFilter(7)} style={[styles.chip, days === 7 && styles.chipActive]}>
          <Text style={styles.chipText}>{t(language, "last_7_days")}</Text>
        </Pressable>
        <Pressable onPress={() => setFilter(30)} style={[styles.chip, days === 30 && styles.chipActive]}>
          <Text style={styles.chipText}>{t(language, "last_30_days")}</Text>
        </Pressable>
        <Pressable onPress={() => setFilter(90)} style={[styles.chip, days === 90 && styles.chipActive]}>
          <Text style={styles.chipText}>{t(language, "last_90_days")}</Text>
        </Pressable>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={rows}
        keyExtractor={(item) => item.id}
        contentContainerStyle={rows.length === 0 ? styles.emptyContainer : undefined}
        ListEmptyComponent={!busy ? <Text style={styles.empty}>{t(language, "empty_history")}</Text> : null}
        onEndReachedThreshold={0.4}
        onEndReached={loadMore}
        ListFooterComponent={
          rows.length > 0 ? (
            <View style={styles.footer}>
              <Pressable
                onPress={loadMore}
                disabled={!hasMore || busy || loadingMore}
                style={[styles.loadMore, (!hasMore || busy || loadingMore) && styles.loadMoreDisabled]}
              >
                {loadingMore ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.loadMoreText}>{hasMore ? t(language, "load_more") : t(language, "no_more")}</Text>
                )}
              </Pressable>
            </View>
          ) : null
        }
        renderItem={({ item }) => {
          const date = new Date(item.date).toLocaleDateString();
          const checkIn = item.checkInTime ? new Date(item.checkInTime).toLocaleTimeString() : "—";
          const checkOut = item.checkOutTime ? new Date(item.checkOutTime).toLocaleTimeString() : "—";
          return (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{date}</Text>
              <Text style={styles.cardMeta}>{t(language, "last_check_in")}: {checkIn}</Text>
              <Text style={styles.cardMeta}>{t(language, "last_check_out")}: {checkOut}</Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#0b1220",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
  },
  filtersRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  chip: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
  },
  chipActive: {
    borderColor: "rgba(34,197,94,0.45)",
    backgroundColor: "rgba(34,197,94,0.12)",
  },
  chipText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 12,
    textAlign: "center",
  },
  refresh: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  refreshDisabled: {
    opacity: 0.6,
  },
  refreshText: {
    color: "#fff",
    fontWeight: "700",
  },
  error: {
    color: "#f87171",
    marginBottom: 10,
  },
  card: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(255,255,255,0.04)",
    marginBottom: 10,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  cardMeta: {
    color: "rgba(255,255,255,0.70)",
    marginTop: 4,
    fontSize: 12,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    color: "rgba(255,255,255,0.70)",
  },
  footer: {
    paddingTop: 6,
    paddingBottom: 14,
  },
  loadMore: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  loadMoreDisabled: {
    opacity: 0.6,
  },
  loadMoreText: {
    color: "#fff",
    fontWeight: "800",
  },
});
