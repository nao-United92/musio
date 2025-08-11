import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function SearchInput(props) {
  return (
    <section className="mb-10">
      <div className="relative">
        <input
          onChange={props.onInputChange}
          value={props.value}
          className="bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white w-full py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg pr-10"
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
          className="bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="track">曲名</option>
          <option value="artist">アーティスト名</option>
          <option value="album">アルバム名</option>
        </select>
      </div>
    </section>
  );
}
