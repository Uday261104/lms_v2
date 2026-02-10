import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { courseService } from "../services/courseService";
import type { CourseDetail } from "../services/courseService";

const CourseContent: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (courseId) fetchCourseContent();
  }, [courseId]);

  const fetchCourseContent = async () => {
    try {
      const data = await courseService.getCourseContent(Number(courseId));
      setCourse(data);
      if (data.sections.length > 0 && data.sections[0].chapters.length > 0) {
        setSelectedChapter(data.sections[0].chapters[0].id);
      }
    } catch {
      setError("Failed to load course content.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
      </div>
    );
  }

  if (!course || error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-4 text-red-700">
          {error || "Course not found"}
        </div>
      </div>
    );
  }

  // Flatten all chapters from all sections
  const allChapters = course.sections.flatMap(section => section.chapters);
  const currentChapter = allChapters.find((c) => c.id === selectedChapter);
  const currentIndex = allChapters.findIndex(
    (c) => c.id === selectedChapter,
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main */}
      <div className="flex flex-1 flex-col">
        {/* Video */}
        <div className="bg-black">
          <div className="mx-auto max-w-7xl">
            <div className="aspect-video flex items-center justify-center text-white">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-purple-600/20">
                  ▶
                </div>
                <p className="text-xl font-semibold">
                  {currentChapter?.title || "Select a chapter"}
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Video player integration ready
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="border-b bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <button
              disabled={currentIndex === 0}
              onClick={() =>
                currentIndex > 0 &&
                setSelectedChapter(allChapters[currentIndex - 1].id)
              }
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50"
            >
              ← Previous
            </button>

            <p className="text-sm text-gray-600">
              Lecture {currentIndex + 1} of {allChapters.length}
            </p>

            <button
              disabled={currentIndex === allChapters.length - 1}
              onClick={() =>
                currentIndex < allChapters.length - 1 &&
                setSelectedChapter(allChapters[currentIndex + 1].id)
              }
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h1 className="mb-4 text-3xl font-bold text-gray-900">
                {currentChapter?.title || 'Select a lecture'}
              </h1>
              {currentChapter?.content && (
                <div className="prose max-w-none">
                  <p className="text-gray-700 text-lg leading-relaxed">{currentChapter.content}</p>
                </div>
              )}
              {currentChapter?.video_url && (
                <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-800">
                    <strong>Video URL:</strong> {currentChapter.video_url}
                  </p>
                </div>
              )}
            </div>
            
            <div className="mt-6 bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this course</h2>
              <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
              <p className="text-gray-700 leading-relaxed">{course.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="w-96 border-l bg-white">
        <div className="border-b px-5 py-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Course Content
          </h3>
          <p className="text-sm text-gray-500">
            {course.total_sections} sections • {course.total_chapters} lectures
          </p>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-80px)]">
          {course.sections.map((section) => (
            <div key={section.id} className="border-b">
              <div className="px-5 py-3 bg-gray-50">
                <h4 className="font-bold text-gray-900 text-sm">{section.title}</h4>
                <p className="text-xs text-gray-600 mt-1">
                  {section.chapter_count} lectures • {section.total_duration} min
                </p>
              </div>
              <div className="p-2">
                {section.chapters.map((chapter) => (
                  <button
                    key={chapter.id}
                    onClick={() => setSelectedChapter(chapter.id)}
                    className={`mb-1 w-full rounded-lg px-3 py-3 text-left transition ${
                      selectedChapter === chapter.id
                        ? "bg-purple-50 border-2 border-purple-500"
                        : "hover:bg-gray-50 border-2 border-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`shrink-0 w-6 h-6 rounded flex items-center justify-center mt-0.5 ${
                        selectedChapter === chapter.id ? "bg-purple-500" : "bg-gray-200"
                      }`}>
                        {chapter.video_url ? (
                          <svg className={`w-3 h-3 ${selectedChapter === chapter.id ? "text-white" : "text-gray-600"}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                          </svg>
                        ) : (
                          <svg className={`w-3 h-3 ${selectedChapter === chapter.id ? "text-white" : "text-gray-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium leading-snug ${
                          selectedChapter === chapter.id ? "text-purple-700" : "text-gray-800"
                        }`}>
                          {chapter.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {chapter.duration_minutes} min
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
};

export default CourseContent;
