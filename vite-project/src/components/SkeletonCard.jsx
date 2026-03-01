// SkeletonCard.jsx — drop this in your components/ folder

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-5 flex items-center justify-between gap-4 shadow-sm animate-pulse">
    <div className="flex items-center gap-3 md:gap-4 flex-1">
      {/* Blood group box */}
      <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-xl shrink-0" />
      <div className="space-y-2 flex-1">
        <div className="h-3 bg-gray-100 rounded-full w-1/3" />
        <div className="h-2 bg-gray-100 rounded-full w-1/2" />
        <div className="h-2 bg-gray-100 rounded-full w-1/4" />
      </div>
    </div>
    {/* Badge/button placeholder */}
    <div className="w-16 h-7 bg-gray-100 rounded-full shrink-0" />
  </div>
);

export const SkeletonList = ({ count = 4 }) => (
  <div className="space-y-3 md:space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default SkeletonCard;