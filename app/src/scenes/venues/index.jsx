import React from "react"
import { Routes, Route } from "react-router-dom"
import AllVenuesTab from "./all-venues-tab"
import VenueView from "@/scenes/venues/view"

export default function Venues() {
  return (
    <div className="p-8">
      <Routes>
        <Route index element={<AllVenuesTab />} />
        <Route path=":id/*" element={<VenueView />} />
      </Routes>
    </div>
  )
}
