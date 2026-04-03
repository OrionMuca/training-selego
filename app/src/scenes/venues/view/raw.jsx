import React from "react"

export default function RawView({ venue }) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Raw API Response</h1>
        <p className="text-sm text-gray-600">
          Direct JSON response from <code className="bg-gray-100 px-2 py-0.5 rounded font-mono">GET /venue/:id</code>
        </p>
      </div>

      <div className="bg-gray-900 rounded-lg p-6 overflow-auto">
        <pre className="text-sm text-green-400 font-mono">{JSON.stringify(venue, null, 2)}</pre>
      </div>
    </div>
  )
}
