'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, getProfile } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { User, AIAgent } from '@/types/database'

export default function AdminDashboard() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [users, setUsers] = useState<User[]>([])
  const [agents, setAgents] = useState<AIAgent[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAgents: 0,
    activeAgents: 0,
    adminUsers: 0
  })
  const router = useRouter()

  useEffect(() => {
    const initializeAdmin = async () => {
      const user = await getCurrentUser()
      
      if (!user) {
        router.push('/auth/signin')
        return
      }

      const profile = await getProfile(user.id)
      
      if (!profile?.is_admin) {
        router.push('/profile')
        return
      }

      setCurrentUser(user)
      
      // Fetch all users
      const { data: usersData } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      // Fetch all agents
      const { data: agentsData } = await supabase
        .from('ai_agents')
        .select('*')
        .order('created_at', { ascending: false })

      if (usersData) {
        setUsers(usersData)
        setStats(prev => ({
          ...prev,
          totalUsers: usersData.length,
          adminUsers: usersData.filter((u: User) => u.is_admin).length
        }))
      }

      if (agentsData) {
        setAgents(agentsData)
        setStats(prev => ({
          ...prev,
          totalAgents: agentsData.length,
          activeAgents: agentsData.filter((a: AIAgent) => a.status === 'active').length
        }))
      }

      setLoading(false)
    }

    initializeAdmin()
  }, [router])

  const toggleUserAdminStatus = async (userId: string, isCurrentlyAdmin: boolean) => {
    const { error } = await supabase
      .from('users')
      .update({ is_admin: !isCurrentlyAdmin })
      .eq('id', userId)

    if (error) {
      console.error('Error updating user:', error)
    } else {
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_admin: !isCurrentlyAdmin } : user
      ))
      setStats(prev => ({
        ...prev,
        adminUsers: prev.adminUsers + (isCurrentlyAdmin ? -1 : 1)
      }))
    }
  }

  const toggleAgentStatus = async (agentId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    
    const { error } = await supabase
      .from('ai_agents')
      .update({ status: newStatus })
      .eq('id', agentId)

    if (error) {
      console.error('Error updating agent:', error)
    } else {
      setAgents(agents.map(agent => 
        agent.id === agentId ? { ...agent, status: newStatus as 'active' | 'inactive' } : agent
      ))
      setStats(prev => ({
        ...prev,
        activeAgents: newStatus === 'active' ? prev.activeAgents + 1 : prev.activeAgents - 1
      }))
    }
  }

  const deleteAgent = async (agentId: string) => {
    const agent = agents.find(a => a.id === agentId)
    
    const { error } = await supabase
      .from('ai_agents')
      .delete()
      .eq('id', agentId)

    if (error) {
      console.error('Error deleting agent:', error)
    } else {
      setAgents(agents.filter(a => a.id !== agentId))
      setStats(prev => ({
        ...prev,
        totalAgents: prev.totalAgents - 1,
        activeAgents: agent?.status === 'active' ? prev.activeAgents - 1 : prev.activeAgents
      }))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading admin dashboard...</div>
      </div>
    )
  }

  if (!currentUser) {
    return null
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-300 mt-2">Manage users and AI agents across the platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-300">Total Users</h3>
            <p className="text-3xl font-bold text-blue-400">{stats.totalUsers}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-300">Admin Users</h3>
            <p className="text-3xl font-bold text-purple-400">{stats.adminUsers}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-300">Total Agents</h3>
            <p className="text-3xl font-bold text-green-400">{stats.totalAgents}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-300">Active Agents</h3>
            <p className="text-3xl font-bold text-yellow-400">{stats.activeAgents}</p>
          </div>
        </div>

        {/* Users Management */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">User Management</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300">User</th>
                  <th className="text-left py-3 px-4 text-gray-300">Email</th>
                  <th className="text-left py-3 px-4 text-gray-300">Role</th>
                  <th className="text-left py-3 px-4 text-gray-300">Joined</th>
                  <th className="text-left py-3 px-4 text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-700">
                    <td className="py-3 px-4 text-white">
                      {user.full_name || 'No name'}
                    </td>
                    <td className="py-3 px-4 text-gray-300">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.is_admin 
                          ? 'bg-purple-900 text-purple-200' 
                          : 'bg-blue-900 text-blue-200'
                      }`}>
                        {user.is_admin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleUserAdminStatus(user.id, user.is_admin)}
                        className={`px-3 py-1 rounded text-sm ${
                          user.is_admin
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-green-600 hover:bg-green-700'
                        } text-white`}
                      >
                        {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Agents Management */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-6">AI Agents Overview</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300">Agent Name</th>
                  <th className="text-left py-3 px-4 text-gray-300">Type</th>
                  <th className="text-left py-3 px-4 text-gray-300">Owner</th>
                  <th className="text-left py-3 px-4 text-gray-300">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300">Created</th>
                  <th className="text-left py-3 px-4 text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((agent) => {
                  const owner = users.find(u => u.id === agent.user_id)
                  return (
                    <tr key={agent.id} className="border-b border-gray-700">
                      <td className="py-3 px-4 text-white">{agent.name}</td>
                      <td className="py-3 px-4 text-gray-300 capitalize">{agent.type}</td>
                      <td className="py-3 px-4 text-gray-300">
                        {owner?.full_name || owner?.email || 'Unknown'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          agent.status === 'active' 
                            ? 'bg-green-900 text-green-200' 
                            : 'bg-gray-600 text-gray-200'
                        }`}>
                          {agent.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {new Date(agent.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleAgentStatus(agent.id, agent.status)}
                            className={`px-2 py-1 rounded text-xs ${
                              agent.status === 'active'
                                ? 'bg-yellow-600 hover:bg-yellow-700'
                                : 'bg-green-600 hover:bg-green-700'
                            } text-white`}
                          >
                            {agent.status === 'active' ? 'Pause' : 'Activate'}
                          </button>
                          <button
                            onClick={() => deleteAgent(agent.id)}
                            className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 