"use client";

import { useState, useEffect } from "react";
import { Membership } from "@/backend/types";
import MembershipCardForm from "@/components/admin/MembershipCardForm";
import { Plus, Edit, Trash2, Search, Loader2 } from "lucide-react";

export default function MembershipPage() {
  const [view, setView] = useState<"LIST" | "FORM">("LIST");
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch memberships
  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/memberships");
      if (res.ok) {
        const data = await res.json();
        setMemberships(data);
      }
    } catch (error) {
      console.error("Failed to fetch memberships", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setView("FORM");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this membership?")) return;

    try {
      const res = await fetch(`/api/memberships/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMemberships((prev) => prev.filter((m) => m.id !== id));
      } else {
        alert("Failed to delete membership");
      }
    } catch (error) {
      alert("Error deleting membership");
    }
  };

  const handleCreate = () => {
    setEditingId(null);
    setView("FORM");
  };

  const handleSubmit = async (data: Partial<Membership>) => {
    setIsSubmitting(true);
    try {
      const url = editingId ? `/api/memberships/${editingId}` : "/api/memberships";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        await fetchMemberships();
        setView("LIST");
        setEditingId(null);
      } else {
        const err = await res.json();
        alert(`Error: ${err.error || "Failed to save"}`);
      }
    } catch (error) {
      alert("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredMemberships = memberships.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (view === "FORM") {
    const initialData = editingId
      ? memberships.find((m) => m.id === editingId)
      : undefined;

    return (
      <MembershipCardForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={() => setView("LIST")}
        isSubmitting={isSubmitting}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Memberships</h1>
        <button onClick={handleCreate} className="btn btn-primary gap-2">
          <Plus size={20} /> Add Member
        </button>
      </div>

      <div className="flex gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <Search className="text-gray-400" />
        <input
          type="text"
          placeholder="Search members by name..."
          className="flex-1 outline-none text-gray-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
          <table className="table w-full">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th>Name</th>
                <th>Address</th>
                <th>Coop</th>
                <th>Issued</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMemberships.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">
                    No memberships found.
                  </td>
                </tr>
              ) : (
                filteredMemberships.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="font-bold">{member.name}</td>
                    <td className="truncate max-w-xs">{member.presentAddress}</td>
                    <td>{member.coopName}</td>
                    <td>{member.dateIssued}</td>
                    <td className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(member.id)}
                        className="btn btn-sm btn-ghost text-blue-600 hover:bg-blue-50"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="btn btn-sm btn-ghost text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
