export default function Home() {
  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Welcome to Chatbot</h1>
      <p className="text-gray-300 mb-4">
        This is the main content area. Use the sidebar toggle button in the
        topbar to show/hide the sidebar.
      </p>
      <div className="bg-gray-800 p-4 rounded-lg">
        <p className="text-sm text-gray-400">
          The sidebar contains your chat history and can be toggled using the
          sidebar icon in the topbar.
        </p>
      </div>
    </div>
  );
}
