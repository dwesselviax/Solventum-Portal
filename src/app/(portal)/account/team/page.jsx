'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useTeamStore } from '@/stores/team-store';
import { seedMembers, ACCESS_TYPES, NOTIFICATION_TYPES, NOTIFICATION_CHANNELS } from '@/lib/mock-data/account-members';
import { DetailCard } from '@/components/detail/detail-card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { formatDate } from '@/lib/utils/format';
import { toast } from 'sonner';
import {
  UserPlus, Shield, CreditCard, Eye, ShoppingCart,
  MoreHorizontal, Pencil, Bell, UserX, ChevronLeft,
} from 'lucide-react';
import Link from 'next/link';

const ACCESS_ICONS = {
  admin: Shield,
  payer: CreditCard,
  viewer: Eye,
  orderer: ShoppingCart,
};

const ACCESS_COLORS = {
  admin: 'bg-[#E8EAF6] text-[#283593] border-[#7986CB]',
  payer: 'bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]',
  viewer: 'bg-[#F5F5F5] text-[#616161] border-[#BDBDBD]',
  orderer: 'bg-[#FFF8E1] text-[#F57F17] border-[#FFD54F]',
};

const STATUS_COLORS = {
  active: 'bg-[#E8F5E9] text-[#2E7D32]',
  pending: 'bg-[#FFF8E1] text-[#F57F17]',
  deactivated: 'bg-[#FFEBEE] text-[#C62828]',
};

export default function TeamPage() {
  const { user } = useAuthStore();
  const { initialize, getMembers, addMember, updateMember, updateNotification, deactivateMember } = useTeamStore();

  const [inviteOpen, setInviteOpen] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [notifMember, setNotifMember] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [inviteForm, setInviteForm] = useState({ firstName: '', lastName: '', email: '', phone: '', accessType: 'viewer' });
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', email: '', phone: '', accessType: 'viewer' });

  useEffect(() => {
    initialize(seedMembers);
  }, [initialize]);

  const orgId = user?.organizationId;
  const members = orgId ? getMembers(orgId) : [];
  const activeCount = members.filter((m) => m.status === 'active').length;
  const pendingCount = members.filter((m) => m.status === 'pending').length;

  const handleInvite = () => {
    if (!inviteForm.firstName || !inviteForm.lastName || !inviteForm.email) {
      toast.error('Please fill in all required fields');
      return;
    }
    addMember({ ...inviteForm, organizationId: orgId });
    setInviteOpen(false);
    setInviteForm({ firstName: '', lastName: '', email: '', phone: '', accessType: 'viewer' });
    toast.success('Invitation sent to ' + inviteForm.email);
  };

  const handleEdit = () => {
    if (!editMember) return;
    updateMember(editMember.id, {
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      email: editForm.email,
      phone: editForm.phone,
      accessType: editForm.accessType,
    });
    setEditMember(null);
    toast.success('Member updated');
  };

  const openEdit = (member) => {
    setEditForm({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phone: member.phone || '',
      accessType: member.accessType,
    });
    setEditMember(member);
    setMenuOpen(null);
  };

  const openNotifications = (member) => {
    setNotifMember(member);
    setMenuOpen(null);
  };

  const handleDeactivate = (member) => {
    deactivateMember(member.id);
    setMenuOpen(null);
    toast.success(member.firstName + ' ' + member.lastName + ' deactivated');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/account" className="rounded-md p-1 text-[#3c3e3f] transition-colors hover:bg-[#f5f5f5] hover:text-[#01332b]">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Team Members</h1>
          <p className="text-sm text-[#3c3e3f]">{activeCount} active · {pendingCount} pending</p>
        </div>
        <button
          onClick={() => setInviteOpen(true)}
          className="flex items-center gap-2 rounded-md bg-[#05dd4d] px-4 py-2 text-sm font-bold uppercase tracking-wider text-[#01332b] transition-colors hover:bg-[#04c443]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <UserPlus className="h-4 w-4" /> Invite Member
        </button>
      </div>

      {/* Member cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {members.filter((m) => m.status !== 'deactivated').map((member) => {
          const AccessIcon = ACCESS_ICONS[member.accessType] || Eye;
          const initials = (member.firstName?.[0] || '') + (member.lastName?.[0] || '');
          return (
            <div key={member.id} className="relative rounded-lg border border-[#e7e7e7] bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-[#05dd4d] text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
                    {member.firstName} {member.lastName}
                  </p>
                  <p className="truncate text-xs text-[#3c3e3f]">{member.email}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${ACCESS_COLORS[member.accessType]}`} style={{ fontFamily: 'var(--font-heading)' }}>
                      <AccessIcon className="h-3 w-3" /> {ACCESS_TYPES[member.accessType]?.label}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[member.status]}`} style={{ fontFamily: 'var(--font-heading)' }}>
                      {member.status}
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(menuOpen === member.id ? null : member.id)}
                    className="rounded-md p-1.5 text-[#3c3e3f] transition-colors hover:bg-[#f5f5f5]"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                  {menuOpen === member.id && (
                    <div className="absolute right-0 top-8 z-10 w-48 rounded-md border border-[#e7e7e7] bg-white py-1 shadow-lg">
                      <button onClick={() => openEdit(member)} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[#01332b] hover:bg-[#f5f5f5]">
                        <Pencil className="h-3.5 w-3.5" /> Edit Member
                      </button>
                      <button onClick={() => openNotifications(member)} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[#01332b] hover:bg-[#f5f5f5]">
                        <Bell className="h-3.5 w-3.5" /> Configure Notifications
                      </button>
                      {member.status === 'active' && (
                        <button onClick={() => handleDeactivate(member)} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[#C62828] hover:bg-[#FFEBEE]">
                          <UserX className="h-3.5 w-3.5" /> Deactivate
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {member.joinedAt && (
                <p className="mt-2 text-[10px] text-[#3c3e3f]">Joined {formatDate(member.joinedAt)}</p>
              )}
              {!member.joinedAt && member.invitedAt && (
                <p className="mt-2 text-[10px] text-[#F57F17]">Invited {formatDate(member.invitedAt)}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Deactivated members */}
      {members.some((m) => m.status === 'deactivated') && (
        <DetailCard title="Deactivated Members">
          <div className="space-y-2">
            {members.filter((m) => m.status === 'deactivated').map((member) => (
              <div key={member.id} className="flex items-center justify-between rounded-md bg-[#FAFAFA] p-3">
                <div>
                  <p className="text-sm text-[#3c3e3f]">{member.firstName} {member.lastName}</p>
                  <p className="text-xs text-[#3c3e3f]">{member.email}</p>
                </div>
                <span className="rounded-full bg-[#FFEBEE] px-2 py-0.5 text-[10px] font-bold uppercase text-[#C62828]" style={{ fontFamily: 'var(--font-heading)' }}>
                  Deactivated
                </span>
              </div>
            ))}
          </div>
        </DetailCard>
      )}

      {/* Invite Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Invite Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-bold uppercase text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>First Name *</Label>
                <Input value={inviteForm.firstName} onChange={(e) => setInviteForm({ ...inviteForm, firstName: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs font-bold uppercase text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Last Name *</Label>
                <Input value={inviteForm.lastName} onChange={(e) => setInviteForm({ ...inviteForm, lastName: e.target.value })} className="mt-1" />
              </div>
            </div>
            <div>
              <Label className="text-xs font-bold uppercase text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Email *</Label>
              <Input type="email" value={inviteForm.email} onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs font-bold uppercase text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Phone</Label>
              <Input type="tel" value={inviteForm.phone} onChange={(e) => setInviteForm({ ...inviteForm, phone: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs font-bold uppercase text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Access Type</Label>
              <div className="mt-2 space-y-2">
                {Object.entries(ACCESS_TYPES).map(([key, { label, description }]) => {
                  const Icon = ACCESS_ICONS[key];
                  return (
                    <label key={key} className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors ${inviteForm.accessType === key ? 'border-[#0a7b6b] bg-[#f0fdf4]' : 'border-[#e7e7e7] hover:bg-[#FAFAFA]'}`}>
                      <input type="radio" name="accessType" value={key} checked={inviteForm.accessType === key} onChange={() => setInviteForm({ ...inviteForm, accessType: key })} className="sr-only" />
                      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${inviteForm.accessType === key ? 'text-[#0a7b6b]' : 'text-[#3c3e3f]'}`} />
                      <div>
                        <p className="text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{label}</p>
                        <p className="text-xs text-[#3c3e3f]">{description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setInviteOpen(false)} className="rounded-md border border-[#e7e7e7] px-4 py-2 text-sm font-bold uppercase tracking-wider text-[#3c3e3f] transition-colors hover:bg-[#f5f5f5]" style={{ fontFamily: 'var(--font-heading)' }}>
              Cancel
            </button>
            <button onClick={handleInvite} className="rounded-md bg-[#05dd4d] px-4 py-2 text-sm font-bold uppercase tracking-wider text-[#01332b] transition-colors hover:bg-[#04c443]" style={{ fontFamily: 'var(--font-heading)' }}>
              Send Invite
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editMember} onOpenChange={(open) => !open && setEditMember(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Edit Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-bold uppercase text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>First Name</Label>
                <Input value={editForm.firstName} onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs font-bold uppercase text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Last Name</Label>
                <Input value={editForm.lastName} onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })} className="mt-1" />
              </div>
            </div>
            <div>
              <Label className="text-xs font-bold uppercase text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Email</Label>
              <Input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs font-bold uppercase text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Phone</Label>
              <Input type="tel" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs font-bold uppercase text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Access Type</Label>
              <div className="mt-2 space-y-2">
                {Object.entries(ACCESS_TYPES).map(([key, { label, description }]) => {
                  const Icon = ACCESS_ICONS[key];
                  return (
                    <label key={key} className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors ${editForm.accessType === key ? 'border-[#0a7b6b] bg-[#f0fdf4]' : 'border-[#e7e7e7] hover:bg-[#FAFAFA]'}`}>
                      <input type="radio" name="editAccessType" value={key} checked={editForm.accessType === key} onChange={() => setEditForm({ ...editForm, accessType: key })} className="sr-only" />
                      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${editForm.accessType === key ? 'text-[#0a7b6b]' : 'text-[#3c3e3f]'}`} />
                      <div>
                        <p className="text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{label}</p>
                        <p className="text-xs text-[#3c3e3f]">{description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setEditMember(null)} className="rounded-md border border-[#e7e7e7] px-4 py-2 text-sm font-bold uppercase tracking-wider text-[#3c3e3f] transition-colors hover:bg-[#f5f5f5]" style={{ fontFamily: 'var(--font-heading)' }}>
              Cancel
            </button>
            <button onClick={handleEdit} className="rounded-md bg-[#05dd4d] px-4 py-2 text-sm font-bold uppercase tracking-wider text-[#01332b] transition-colors hover:bg-[#04c443]" style={{ fontFamily: 'var(--font-heading)' }}>
              Save Changes
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notification Dialog */}
      <Dialog open={!!notifMember} onOpenChange={(open) => !open && setNotifMember(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
              Notification Preferences — {notifMember?.firstName} {notifMember?.lastName}
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e7e7e7]">
                  <th className="pb-2 pr-4 text-left text-xs font-bold uppercase text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Notification</th>
                  {NOTIFICATION_CHANNELS.map((ch) => (
                    <th key={ch.key} className="pb-2 px-3 text-center text-xs font-bold uppercase text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
                      {ch.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {NOTIFICATION_TYPES.map((nt) => (
                  <tr key={nt.key} className="border-b border-[#f5f5f5]">
                    <td className="py-3 pr-4 text-sm text-[#01332b]">{nt.label}</td>
                    {NOTIFICATION_CHANNELS.map((ch) => (
                      <td key={ch.key} className="py-3 px-3 text-center">
                        <Switch
                          checked={notifMember?.notifications?.[nt.key]?.[ch.key] ?? false}
                          onCheckedChange={(checked) => {
                            updateNotification(notifMember.id, nt.key, ch.key, checked);
                            // Re-read the member to update dialog state
                            setNotifMember((prev) => ({
                              ...prev,
                              notifications: {
                                ...prev.notifications,
                                [nt.key]: { ...prev.notifications[nt.key], [ch.key]: checked },
                              },
                            }));
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DialogFooter>
            <button onClick={() => setNotifMember(null)} className="rounded-md bg-[#05dd4d] px-4 py-2 text-sm font-bold uppercase tracking-wider text-[#01332b] transition-colors hover:bg-[#04c443]" style={{ fontFamily: 'var(--font-heading)' }}>
              Done
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
