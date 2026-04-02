import React from "react"
import { Routes, Route } from "react-router-dom"
import AllEventsTab from "./all-events-tab"
import EventView from "@/scenes/events/view"

export default function Events() {
  return (
    <div className="p-8">
      <Routes>
        <Route index element={<AllEventsTab />} />
        <Route path=":id/*" element={<EventView />} />
      </Routes>
    </div>
  )
}
