import React from "react"
import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
import AllVenuesTab from "./all-venues-tab"
import MyVenuesTab from "./my-venues-tab"
import VenueView from "@/scenes/venues/view"
import Tab from "@/components/tab"

export default function Venues() {
  const navigate = useNavigate()
  const location = useLocation()

  const isMyVenues = location.pathname.includes("/my-venues")

  return (
    <div className="p-8">
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-8">
          <Tab
            title="All"
            active={!isMyVenues}
            onClick={() => navigate("/venues")}
          />
          <Tab
            title="My Venues"
            active={isMyVenues}
            onClick={() => navigate("/venues/my-venues")}
          />
        </div>
      </div>

      {/* Content */}
      <Routes>
        <Route index element={<AllVenuesTab />} />
        <Route path="my-venues" element={<MyVenuesTab />} />
        <Route path=":id/*" element={<VenueView />} />
      </Routes>
    </div>
  )
}
