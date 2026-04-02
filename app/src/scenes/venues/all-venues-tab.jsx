import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { AiOutlineEnvironment, AiOutlinePlus } from "react-icons/ai"
import api from "@/services/api"
import toast from "react-hot-toast"
import Loader from "@/components/loader"
import useStore from "@/services/store"
import CreateVenueModal from "@/scenes/venues/CreateVenueModal"

export default function AllVenuesTab() {
  const { user } = useStore()
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filters, setFilters] = useState({ search: "", city: "", myVenues: false })

  useEffect(() => {
    fetchVenues()
  }, [filters.myVenues])

  const fetchVenues = async () => {
    try {
      setLoading(true)
      const { ok, data } = await api.post("/venue/search", {
        search: filters.search,
        city: filters.city,
        owner_id: filters.myVenues ? user?._id : undefined,
        per_page: 20,
        page: 1,
      })
      if (!ok) throw new Error("Failed to fetch venues")
      setVenues(data || [])
    } catch (error) {
      toast.error("Could not load venues")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = e => {
    e.preventDefault()
    fetchVenues()
  }

  if (loading) return <Loader />

  return (
    <div>
      {/* Search and Filters */}
      <form onSubmit={handleSearch} className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Venue name, address..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              placeholder="Paris, Lyon..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={filters.city}
              onChange={e => setFilters({ ...filters, city: e.target.value })}
            />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.myVenues}
              onChange={e => setFilters({ ...filters, myVenues: e.target.checked })}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            My venues only
          </label>
          <div className="flex items-center gap-3">
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              Search Venues
            </button>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50"
            >
              <AiOutlinePlus className="w-4 h-4" />
              Create Venue
            </button>
          </div>
        </div>
      </form>

      {/* Venues List */}
      {venues.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <AiOutlineEnvironment className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No venues found</h3>
          <p className="text-gray-600">There are no venues matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map(venue => (
            <VenueCard key={venue._id} venue={venue} />
          ))}
        </div>
      )}

      <CreateVenueModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false)
          fetchVenues()
        }}
      />
    </div>
  )
}

function VenueCard({ venue }) {
  return (
    <Link to={`/venues/${venue._id}`} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden block">
      {venue.image_url && <img src={venue.image_url} alt={venue.name} className="w-full h-48 object-cover" />}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{venue.name}</h3>

        <div className="flex items-center text-sm text-gray-600 mb-3">
          <AiOutlineEnvironment className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="line-clamp-1">
            {[venue.address, venue.city].filter(Boolean).join(", ") || "No location"}
          </span>
        </div>

        {venue.capacity > 0 && (
          <p className="text-sm text-gray-600 mb-3">Capacity: {venue.capacity}</p>
        )}

        {venue.amenities && venue.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {venue.amenities.slice(0, 3).map(a => (
              <span key={a} className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-700 rounded">
                {a}
              </span>
            ))}
            {venue.amenities.length > 3 && (
              <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                +{venue.amenities.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
