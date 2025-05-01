import VideoPlayer from './components/VideoPlayer';

const App = () => {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Lecture Video Progress Tracker</h1>
        <VideoPlayer userId="user1" videoId="video1" />
      </div>
    </main>
  );
};

export default App;
