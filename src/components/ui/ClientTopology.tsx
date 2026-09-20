"use client";

import dynamic from "next/dynamic";

const Topology = dynamic(() => import("./TopologyBackground"), { ssr: false });

export default function ClientTopology() {
  return <Topology />;
}
