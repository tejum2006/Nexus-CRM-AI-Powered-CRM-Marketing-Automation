import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, Trash2 } from 'lucide-react';
import InviteMemberModal from '../components/team/InviteMemberModal';
import Skeleton from '../components/ui/Skeleton';
import * as teamService from '../services/teamService';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../hooks/useAuth';

const Team = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await teamService.getTeamMembers();
      if (data.success) setMembers(data.data);
    } catch {
      addToast('Failed to fetch team members', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (userData) => {
    try {
      const res = await teamService.inviteTeamMember(userData);
      if (res.success) {
        addToast('Team member invited successfully', 'success');
        setMembers(prev => [...prev, res.data]);
        setIsInviteModalOpen(false);
      }
    } catch (error) {
      addToast(error.response?.data?.error || 'Failed to invite member', 'error');
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      const res = await teamService.updateTeamMemberRole(id, newRole);
      if (res.success) {
        setMembers(prev => prev.map(m => m._id === id ? res.data : m));
        addToast('Role updated', 'success');
      }
    } catch {
      addToast('Failed to update role', 'error');
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm('Remove this member from the team?')) return;
    try {
      const res = await teamService.removeTeamMember(id);
      if (res.success) {
        setMembers(prev => prev.filter(m => m._id !== id));
        addToast('Member removed', 'success');
      }
    } catch (error) {
      addToast(error.response?.data?.error || 'Failed to remove member', 'error');
    }
  };

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="text-display mb-1">Team</h1>
          <p className="text-body">Manage members and access controls.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setIsInviteModalOpen(true)}>
            <UserPlus size={14} />
            Invite Member
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Joined</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td>
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <div>
                          <Skeleton className="w-28 h-3.5 mb-1.5" />
                          <Skeleton className="w-36 h-3" />
                        </div>
                      </div>
                    </td>
                    <td><Skeleton className="w-24 h-3.5" /></td>
                    <td><Skeleton className="w-20 h-3.5" /></td>
                    <td style={{ textAlign: 'right' }}><Skeleton className="w-8 h-8 rounded-md ml-auto" /></td>
                  </tr>
                ))
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan="4">
                    <div className="empty-state">
                      <Users size={28} style={{ color: 'var(--text-faint)' }} />
                      <p className="text-heading">No team members yet</p>
                      <p className="text-caption">Invite your first member to get started.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                members.map(member => (
                  <tr key={member._id} className="table-row">
                    {/* Member */}
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold shrink-0"
                          style={{
                            background: 'var(--bg-active)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-primary)',
                          }}>
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[13.5px] font-medium" style={{ color: 'var(--text-primary)' }}>
                              {member.name}
                            </span>
                            {member._id === user?._id && (
                              <span className="badge badge-gold" style={{ fontSize: '10px', padding: '1px 7px' }}>You</span>
                            )}
                          </div>
                          <div className="text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            {member.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td>
                      <div className="flex items-center gap-1.5">
                        {member.role === 'Admin' && (
                          <Shield size={12} style={{ color: 'var(--gold)' }} />
                        )}
                        <select
                          className="text-[13px] bg-transparent border-none outline-none cursor-pointer"
                          style={{ color: 'var(--text-primary)' }}
                          value={member.role}
                          onChange={(e) => handleRoleChange(member._id, e.target.value)}
                          disabled={member._id === user?._id}
                        >
                          <option value="Admin">Admin</option>
                          <option value="Marketing Manager">Marketing Manager</option>
                          <option value="Sales Executive">Sales Executive</option>
                        </select>
                      </div>
                    </td>

                    {/* Joined */}
                    <td>
                      <span className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
                        {new Date(member.createdAt).toLocaleDateString(undefined, {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleRemove(member._id)}
                        disabled={member._id === user?._id}
                        className="btn btn-ghost h-8 w-8 p-0 hover:text-red-400 disabled:opacity-30"
                        title="Remove member"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInvite}
      />
    </div>
  );
};

export default Team;
