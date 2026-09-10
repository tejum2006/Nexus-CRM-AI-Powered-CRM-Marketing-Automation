import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, Trash2, Mail, Calendar } from 'lucide-react';
import InviteMemberModal from '../components/team/InviteMemberModal';
import Skeleton from '../components/ui/Skeleton';
import * as teamService from '../services/teamService';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../hooks/useAuth';

const Team = () => {
  const { user } = useAuth();
  const { toast } = useToast();
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
      toast.error('Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (userData) => {
    try {
      const res = await teamService.inviteTeamMember(userData);
      if (res.success) {
        toast.success('Team member invited successfully');
        setMembers(prev => [...prev, res.data]);
        setIsInviteModalOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to invite member');
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      const res = await teamService.updateTeamMemberRole(id, newRole);
      if (res.success) {
        setMembers(prev => prev.map(m => m._id === id ? res.data : m));
        toast.success('Role updated');
      }
    } catch {
      toast.error('Failed to update role');
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm('Remove this member from the team?')) return;
    try {
      const res = await teamService.removeTeamMember(id);
      if (res.success) {
        setMembers(prev => prev.filter(m => m._id !== id));
        toast.success('Member removed');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to remove member');
    }
  };

  return (
    <div className="page-scroll flex flex-col h-[calc(100vh-var(--header-height))]">
      {/* Header */}
      <div className="page-header shrink-0 flex items-center justify-between">
        <div>
          <h1 className="heading-1 mb-1">Team</h1>
          <p className="text-body">Manage members and access controls.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-primary" onClick={() => setIsInviteModalOpen(true)}>
            <UserPlus size={16} />
            <span className="hidden sm:inline">Invite Member</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card flex flex-col flex-1 min-h-0 overflow-hidden">
        <div className="flex-1 overflow-auto bg-[var(--bg-app)]">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th className="py-3 px-6 text-left">Member</th>
                  <th className="py-3 px-6 text-left">Role</th>
                  <th className="py-3 px-6 text-left">Joined</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <Skeleton className="w-10 h-10 rounded-full" />
                          <div>
                            <Skeleton className="w-32 h-4 mb-1.5" />
                            <Skeleton className="w-48 h-3" />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6"><Skeleton className="w-32 h-8 rounded-lg" /></td>
                      <td className="py-4 px-6"><Skeleton className="w-24 h-4" /></td>
                      <td className="py-4 px-6"><div className="flex justify-end"><Skeleton className="w-16 h-8 rounded-lg" /></div></td>
                    </tr>
                  ))
                ) : (
                  members.map(member => (
                    <tr key={member._id} className="hover:bg-[var(--bg-surface-hover)] transition-colors border-b border-[var(--border-subtle)]">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-[var(--brand-primary)]/10 flex items-center justify-center shrink-0">
                            <span className="text-sm font-bold text-[var(--brand-primary)]">
                              {member.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white flex items-center gap-2">
                              {member.name}
                              {member._id === user?._id && (
                                <span className="badge badge-success text-[10px] uppercase">
                                  You
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-[var(--text-secondary)] mt-0.5 flex items-center gap-1.5">
                              <Mail size={12} /> {member.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <select
                          className="input !h-9 !py-0 !text-xs w-48"
                          value={member.role}
                          onChange={(e) => handleRoleChange(member._id, e.target.value)}
                          disabled={member._id === user?._id || user?.role !== 'Admin'}
                        >
                          <option value="Sales Executive">Sales Executive</option>
                          <option value="Marketing Manager">Marketing Manager</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] font-medium">
                          <Calendar size={14} className="text-[var(--text-tertiary)]" />
                          {new Date(member.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleRemove(member._id)}
                            disabled={member._id === user?._id || user?.role !== 'Admin'}
                            className="btn btn-danger !h-8 !px-3"
                            title={member._id === user?._id ? "You cannot remove yourself" : "Remove member"}
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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
