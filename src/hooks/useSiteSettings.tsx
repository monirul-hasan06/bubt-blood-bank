import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useSiteSetting = <T,>(key: string, fallback: T) => {
  const [value, setValue] = useState<T>(fallback);

  useEffect(() => {
    let mounted = true;
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", key)
      .maybeSingle()
      .then(({ data }) => {
        if (mounted && data) setValue(data.value as T);
      });

    const channel = supabase
      .channel(`site_settings:${key}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_settings", filter: `key=eq.${key}` },
        (payload) => {
          const next = (payload.new as { value: T } | null)?.value;
          if (mounted && next !== undefined) setValue(next);
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [key]);

  return value;
};
