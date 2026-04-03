import React from "react"

export default function OverviewTab({ venue }) {
  return (
    <div className="max-w-3xl">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Venue Details</h2>
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium text-gray-500">Address</div>
            <div className="text-sm text-gray-900 mt-1">
              {[venue.address, venue.city].filter(Boolean).join(", ") || "No location specified"}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Capacity</div>
            <div className="text-sm text-gray-900 mt-1">{venue.capacity || "Not specified"}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Amenities</div>
            <div className="mt-1">
              {venue.amenities && venue.amenities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {venue.amenities.map(a => (
                    <span key={a} className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded">
                      {a}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-900">No amenities listed</div>
              )}
            </div>
          </div>
          {venue.image_url && (
            <div>
              <div className="text-sm font-medium text-gray-500 mb-2">Image</div>
              <img src={venue.image_url} alt={venue.name} className="w-full max-w-md rounded-lg" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
