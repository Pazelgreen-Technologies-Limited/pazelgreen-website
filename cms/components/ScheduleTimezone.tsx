"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const timezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;
export function ScheduleTimezone() {
  const zone = useSyncExternalStore(subscribe, timezone, () => "your browser timezone");
  return <p style={{ marginBottom: "1rem" }}>Scheduling timezone: <strong>{zone}</strong>. The date picker displays local times in this zone; saved instants are UTC. API callers must supply an explicit timezone offset.</p>;
}
