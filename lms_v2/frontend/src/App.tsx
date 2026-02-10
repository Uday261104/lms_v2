import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import CreatorRoute from './components/CreatorRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MyEnrollments from './pages/MyEnrollments';
import CourseDetail from './pages/CourseDetails';
import CourseContent from './pages/CourseContent';
import CreatorDashboard from './pages/CreatorDashboard';
import CreateCourse from './pages/CreateCourse';
import EditCourse from './pages/EditCourse';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/course/:courseId" element={<CourseDetail />} />

            
            <Route
              path="/my-enrollments"
              element={
                <ProtectedRoute>
                  <MyEnrollments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course/:courseId/content"
              element={
                <ProtectedRoute>
                  <CourseContent />
                </ProtectedRoute>
              }
            />

            {/* Protected Creator Routes */}
            <Route
              path="/creator/dashboard"
              element={
                <CreatorRoute>
                  <CreatorDashboard />
                </CreatorRoute>
              }
            />
            <Route
              path="/creator/create-course"
              element={
                <CreatorRoute>
                  <CreateCourse />
                </CreatorRoute>
              }
            />
            <Route
              path="/creator/edit-course/:courseId"
              element={
                <CreatorRoute>
                  <EditCourse />
                </CreatorRoute>
              }
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
