import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { AiOutlineEnvironment, AiOutlinePlus, AiOutlineDelete } from "react-icons/ai"
import api from "@/services/api"
import toast from "react-hot-toast"
import CreateVenueModal from "@/scenes/venues/CreateVenueModal"
import Loader from "@/components/loader"

export default function MyVenuesTab() {
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchMyVenues()
  }, [])

  const fetchMyVenues = async () => {
    try {
      setLoading(true)
      const { ok, data } = await api.post("/venue/my-venues/search", { per_page: 50, page: 1 })
      if (!ok) throw new Error("Failed to fetch venues")
      setVenues(data || [])
    } catch (error) {
      toast.error("Could not load your venues")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async venueId => {
    if (!confirm("Are you sure you want to delete this venue?")) return
    try {
      const { ok } = await api.delete(`/venue/${venueId}`)
      if (!ok) throw new Error("Failed to delete venue")
      toast.success("Venue deleted successfully")
      setVenues(venues.filter(v => v._id !== venueId))
    } catch (error) {
      toast.error("Failed to delete venue")
      console.error(error)
    }
  }

  if (loading) return <Loader />

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Venues</h2>
            <p className="text-gray-600 mt-1">Venues you've created</p>
          </div>
          <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            <AiOutlinePlus className="w-5 h-5" />
            Create Venue
          </button>
        </div>
      </div>

      {/* Venues List */}
      {venues.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <AiOutlineEnvironment className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No venues yet</h3>
          <p className="text-gray-600 mb-4">Create your first venue to get started!</p>
          <button onClick={() => setShowCreateModal(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            <AiOutlinePlus className="w-5 h-5" />
            Create Your First Venue
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {venues.map(venue => (
            <VenueRow key={venue._id} venue={venue} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <CreateVenueModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false)
          fetchMyVenues()
        }}
      />
    </div>
  )
}

function VenueRow({ venue, onDelete }) {
  const handleDeleteClick = e => {
    e.preventDefault()
    e.stopPropagation()
    onDelete(venue._id)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow relative group">
      <Link to={`/venues/${venue._id}`} className="block">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{venue.name}</h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium text-gray-700">Location:</span>
                <p>{[venue.address, venue.city].filter(Boolean).join(", ") || "Not specified"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Capacity:</span>
                <p>{venue.capacity || "Not specified"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Amenities:</span>
                <p>{venue.amenities && venue.amenities.length > 0 ? venue.amenities.join(", ") : "None"}</p>
              </div>
            </div>
          </div>
        </div>
      </Link>

      <button
        onClick={handleDeleteClick}
        className="absolute top-6 right-6 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
        title="Delete venue"
      >
        <AiOutlineDelete className="w-5 h-5" />
      </button>
    </div>
  )
}
