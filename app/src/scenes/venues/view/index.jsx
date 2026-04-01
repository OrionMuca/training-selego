import React, { useEffect, useState } from "react"
import { Routes, Route, useParams, useNavigate } from "react-router-dom"
import api from "@/services/api"
import toast from "react-hot-toast"
import useStore from "@/services/store"
import OverviewTab from "./overview"
import EditTab from "./edit"
import RawView from "./raw"
import Loader from "@/components/loader"

export default function VenueView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useStore()
  const [venue, setVenue] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVenue()
  }, [id])

  const fetchVenue = async () => {
    try {
      const { ok, data } = await api.get(`/venue/${id}`)
      if (!ok) throw new Error("Failed to fetch venue")
      setVenue(data)
    } catch (error) {
      toast.error("Could not load venue")
      navigate("/venues")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loader />
  if (!venue) return null

  const isOwner = user && venue.owner_id === user._id.toString()

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{venue.name}</h1>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-8">
          <button onClick={() => navigate(`/venues/${id}`)} className="pb-3 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Overview
          </button>
          {isOwner && (
            <button onClick={() => navigate(`/venues/${id}/edit`)} className="pb-3 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Edit
            </button>
          )}
          <button onClick={() => navigate(`/venues/${id}/raw`)} className="pb-3 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Raw
          </button>
        </div>
      </div>

      {/* Content */}
      <Routes>
        <Route index element={<OverviewTab venue={venue} />} />
        <Route path="edit" element={<EditTab venue={venue} fetchVenue={fetchVenue} />} />
        <Route path="raw" element={<RawView venue={venue} />} />
      </Routes>
    </div>
  )
}
