'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, getProfile } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { User, AIAgent } from '@/types/database'

export default function Profile() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<User | null>(null)
  const [agents, setAgents] = useState<AIAgent[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateAgent, setShowCreateAgent] = useState(false)
  const [newAgent, setNewAgent] = useState({
    name: '',
    description: '',
    type: 'chatbot',
  })
  const router = useRouter()

  useEffect(() => {
    const initializeProfile = async () => {
      const currentUser = await getCurrentUser()
      
      if (!currentUser) {
        router.push('/auth/signin')
        return
      }

      setUser(currentUser)
      
      // Get user profile
      const userProfile = await getProfile(currentUser.id)
      setProfile(userProfile)

      // Fetch user's AI agents
      const { data: agentsData } = await supabase
        .from('ai_agents')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false })

      if (agentsData) {
        setAgents(agentsData)
      }

      setLoading(false)
    }

    initializeProfile()
  }, [router])

  const createAgent = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return

    const { data, error } = await supabase
      .from('ai_agents')
      .insert({
        user_id: user.id,
        name: newAgent.name,
        description: newAgent.description,
        type: newAgent.type,
        status: 'inactive',
        configuration: {}
      })
      .select()

    if (error) {
      console.error('Error creating agent:', error)
    } else if (data) {
      setAgents([...agents, data[0]])
      setNewAgent({ name: '', description: '', type: 'chatbot' })
      setShowCreateAgent(false)
    }
  }

  const toggleAgentStatus = async (agentId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    
    const { data, error } = await supabase
      .from('ai_agents')
      .update({ status: newStatus })
      .eq('id', agentId)
      .select()

    if (error) {
      console.error('Error updating agent:', error)
    } else if (data) {
      setAgents(agents.map(agent => 
        agent.id === agentId ? { ...agent, status: newStatus as 'active' | 'inactive' } : agent
      ))
    }
  }

  const deleteAgent = async (agentId: string) => {
    const { error } = await supabase
      .from('ai_agents')
      .delete()
      .eq('id', agentId)

    if (error) {
      console.error('Error deleting agent:', error)
    } else {
      setAgents(agents.filter(agent => agent.id !== agentId))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Welcome, {profile?.full_name || user.email}
              </h1>
              <p className="text-gray-300 mt-2">{user.email}</p>
              <div className="mt-2">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  profile?.is_admin 
                    ? 'bg-purple-900 text-purple-200' 
                    : 'bg-blue-900 text-blue-200'
                }`}>
                  {profile?.is_admin ? 'Admin' : 'User'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Member since</p>
              <p className="text-white">{new Date(user.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* AI Agents Section */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Your AI Agents</h2>
            <button
              onClick={() => setShowCreateAgent(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Create New Agent
            </button>
          </div>

          {/* Create Agent Form */}
          {showCreateAgent && (
            <div className="mb-6 p-4 bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Create New AI Agent</h3>
              <form onSubmit={createAgent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Agent Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newAgent.name}
                    onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newAgent.description}
                    onChange={(e) => setNewAgent({...newAgent, description: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Agent Type
                  </label>
                  <select
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newAgent.type}
                    onChange={(e) => setNewAgent({...newAgent, type: e.target.value})}
                  >
                    <option value="chatbot">Chatbot</option>
                    <option value="analyzer">Data Analyzer</option>
                    <option value="assistant">Virtual Assistant</option>
                    <option value="moderator">Content Moderator</option>
                  </select>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                  >
                    Create Agent
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateAgent(false)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Agents List */}
          {agents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No AI agents created yet.</p>
              <p className="text-gray-500 text-sm mt-2">Create your first AI agent to get started!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <div key={agent.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      agent.status === 'active' 
                        ? 'bg-green-900 text-green-200' 
                        : 'bg-gray-600 text-gray-200'
                    }`}>
                      {agent.status}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">{agent.description}</p>
                  <p className="text-gray-400 text-xs mb-4">Type: {agent.type}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleAgentStatus(agent.id, agent.status)}
                      className={`px-3 py-1 rounded text-sm ${
                        agent.status === 'active'
                          ? 'bg-yellow-600 hover:bg-yellow-700'
                          : 'bg-green-600 hover:bg-green-700'
                      } text-white`}
                    >
                      {agent.status === 'active' ? 'Pause' : 'Activate'}
                    </button>
                    <button
                      onClick={() => deleteAgent(agent.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 