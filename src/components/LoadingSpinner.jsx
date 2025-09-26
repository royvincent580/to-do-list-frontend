export const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">{message}</p>
        <p className="text-gray-400 text-sm mt-2">Backend may be starting up (free tier)</p>
      </div>
    </div>
  );
};