import React from "react"
import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
import AllEventsTab from "./all-events-tab"
import MyEventsTab from "./my-events-tab"
import EventView from "@/scenes/events/view"
import Tab from "@/components/tab"

export default function Events() {
  const navigate = useNavigate()
  const location = useLocation()

  // Determine active tab based on current path
  const isEventDetail = /\/events\/[^/]+$/.test(location.pathname) && !location.pathname.includes("/my-events")
  const isMyEvents = location.pathname.includes("/my-events") && !isEventDetail

  return (
    <div className="p-8">
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-8">
          <Tab
            title="All"
            active={!isMyEvents}
            onClick={() => navigate("/events")}
          />
          <Tab
            title="My Events"
            active={isMyEvents}
            onClick={() => navigate("/events/my-events")}
          />
        </div>
      </div>

      {/* Content */}
      <Routes>
        <Route index element={<AllEventsTab />} />
        <Route path="my-events" element={<MyEventsTab />} />
        <Route path=":id/*" element={<EventView />} />
      </Routes>
    </div>
  )
}
