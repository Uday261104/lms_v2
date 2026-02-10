import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

interface Chapter {
  title: string;
  video_url: string;
  video_duration: number;
}

interface Section {
  title: string;
  chapters: Chapter[];
}

const CreateCourse: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    thumbnail: null as File | null,
  });

  const [sections, setSections] = useState<Section[]>([
    {
      title: "",
      chapters: [{ title: "", video_url: "", video_duration: 0 }],
    },
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        thumbnail: e.target.files[0],
      });
    }
  };

  // Section handlers
  const addSection = () => {
    setSections([
      ...sections,
      {
        title: "",
        chapters: [{ title: "", video_url: "", video_duration: 0 }],
      },
    ]);
  };

  const removeSection = (sectionIndex: number) => {
    if (sections.length > 1) {
      setSections(sections.filter((_, index) => index !== sectionIndex));
    }
  };

  const updateSectionTitle = (sectionIndex: number, title: string) => {
    const newSections = [...sections];
    newSections[sectionIndex].title = title;
    setSections(newSections);
  };

  // Chapter handlers
  const addChapter = (sectionIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].chapters.push({
      title: "",
      video_url: "",
      video_duration: 0,
    });
    setSections(newSections);
  };

  const removeChapter = (sectionIndex: number, chapterIndex: number) => {
    const newSections = [...sections];
    if (newSections[sectionIndex].chapters.length > 1) {
      newSections[sectionIndex].chapters = newSections[
        sectionIndex
      ].chapters.filter((_, index) => index !== chapterIndex);
      setSections(newSections);
    }
  };

  const updateChapter = (
    sectionIndex: number,
    chapterIndex: number,
    field: keyof Chapter,
    value: string | number
  ) => {
    const newSections = [...sections];
    newSections[sectionIndex].chapters[chapterIndex][field] = value as never;
    setSections(newSections);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Create course
      const courseData = new FormData();
      courseData.append("title", formData.title);
      courseData.append("description", formData.description);
      courseData.append("requirements", formData.requirements);
      if (formData.thumbnail) {
        courseData.append("thumbnail", formData.thumbnail);
      }

      const courseResponse = await api.post("/courses/create/", courseData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const courseId = courseResponse.data.id;

      // Create sections and chapters
      for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
        const section = sections[sectionIndex];
        
        if (section.title.trim()) {
          const sectionResponse = await api.post("/courses/sections/create/", {
            course: courseId,
            title: section.title,
            order: sectionIndex + 1,
          });

          const sectionId = sectionResponse.data.id;

          // Create chapters for this section
          for (let chapterIndex = 0; chapterIndex < section.chapters.length; chapterIndex++) {
            const chapter = section.chapters[chapterIndex];
            
            if (chapter.title.trim()) {
              await api.post("/courses/chapters/create/", {
                section: sectionId,
                title: chapter.title,
                video_url: chapter.video_url,
                video_duration: parseFloat(chapter.video_duration.toString()) || 0,
                order: chapterIndex + 1,
              });
            }
          }
        }
      }

      navigate("/creator/dashboard");
    } catch (err: unknown) {
      setError("Failed to create course. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-10">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/creator/dashboard")}
            className="mb-4 flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-extrabold text-gray-900">Create New Course</h1>
          <p className="mt-2 text-base text-gray-600">
            Add course details, sections, and chapters to structure your content
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-xl border-2 border-red-200 bg-red-50 px-6 py-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-red-700">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {/* Course Details */}
          <div className="rounded-2xl border border-blue-100 bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Course Details
            </h2>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Course Title *
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="e.g., Complete Python Bootcamp"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Describe what students will learn in this course..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Requirements
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Prerequisites or requirements for this course..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Course Thumbnail (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Course Content</h2>
              <button
                type="button"
                onClick={addSection}
                className="flex items-center gap-2 rounded-xl bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700 transition-all hover:bg-blue-200"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Section
              </button>
            </div>

            {sections.map((section, sectionIndex) => (
              <div
                key={sectionIndex}
                className="rounded-2xl border border-blue-100 bg-white p-6 shadow-lg"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      Section {sectionIndex + 1} Title
                    </label>
                    <input
                      value={section.title}
                      onChange={(e) =>
                        updateSectionTitle(sectionIndex, e.target.value)
                      }
                      className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder={`Section ${sectionIndex + 1} title...`}
                    />
                  </div>
                  {sections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSection(sectionIndex)}
                      className="mt-8 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition-all hover:bg-red-100"
                    >
                      Remove Section
                    </button>
                  )}
                </div>

                {/* Chapters within section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-gray-700">
                      Chapters
                    </label>
                    <button
                      type="button"
                      onClick={() => addChapter(sectionIndex)}
                      className="flex items-center gap-1 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700 transition-all hover:bg-green-100"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Chapter
                    </button>
                  </div>

                  {section.chapters.map((chapter, chapterIndex) => (
                    <div
                      key={chapterIndex}
                      className="rounded-lg border-2 border-gray-100 bg-gray-50 p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm font-bold text-blue-600">
                          Chapter {chapterIndex + 1}
                        </span>
                        {section.chapters.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeChapter(sectionIndex, chapterIndex)
                            }
                            className="text-xs font-semibold text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="space-y-3">
                        <input
                          value={chapter.title}
                          onChange={(e) =>
                            updateChapter(
                              sectionIndex,
                              chapterIndex,
                              "title",
                              e.target.value
                            )
                          }
                          className="w-full rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm font-medium transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          placeholder="Chapter title..."
                        />

                        <input
                          value={chapter.video_url}
                          onChange={(e) =>
                            updateChapter(
                              sectionIndex,
                              chapterIndex,
                              "video_url",
                              e.target.value
                            )
                          }
                          className="w-full rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm font-medium transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          placeholder="Video URL..."
                        />

                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            value={chapter.video_duration}
                            onChange={(e) =>
                              updateChapter(
                                sectionIndex,
                                chapterIndex,
                                "video_duration",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-32 rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm font-medium transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            placeholder="0.0"
                          />
                          <span className="text-sm font-medium text-gray-600">
                            hours
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/creator/dashboard")}
              className="rounded-xl border-2 border-gray-200 px-6 py-3 text-sm font-bold text-gray-700 transition-all hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-3 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl hover:from-blue-700 hover:to-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Course...
                </span>
              ) : (
                "Create Course"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
