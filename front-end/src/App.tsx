"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { Plus, X, ChevronDown, FileText } from 'lucide-react'
import { API_BASE } from './api'

interface JobApplication {
  id: string
  position: string
  company: string
  salary: string
  employmentType: "fulltime" | "parttime" | "internship"
  location: string
  applicationDeadline?: string
  interviewDeadline?: string
  status: "applied" | "interview" | "offer" | "rejected"
  notes?: string
}

interface AppProps {
  onLogout: () => void
}

export default function App({ onLogout }: AppProps) {
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [showModal, setShowModal] = useState(false)
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null)
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null)
  const [showMoveModal, setShowMoveModal] = useState(false)
  const [expandedCards, setExpandedCards] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const [showEditModal, setShowEditModal] = useState(false)
  const [editingAppForEdit, setEditingAppForEdit] = useState<JobApplication | null>(null)

  const [formData, setFormData] = useState({
    position: "",
    company: "",
    salary: "",
    employmentType: "fulltime" as "fulltime" | "parttime" | "internship",
    location: "",
    applicationDeadline: "",
    interviewDeadline: "",
  })

  const [editFormData, setEditFormData] = useState({
    position: "",
    company: "",
    salary: "",
    employmentType: "fulltime" as "fulltime" | "parttime" | "internship",
    location: "",
    applicationDeadline: "",
    interviewDeadline: "",
  })

  // Helpers: mapping between client <-> server payloads
  const normalizeEmploymentToServer = (employmentType: JobApplication["employmentType"]): string => {
    switch (employmentType) {
      case "fulltime":
        return "full-time"
      case "parttime":
        return "part-time"
      case "internship":
        return "intern"
      default:
        return "full-time"
    }
  }

  const normalizeEmploymentToClient = (employment: string): JobApplication["employmentType"] => {
    switch (employment) {
      case "full-time":
        return "fulltime"
      case "part-time":
        return "parttime"
      case "intern":
        return "internship"
      default:
        return "fulltime"
    }
  }

  const toAuthHeader = (): Record<string, string> => {
    const token = localStorage.getItem('token')
    return token ? { Authorization: token } : {}
  }

  const today = (): string => {
    const d = new Date()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${d.getFullYear()}-${month}-${day}`
  }

  const mapServerToClient = (row: any): JobApplication => ({
    id: String(row.id),
    position: row.position ?? "",
    company: row.company ?? "",
    salary: row.salary != null ? String(row.salary) : "",
    employmentType: normalizeEmploymentToClient(row.employment ?? "full-time"),
    location: row.location ?? "",
    applicationDeadline: row.status === 'applied' ? row.date ?? undefined : undefined,
    interviewDeadline: row.status === 'interview' ? row.date ?? undefined : undefined,
    status: (row.status ?? 'applied') as JobApplication["status"],
    notes: undefined,
  })

  const mapClientToServer = (app: Partial<JobApplication> & { status: JobApplication["status"] }) => {
    const employment = normalizeEmploymentToServer(app.employmentType ?? "fulltime")
    const salaryNumber = (() => {
      if (app.salary == null) return 0
      const parsed = parseInt(String(app.salary).replace(/[^0-9-]/g, ''), 10)
      return Number.isFinite(parsed) ? parsed : 0
    })()
    const date = app.applicationDeadline || app.interviewDeadline || today()
    return {
      position: app.position ?? "",
      employment,
      company: app.company ?? "",
      salary: salaryNumber,
      location: app.location ?? "",
      status: app.status,
      date,
    }
  }

  const fetchApplications = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE}/applications`, {
        headers: {
          ...toAuthHeader(),
        },
      })
      const data = await res.json().catch(() => [])
      if (!res.ok) throw new Error((data as any)?.message ?? 'Failed to fetch applications')
      const normalized = Array.isArray(data) ? data.map(mapServerToClient) : []
      setApplications(normalized)
    } catch (err) {
      console.error(err)
      setApplications([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    })
  }

  const openEditModal = (app: JobApplication) => {
    setEditingAppForEdit(app)
    setEditFormData({
      position: app.position,
      company: app.company,
      salary: app.salary,
      employmentType: app.employmentType,
      location: app.location,
      applicationDeadline: app.applicationDeadline || "",
      interviewDeadline: app.interviewDeadline || "",
    })
    setShowEditModal(true)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingAppForEdit) return

    const clientPayload = {
      position: editFormData.position,
      company: editFormData.company,
      salary: editFormData.salary,
      employmentType: editFormData.employmentType,
      location: editFormData.location,
      applicationDeadline: editFormData.applicationDeadline || undefined,
      interviewDeadline: editFormData.interviewDeadline || undefined,
      status: editingAppForEdit.status,
    } as const
    const payload = mapClientToServer(clientPayload)

    try {
      const res = await fetch(`${API_BASE}/applications/${editingAppForEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...toAuthHeader(),
        },
        body: JSON.stringify(payload as any),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        // proceed to update UI anyway since backend may be WIP
        console.warn(data?.message ?? 'Update failed, applying optimistic update')
      }

      const updatedClient = mapServerToClient({ id: editingAppForEdit.id, ...payload })
      const updatedApp: JobApplication = { ...editingAppForEdit, ...updatedClient }
      setApplications(applications.map((app) => (app.id === editingAppForEdit.id ? updatedApp : app)))
      setShowEditModal(false)
      setEditingAppForEdit(null)
    } catch (err) {
      console.error(err)
      alert((err as Error).message)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const clientPayload = {
        position: formData.position,
        company: formData.company,
        salary: formData.salary,
        employmentType: formData.employmentType,
        location: formData.location,
        applicationDeadline: formData.applicationDeadline || undefined,
        interviewDeadline: formData.interviewDeadline || undefined,
        status: 'applied' as const,
      }
      const payload = mapClientToServer(clientPayload)
      const res = await fetch(`${API_BASE}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...toAuthHeader(),
        },
        body: JSON.stringify(payload as any),
      })
      const data = await res.json().catch(() => ({} as any))
      if (!res.ok) throw new Error((data as any)?.message ?? 'Create failed')

      const createdServer = { id: data?.id ?? Date.now(), ...(data?.id ? data : payload) }
      const created: JobApplication = mapServerToClient(createdServer)
      setApplications([...applications, created])
      setFormData({
        position: '',
        company: '',
        salary: '',
        employmentType: 'fulltime',
        location: '',
        applicationDeadline: '',
        interviewDeadline: '',
      })
      setShowModal(false)
    } catch (err) {
      console.error(err)
      alert((err as Error).message)
    }
  }

  const moveApplication = async (appId: string, newStatus: JobApplication["status"]) => {
    const appToUpdate = applications.find(a => a.id === appId)
    if (!appToUpdate) return

    const optimistic = applications.map(app => app.id === appId ? { ...app, status: newStatus } : app)
    setApplications(optimistic)
    setShowMoveModal(false)
    setEditingApp(null)

    try {
      const payload = mapClientToServer({ ...appToUpdate, status: newStatus })
      const res = await fetch(`${API_BASE}/applications/${appId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...toAuthHeader(),
        },
        body: JSON.stringify(payload as any),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        console.warn(data?.message ?? 'Move update failed')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const deleteApplication = async (appId: string) => {
    try {
      const res = await fetch(`${API_BASE}/applications/${appId}`, {
        method: 'DELETE',
        headers: {
          ...toAuthHeader(),
        },
      })
      if (res.ok) {
        setApplications(prevApplications => prevApplications.filter((app) => app.id !== appId))
      } else {
        const data = await res.json().catch(() => ({}))
        alert((data as any)?.message ?? 'Delete not available')
      }
    } catch (err) {
      console.error(err)
      alert((err as Error).message)
    }
  }

  const updateApplicationNotes = (appId: string, notes: string) => {
    setApplications(applications.map((app) => (app.id === appId ? { ...app, notes } : app)))
  }

  const getApplicationsByStatus = (status: JobApplication["status"]) => {
    const byStatus = applications.filter((app) => app.status === status)
    const q = searchQuery.trim().toLowerCase()
    if (q.length === 0) return byStatus
    return byStatus.filter((app) => {
      const haystack = `${app.company} ${app.position} ${app.location ?? ""}`.toLowerCase()
      return haystack.includes(q)
    })
  }

  const openNotesModal = (app: JobApplication) => {
    setSelectedApp(app)
    setShowNotesModal(true)
  }

  const openMoveModal = (app: JobApplication) => {
    setEditingApp(app)
    setShowMoveModal(true)
  }

  const toggleCardExpansion = (appId: string) => {
    if (expandedCards.includes(appId)) {
      setExpandedCards(expandedCards.filter((id) => id !== appId))
    } else {
      setExpandedCards([...expandedCards, appId])
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 p-4 flex items-center justify-between rounded-lg">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-2 rounded-lg">
            <FileText className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold">Apply Log </h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-700 px-4 py-2 rounded-lg w-80 pt-2 pl-3.5"
              aria-label="Search jobs"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isLoading && (
            <span className="text-gray-400 text-sm">Loading...</span>
          )}
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Application
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('token')
              onLogout()
            }}
            className="text-gray-400 hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-4 gap-6">
          {/* Applied Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <h2 className="font-semibold">Applied</h2>
              <span className="bg-slate-700 px-2 py-1 text-sm rounded-lg">
                {getApplicationsByStatus("applied").length}
              </span>
            </div>
            <div className="space-y-4">
              {getApplicationsByStatus("applied").map((app) => (
                <div key={app.id} className="bg-slate-800 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{app.company}</h3>
                      <p className="text-gray-400 text-sm">{app.position}</p>
                    </div>
                    <button onClick={() => toggleCardExpansion(app.id)} className="text-gray-400 hover:text-white">
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${expandedCards.includes(app.id) ? "rotate-180" : ""}`}
                      />
                    </button>
                  </div>

                  {expandedCards.includes(app.id) && (
                    <div className="mt-2 space-y-1">
                      <p className="text-gray-400 text-sm">{app.salary}</p>
                      <p className="text-gray-400 text-sm">{app.location}</p>
                      {app.applicationDeadline && (
                        <p className="text-yellow-400 text-sm">Due: {app.applicationDeadline}</p>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(app)}
                          className="mt-2 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openMoveModal(app)}
                          className="mt-2 bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                        >
                          Move <ChevronDown className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => deleteApplication(app.id)}
                          className="mt-2 bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Interview Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <h2 className="font-semibold">Interviews</h2>
              <span className="bg-slate-700 px-2 py-1 text-sm rounded-lg">
                {getApplicationsByStatus("interview").length}
              </span>
            </div>
            <div className="space-y-4">
              {getApplicationsByStatus("interview").map((app) => (
                <div key={app.id} className="bg-slate-800 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{app.company}</h3>
                      <p className="text-gray-400 text-sm">{app.position}</p>
                    </div>
                    <button onClick={() => toggleCardExpansion(app.id)} className="text-gray-400 hover:text-white">
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${expandedCards.includes(app.id) ? "rotate-180" : ""}`}
                      />
                    </button>
                  </div>

                  {expandedCards.includes(app.id) && (
                    <div className="mt-2 space-y-1">
                      <p className="text-gray-400 text-sm">{app.salary}</p>
                      <p className="text-gray-400 text-sm">{app.location}</p>
                      {app.interviewDeadline && (
                        <p className="text-purple-400 text-sm">Interview: {app.interviewDeadline}</p>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(app)}
                          className="mt-2 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openMoveModal(app)}
                          className="mt-2 bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                        >
                          Move <ChevronDown className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => deleteApplication(app.id)}
                          className="mt-2 bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Offers Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <h2 className="font-semibold">Offers</h2>
              <span className="bg-slate-700 px-2 py-1 text-sm rounded-lg">
                {getApplicationsByStatus("offer").length}
              </span>
            </div>
            <div className="space-y-4">
              {getApplicationsByStatus("offer").map((app) => (
                <div key={app.id} className="bg-slate-800 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{app.company}</h3>
                      <p className="text-gray-400 text-sm">{app.position}</p>
                    </div>
                    <button onClick={() => toggleCardExpansion(app.id)} className="text-gray-400 hover:text-white">
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${expandedCards.includes(app.id) ? "rotate-180" : ""}`}
                      />
                    </button>
                  </div>

                  {expandedCards.includes(app.id) && (
                    <div className="mt-2 space-y-1">
                      <p className="text-gray-400 text-sm">{app.salary}</p>
                      <p className="text-gray-400 text-sm">{app.location}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(app)}
                          className="mt-2 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openMoveModal(app)}
                          className="mt-2 bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                        >
                          Move <ChevronDown className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => deleteApplication(app.id)}
                          className="mt-2 bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Rejected Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <h2 className="font-semibold">Rejected</h2>
              <span className="bg-slate-700 px-2 py-1 text-sm rounded-lg">
                {getApplicationsByStatus("rejected").length}
              </span>
            </div>
            <div className="space-y-4">
              {getApplicationsByStatus("rejected").map((app) => (
                <div key={app.id} className="bg-slate-800 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{app.company}</h3>
                      <p className="text-gray-400 text-sm">{app.position}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openNotesModal(app)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 text-sm rounded-lg"
                      >
                        Notes
                      </button>
                      <button onClick={() => toggleCardExpansion(app.id)} className="text-gray-400 hover:text-white">
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${expandedCards.includes(app.id) ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>
                  </div>

                  {expandedCards.includes(app.id) && (
                    <div className="mt-2 space-y-1">
                      <p className="text-gray-400 text-sm">{app.salary}</p>
                      <p className="text-gray-400 text-sm">{app.location}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(app)}
                          className="mt-2 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openMoveModal(app)}
                          className="mt-2 bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-md text-sm flex items-center gap-1"
                        >
                          Move <ChevronDown className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => deleteApplication(app.id)}
                          className="mt-2 bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Application Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 text-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add Application</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Position*</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  placeholder="Ex: Software Developer"
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Employment Type</label>
                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400"
                >
                  <option value="fulltime">Full-time</option>
                  <option value="parttime">Part-time</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Company Name*</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Ex: Google"
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Salary/Wage</label>
                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  placeholder="Ex: $75,000 CAD or $25/hour CAD"
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Ex: Toronto, ON"
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Application Deadline</label>
                <input
                  type="date"
                  name="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400"
                />
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Save
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Move Application Modal */}
      {showMoveModal && editingApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 text-white p-6 rounded-lg w-80">
            <h3 className="text-lg font-semibold mb-4">Move Application</h3>
            <p className="text-sm text-gray-400 mb-4">
              Move {editingApp.company} - {editingApp.position} to:
            </p>
            <div className="space-y-2">
              {editingApp.status !== "applied" && (
                <button
                  onClick={() => moveApplication(editingApp.id, "applied")}
                  className="w-full text-left p-2 hover:bg-slate-700 rounded"
                >
                  Applied
                </button>
              )}
              {editingApp.status !== "interview" && (
                <button
                  onClick={() => moveApplication(editingApp.id, "interview")}
                  className="w-full text-left p-2 hover:bg-slate-700 rounded"
                >
                  Interview
                </button>
              )}
              {editingApp.status !== "offer" && (
                <button
                  onClick={() => moveApplication(editingApp.id, "offer")}
                  className="w-full text-left p-2 hover:bg-slate-700 rounded"
                >
                  Offer
                </button>
              )}
              {editingApp.status !== "rejected" && (
                <button
                  onClick={() => moveApplication(editingApp.id, "rejected")}
                  className="w-full text-left p-2 hover:bg-slate-700 rounded"
                >
                  Rejected
                </button>
              )}
            </div>
            <button
              onClick={() => setShowMoveModal(false)}
              className="mt-4 w-full bg-slate-700 text-white py-2 rounded hover:bg-slate-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {showNotesModal && selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 text-white p-6 rounded-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Rejection Notes</h3>
              <button onClick={() => setShowNotesModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              {selectedApp.company} - {selectedApp.position}
            </p>
            <textarea
              value={selectedApp.notes || ""}
              onChange={(e) => {
                const updatedApp = { ...selectedApp, notes: e.target.value }
                setSelectedApp(updatedApp)
                updateApplicationNotes(selectedApp.id, e.target.value)
              }}
              placeholder="Add notes about why you were rejected and areas for improvement..."
              className="w-full h-32 p-2 bg-slate-700 border border-slate-600 rounded resize-none text-white placeholder-gray-400"
            />
            <button
              onClick={() => setShowNotesModal(false)}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Save Notes
            </button>
          </div>
        </div>
      )}

      {/* Edit Application Modal */}
      {showEditModal && editingAppForEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 text-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Application</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Position*</label>
                <input
                  type="text"
                  name="position"
                  value={editFormData.position}
                  onChange={handleEditInputChange}
                  placeholder="Ex: Software Developer"
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Employment Type</label>
                <select
                  name="employmentType"
                  value={editFormData.employmentType}
                  onChange={handleEditInputChange}
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400"
                >
                  <option value="fulltime">Full-time</option>
                  <option value="parttime">Part-time</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Company Name*</label>
                <input
                  type="text"
                  name="company"
                  value={editFormData.company}
                  onChange={handleEditInputChange}
                  placeholder="Ex: Google"
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Salary/Wage</label>
                <input
                  type="text"
                  name="salary"
                  value={editFormData.salary}
                  onChange={handleEditInputChange}
                  placeholder="Ex: $75,000 CAD or $25/hour CAD"
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={editFormData.location}
                  onChange={handleEditInputChange}
                  placeholder="Ex: Toronto, ON"
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400"
                />
              </div>

              {editingAppForEdit.status === "applied" && (
                <div>
                  <label className="block text-sm font-medium mb-1">Application Deadline</label>
                  <input
                    type="date"
                    name="applicationDeadline"
                    value={editFormData.applicationDeadline}
                    onChange={handleEditInputChange}
                    className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400"
                  />
                </div>
              )}

              {editingAppForEdit.status === "interview" && (
                <div>
                  <label className="block text-sm font-medium mb-1">Interview Deadline</label>
                  <input
                    type="date"
                    name="interviewDeadline"
                    value={editFormData.interviewDeadline}
                    onChange={handleEditInputChange}
                    className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400"
                  />
                </div>
              )}

              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Update Application
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
