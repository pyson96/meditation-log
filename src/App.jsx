import { useState } from 'react'
import './index.css'
import dayjs from 'dayjs'
import { GoogleLogin } from '@react-oauth/google'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const today = dayjs().format('YYYY-MM-DD')
  const [date, setDate] = useState(today)
  const [formData, setFormData] = useState({
    time: '',
    location: '',
    environment: '',
    type: '',
    feelings: '',
    insights: '',
    extra: '',
  })

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value })
  }
  const handleLogin = () => {
    // Placeholder for OAuth logic
    // Replace this with your OAuth integration (Google, GitHub, etc.)
    setIsLoggedIn(true)
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-10 rounded-lg shadow text-center space-y-4">
          <h1 className="text-3xl font-bold">🧘 Welcome to Meditation Log</h1>
          <p className="text-gray-600">Sign in with Google to begin</p>
          
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              console.log(credentialResponse)
              setIsLoggedIn(true)
            }}
            onError={() => {
              console.log('Login Failed')
            }}
          />
        </div>
      </div>
    )
  }



  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-8">
      <div className="flex justify-center mb-8">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-3 py-2 rounded shadow-sm"
        />
      </div>

      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">🧘 Meditation Log</h1>
        <p className="text-sm text-gray-500">{date} - Reflect and grow mindfully</p>
      </header>

      <section className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow space-y-6">
        <div>
          <h2 contentEditable suppressContentEditableWarning className="text-lg font-semibold mb-1">🕰️ Date & Time</h2>
          <input
            type="datetime-local"
            className="w-full border rounded p-2 text-sm"
            value={formData.time}
            onChange={handleChange('time')}
          />
        </div>

        <div>
          <h2 contentEditable suppressContentEditableWarning className="text-lg font-semibold mb-1">📍 Location</h2>
          <textarea
            className="w-full border rounded p-2 text-sm"
            rows={2}
            placeholder="Where were you?"
            value={formData.location}
            onChange={handleChange('location')}
          />
        </div>

        <div>
          <h2 contentEditable suppressContentEditableWarning className="text-lg font-semibold mb-1">🌿 Environment</h2>
          <textarea
            className="w-full border rounded p-2 text-sm"
            rows={2}
            placeholder="Describe your surroundings."
            value={formData.environment}
            onChange={handleChange('environment')}
          />
        </div>

        <div>
          <h2 contentEditable suppressContentEditableWarning className="text-lg font-semibold mb-1">🧘 Type of Practice</h2>
          <textarea
            className="w-full border rounded p-2 text-sm"
            rows={2}
            placeholder="What kind of meditation did you do?"
            value={formData.type}
            onChange={handleChange('type')}
          />
        </div>

        <div>
          <h2 contentEditable suppressContentEditableWarning className="text-lg font-semibold mb-1">💭 Feelings & Perceptions</h2>
          <textarea
            className="w-full border rounded p-2 text-sm"
            rows={3}
            placeholder="How did you feel?"
            value={formData.feelings}
            onChange={handleChange('feelings')}
          />
        </div>

        <div>
          <h2 contentEditable suppressContentEditableWarning className="text-lg font-semibold mb-1">✨ Insights or Realizations</h2>
          <textarea
            className="w-full border rounded p-2 text-sm"
            rows={3}
            placeholder="Any insights from the session?"
            value={formData.insights}
            onChange={handleChange('insights')}
          />
        </div>

        <div>
          <h2 contentEditable suppressContentEditableWarning className="text-lg font-semibold mb-1">📝 Additional Notes</h2>
          <textarea
            className="w-full border rounded p-2 text-sm"
            rows={2}
            placeholder="Anything else you want to note?"
            value={formData.extra}
            onChange={handleChange('extra')}
          />
        </div>

        <div className="mt-6 flex justify-between items-center">
          <select className="border px-2 py-1 rounded text-sm">
            <option value="private">🔒 Private</option>
            <option value="public">🌍 Public</option>
          </select>

          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Save Log
          </button>
        </div>
      </section>
    </div>
  )
}

export default App
