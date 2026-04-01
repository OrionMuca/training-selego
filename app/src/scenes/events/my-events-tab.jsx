import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { AiOutlineCalendar, AiOutlinePlus } from "react-icons/ai"
import { AiOutlineDelete } from "react-icons/ai"
import api from "@/services/api"
import toast from "react-hot-toast"
import CreateEventModal from "@/scenes/events/CreateEventModal"
import Loader from "@/components/loader"
import useStore from "@/services/store"

export default function MyEventsTab() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { user } = useStore()
  
  useEffect(() => {
    fetchMyEvents()
  }, [])

  const fetchMyEvents = async () => {
    try {
      setLoading(true)
      const { ok, data, total } = await api.post("/event/search", {
        per_page: 50,
        page: 1,
        user_id: user?._id,
      })
      if (!ok) throw new Error("Failed to fetch events")
      setEvents(data || [])
    } catch (error) {
      toast.error("Could not load your events")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async eventId => {
    if (!confirm("Are you sure you want to delete this event?")) return

    try {
      const { ok } = await api.delete(`/event/${eventId}`)
      if (!ok) throw new Error("Failed to delete event")

      toast.success("Event deleted successfully")
      setEvents(events.filter(e => e._id !== eventId))
    } catch (error) {
      toast.error("Failed to delete event")
      console.error(error)
    }
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Events</h2>
            <p className="text-gray-600 mt-1">Events you've created and organized</p>
          </div>
          <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            <AiOutlinePlus className="w-5 h-5" />
            Create Event
          </button>
        </div>

        {/* Info card */}
        <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-purple-800">Your Events Dashboard</h3>
              <div className="mt-2 text-sm text-purple-700">
                <p>
                  This page shows events where you are the <strong>organizer</strong>.
                </p>
                <p className="mt-1">
                  Data comes from <code className="bg-purple-100 px-1 rounded">POST /event/search</code> with <code className="bg-purple-100 px-1 rounded">user_id</code> filter.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <AiOutlineCalendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
          <p className="text-gray-600 mb-4">Create your first event to get started!</p>
          <button onClick={() => setShowCreateModal(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            <AiOutlinePlus className="w-5 h-5" />
            Create Your First Event
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map(event => (
            <EventRow key={event._id} event={event} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false)
          fetchMyEvents()
        }}
      />
    </div>
  )
}

function EventRow({ event, onDelete }) {
  const handleDeleteClick = e => {
    e.preventDefault()
    e.stopPropagation()
    onDelete(event._id)
  }

  const formatDate = date => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const getStatusBadge = status => {
    const styles = {
      draft: "bg-gray-100 text-gray-800",
      published: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800"
    }
    return <span className={`px-2 py-1 text-xs font-semibold rounded ${styles[status] || styles.draft}`}>{status.toUpperCase()}</span>
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow relative group">
      <Link to={`/events/${event._id}`} className="block">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-12">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
              {getStatusBadge(event.status)}
              <span className="text-sm px-2 py-1 bg-indigo-100 text-indigo-800 rounded">{event.category}</span>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium text-gray-700">Date:</span>
                <p>{formatDate(event.start_date)}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Location:</span>
                <p>{event.city || "Not specified"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Capacity:</span>
                <p>{event.capacity === 0 ? "Unlimited" : `${event.available_spots} / ${event.capacity}`}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Price:</span>
                <p>{event.price === 0 ? "FREE" : `${event.price} ${event.currency}`}</p>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Delete button */}
      <button
        onClick={handleDeleteClick}
        className="absolute top-6 right-6 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
        title="Delete event"
      >
        <AiOutlineDelete className="w-5 h-5" />
      </button>
    </div>
  )
}
