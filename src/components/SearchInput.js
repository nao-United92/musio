import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function SearchInput(props) {
  return (
    <section className="mb-10">
      <div className="relative">
        <input
          onChange={props.onInputChange}
          value={props.value}
          className="bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 text-gray-900 dark:text-white w-full py-3 px-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:shadow-xl transition-shadow duration-200 text-lg pr-10"
          placeholder="探したい曲を入力してください"
        />
        {props.value && (
          <button
            onClick={props.onClearInput}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none text-xl"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}
      </div>
      <div className="mt-4">
        <select
          onChange={(e) => props.onSearchTypeChange(e.target.value)}
          value={props.searchType}
          className="bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 text-gray-900 dark:text-white py-2 px-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:shadow-xl transition-shadow duration-200 mr-2"
        >
          <option value="track">曲名</option>
          <option value="artist">アーティスト名</option>
          <option value="album">アルバム名</option>
        </select>
      </div>
    </section>
  );
}
