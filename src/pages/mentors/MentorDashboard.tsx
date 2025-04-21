import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const MentorDashboard = () => {
  const [mentor, setMentor] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ full_name: "", phone: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch mentor profile on mount
  useEffect(() => {
    const fetchMentor = async () => {
      setLoading(true);
      setError(null);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }
      const { data, error: mentorError } = await supabase
        .from("mentors")
        .select("full_name, phone, email")
        .eq("id", user.id)
        .single();
      if (mentorError || !data) {
        setError("Mentor profile not found");
        setLoading(false);
        return;
      }
      setMentor(data);
      setForm(data);
      setLoading(false);
    };
    fetchMentor();
  }, []);

  // Handle edit/save
  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    setForm(mentor);
    setSuccess(null);
    setError(null);
  };
  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    const { data: { user } } = await supabase.auth.getUser();
    const { error: updateError } = await supabase
      .from("mentors")
      .update({
        full_name: form.full_name,
        phone: form.phone,
        email: form.email,
      })
      .eq("id", user.id);
    if (updateError) {
      setError("Update failed: " + updateError.message);
    } else {
      setMentor(form);
      setSuccess("Profile updated successfully");
      setEditMode(false);
    }
    setLoading(false);
  };

  // Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) return <div className="flex justify-center items-center min-h-[40vh]">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Mentor Dashboard</h1>
      <div className="bg-white dark:bg-background rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Profile</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <div className="space-y-4">
          <Input
            value={form.full_name}
            onChange={e => setForm({ ...form, full_name: e.target.value })}
            disabled={!editMode}
            placeholder="Full Name"
          />
          <Input
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            disabled={!editMode}
            placeholder="Phone Number"
          />
          <Input
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            disabled={!editMode}
            placeholder="Email"
          />
        </div>
        <div className="flex gap-2 mt-4">
          {!editMode ? (
            <Button onClick={handleEdit}>Edit Profile</Button>
          ) : (
            <>
              <Button onClick={handleSave} disabled={loading}>Save</Button>
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            </>
          )}
        </div>
      </div>
      <div className="bg-white dark:bg-background rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Availability (Coming Soon)</h2>
        <p className="text-muted-foreground">Set your available time slots for mentees to book sessions.</p>
      </div>
      <div className="bg-white dark:bg-background rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Chat Requests (Coming Soon)</h2>
        <p className="text-muted-foreground">View and manage incoming chat requests from mentees.</p>
      </div>
      <div className="bg-white dark:bg-background rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Settings</h2>
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
        {/* TODO: Add Delete Account, Change Password options */}
      </div>
    </div>
  );
};

export default MentorDashboard;
