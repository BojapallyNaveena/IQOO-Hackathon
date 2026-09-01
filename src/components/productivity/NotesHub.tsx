import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import type { Note } from '../../types';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Tag, 
  Star, 
  Trash2, 
  Edit3, 
  X, 
  Sparkles, 
  FileText,
  Calendar
} from 'lucide-react';

export const NotesHub: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote } = useAppData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Active Note Modal State (Create / View)
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Web Development');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('React, Study');

  const allTags = Array.from(new Set(notes.flatMap(n => n.tags)));

  const filteredNotes = notes.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          n.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          n.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag ? n.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    if (isEditing && activeNote) {
      updateNote(activeNote.id, { title, subject, content, tags });
    } else {
      addNote({ title, subject, content, tags });
    }

    setShowCreateModal(false);
    setActiveNote(null);
    setIsEditing(false);
    setTitle('');
    setContent('');
  };

  const openEditModal = (n: Note) => {
    setActiveNote(n);
    setTitle(n.title);
    setSubject(n.subject);
    setContent(n.content);
    setTagsInput(n.tags.join(', '));
    setIsEditing(true);
    setShowCreateModal(true);
  };

  const openViewModal = (n: Note) => {
    setActiveNote(n);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="glass-card p-6 md:p-8 bg-gradient-to-br from-brand-900/30 via-slate-900 to-slate-900 border-brand-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center border border-brand-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-100">Class Notes Hub</h1>
              <p className="text-xs text-slate-400">Searchable repository for course notes, AI summaries, and markdown study guides.</p>
            </div>
          </div>

          <button
            onClick={() => {
              setTitle('');
              setContent('');
              setTagsInput('General');
              setIsEditing(false);
              setShowCreateModal(true);
            }}
            className="bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Create New Note
          </button>
        </div>

        {/* Search & Tag Filter Bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search notes by keyword, subject, or tag..."
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 border ${
                selectedTag === null ? 'bg-brand-500 text-white border-brand-400' : 'bg-slate-950 text-slate-400 border-slate-700'
              }`}
            >
              All Notes ({notes.length})
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 border ${
                  selectedTag === tag ? 'bg-brand-500 text-white border-brand-400' : 'bg-slate-950 text-slate-400 border-slate-700'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            onClick={() => openViewModal(note)}
            className="glass-card p-6 cursor-pointer hover:border-brand-500/50 transition flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/20">
                  {note.subject}
                </span>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(note);
                    }}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                    className="p-1 text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 line-clamp-1">{note.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed font-sans">{note.content}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400">
              <div className="flex gap-1 flex-wrap">
                {note.tags.map((t, idx) => (
                  <span key={idx} className="text-slate-400">#{t}</span>
                ))}
              </div>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {new Date(note.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Note View Modal */}
      {activeNote && !showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-brand-500 uppercase">{activeNote.subject}</span>
                <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{activeNote.title}</h2>
              </div>
              <button onClick={() => setActiveNote(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="prose dark:prose-invert text-xs leading-relaxed text-slate-300 whitespace-pre-wrap font-sans">
              {activeNote.content}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => openEditModal(activeNote)}
                className="bg-brand-600 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Note Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                {isEditing ? 'Edit Note' : 'Create New Class Note'}
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-400 block mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Note title..."
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="font-bold text-slate-400 block mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject or Course..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="font-bold text-slate-400 block mb-1">Content (Markdown Supported)</label>
                <textarea
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write note contents..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-400 block mb-1">Tags (Comma separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="React, Frontend, Web"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 text-white font-bold"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
