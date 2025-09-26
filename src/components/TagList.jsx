export const TagList = ({ tags }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Tags</h3>
      
      {tags.length === 0 ? (
        <p className="text-gray-500 text-sm">No tags available</p>
      ) : (
        <div className="space-y-2">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded-md text-sm font-medium"
            >
              {tag.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};