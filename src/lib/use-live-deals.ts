import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { listDeals } from "./deals.functions";

export function useLiveDeals() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["live-deals"], queryFn: () => listDeals(), refetchInterval: 60_000 });
  useEffect(() => {
    // Register every .on() callback BEFORE .subscribe(), with a unique channel per mount
    // so React Strict Mode re-mounts never reuse an already-subscribed channel.
    const channel = supabase
      .channel(`live-deals-${crypto.randomUUID()}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "deals" }, () => { void queryClient.invalidateQueries({ queryKey: ["live-deals"] }); })
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [queryClient]);
  return query;
}

export function deviceId() {
  try {
    let id = localStorage.getItem("lobangkaki-device");
    if (!id) { id = crypto.randomUUID(); localStorage.setItem("lobangkaki-device", id); }
    return id;
  } catch { return crypto.randomUUID(); }
}
