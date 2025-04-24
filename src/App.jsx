import { useState, useEffect } from 'react'
import './index.css'
import dayjs from 'dayjs'
import { GoogleLogin } from '@react-oauth/google'
import axios from 'axios'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const today = dayjs().format('YYYY-MM-DD')
  const [date, setDate] = useState(today)
  const [sections, setSections] = useState([
    { subtitle: '🕰️ Date & Time', content: '' }
  ])

  const handleSectionChange = (index, key, value) => {
    const updated = [...sections]
    updated[index][key] = value
    setSections(updated)
  }

  const handleAddSection = () => {
    if (sections.length >= 10) return alert('최대 10개까지 작성할 수 있어요!')
    setSections([...sections, { subtitle: `📝 New Section ${sections.length + 1}`, content: '' }])
  }

  const handleSave = async () => {
    const token = localStorage.getItem('access_token')
    const entry = {
      date,
      ...Object.fromEntries(
        sections.flatMap((s, i) => [
          [`subtitle_${i + 1}`, s.subtitle],
          [`content_${i + 1}`, s.content]
        ])
      )
    }

    try {
      await axios.post('http://localhost:8000/diaries', entry, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      alert('✅ Meditation log saved!')
    } catch (err) {
      console.error('❌ Failed to save diary', err)
      alert('❌ Failed to save. Please try again.')
    }
  }

  const fetchDiary = async (selectedDate) => {
    const token = localStorage.getItem('access_token')
    try {
      const res = await axios.get(`http://localhost:8000/diaries/${selectedDate}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setDate(selectedDate)
      const newSections = res.data.subtitles.map((subtitle, i) => ({
        subtitle,
        content: res.data.contents[i] || ''
      })).filter(section => section.subtitle && section.subtitle.trim() !== '')
      setSections(newSections)
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setDate(selectedDate)
        setSections([{ subtitle: '🕰️ Date & Time', content: '' }])
      } else {
        console.error('❌ Failed to fetch diary', err)
      }
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-10 rounded-lg shadow text-center space-y-4">
          <h1 className="text-3xl font-bold">🧘 Welcome to Meditation Log</h1>
          <p className="text-gray-600">Sign in with Google to begin</p>

          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              const idToken = credentialResponse.credential
              try {
                const res = await axios.post('http://localhost:8000/auth/oauth-login', {
                  id_token: idToken
                })
                localStorage.setItem('access_token', res.data.access_token)
                setIsLoggedIn(true)
              } catch (err) {
                console.error('❌ Failed to login with backend', err)
              }
            }}
            onError={() => {
              console.error('❌ Google Login Failed')
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
          onChange={(e) => fetchDiary(e.target.value)}
          className="border px-3 py-2 rounded shadow-sm"
        />
      </div>

      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">🧘 Meditation Log</h1>
        <p className="text-sm text-gray-500">{date} - Reflect and grow mindfully</p>
      </header>

      <section className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow space-y-6">
        {sections.map((section, idx) => (
          <div key={idx}>
            <h2
              contentEditable
              suppressContentEditableWarning
              className="text-lg font-semibold mb-1"
              onBlur={(e) => handleSectionChange(idx, 'subtitle', e.target.innerText)}
            >
              {section.subtitle}
            </h2>
            <textarea
              className="w-full border rounded p-2 text-sm"
              rows={3}
              placeholder={`Enter content for section ${idx + 1}`}
              value={section.content}
              onChange={(e) => handleSectionChange(idx, 'content', e.target.value)}
            />
          </div>
        ))}

        <div className="text-right mt-4">
          <button
            onClick={handleAddSection}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
          >
            + Add Section
          </button>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <select className="border px-2 py-1 rounded text-sm">
            <option value="private">🔒 Private</option>
            <option value="public">🌍 Public</option>
          </select>

          <button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save Log
          </button>
        </div>
      </section>
    </div>
  )
}

export default App
