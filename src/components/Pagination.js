export function Pagination(props) {
  return (
    <div className="mt-8 flex justify-center">
      <button
        onClick={props.onPrev}
        disabled={props.onPrev == null}
        className="bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transform transition-transform duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <button
        onClick={props.onNext}
        disabled={props.onNext == null}
        className="bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transform transition-transform duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ml-4"
      >
        Next
      </button>
    </div>
  );
}
