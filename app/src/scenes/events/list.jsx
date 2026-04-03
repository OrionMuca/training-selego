import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { AiOutlineCalendar, AiOutlineEnvironment, AiOutlineUser, AiOutlinePlus } from "react-icons/ai"
import api from "@/services/api"
import toast from "react-hot-toast"
import Loader from "@/components/loader"
import useStore from "@/services/store"
import CreateEventModal from "@/scenes/events/CreateEventModal"

export default function AllEventsTab() {
  const { user } = useStore()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filters, setFilters] = useState({ search: "", category: "", city: "", myEvents: false })

  useEffect(() => {
    fetchEvents()
  }, [filters.myEvents])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const { ok, data } = await api.post("/event/search", {
        search: filters.search,
        category: filters.category,
        city: filters.city,
        user_id: filters.myEvents ? user?._id : undefined,
        per_page: 20,
        page: 1
      })
      if (!ok) throw new Error("Failed to fetch events")
      setEvents(data || [])
    } catch (error) {
      toast.error("Could not load events")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = e => {
    e.preventDefault()
    fetchEvents()
  }

  if (loading) return <Loader />

  return (
    <div>
      {/* Search and Filters */}
      <form onSubmit={handleSearch} className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Event title, venue, or description..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={filters.category}
              onChange={e => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All Categories</option>
              <option value="conference">Conference</option>
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
              <option value="networking">Networking</option>
              <option value="social">Social</option>
              <option value="other">Other</option>
            </select>
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
              checked={filters.myEvents}
              onChange={e => setFilters({ ...filters, myEvents: e.target.checked })}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            My events only
          </label>
          <div className="flex items-center gap-3">
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              Search Events
            </button>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50"
            >
              <AiOutlinePlus className="w-4 h-4" />
              Create Event
            </button>
          </div>
        </div>
      </form>

      {/* Events List */}
      {events.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <AiOutlineCalendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600 mb-4">There are no upcoming events matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}

      <CreateEventModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false)
          fetchEvents()
        }}
      />
    </div>
  )
}

function EventCard({ event }) {
  const formatDate = date => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const formatTime = date => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  return (
    <Link to={`/events/${event._id}`} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden block">
      {event.image_url && <img src={event.image_url} alt={event.title} className="w-full h-48 object-cover" />}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <span className="inline-block px-2 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded">{event.category}</span>
          {event.price > 0 ? (
            <span className="text-sm font-bold text-gray-900">{event.price} {event.currency}</span>
          ) : (
            <span className="text-sm font-bold text-green-600">FREE</span>
          )}
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{event.title}</h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <AiOutlineCalendar className="w-4 h-4 mr-2" />
            <span>{formatDate(event.start_date)} at {formatTime(event.start_date)}</span>
          </div>

          {event.venue && (
            <div className="flex items-center">
              <AiOutlineEnvironment className="w-4 h-4 mr-2" />
              <span className="line-clamp-1">{event.venue}, {event.city}</span>
            </div>
          )}

          {event.organizer_name && (
            <div className="flex items-center">
              <AiOutlineUser className="w-4 h-4 mr-2" />
              <span className="line-clamp-1">By {event.organizer_name}</span>
            </div>
          )}

          {event.capacity > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Available spots</span>
                <span className="text-xs font-semibold text-gray-900">{event.available_spots} / {event.capacity}</span>
              </div>
              <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${(event.available_spots / event.capacity) * 100}%` }}></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
