import { useState } from "react";
import SearchBar from "./SearchBar";

// Props:
// options
// items
// setSearchResults

function Search(props) {
  const [searchColumn, setSearchColumn] = useState(props.options[0].value);
  const [sortColumn, setSortColumn] = useState(props.options[0].value);
  const [sortDirection, setSortDirection] = useState("asc");

  const selectedSortOption = props.options.find(
    (opt) => opt.value === sortColumn
  );

  return (
    <div>
      {/* Search Column Selector */}
      <div>
        <label>Quick search by:</label>
        <select
          value={searchColumn}
          onChange={(e) => setSearchColumn(e.target.value)}
        >
          {props.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <SearchBar
        items={props.items}
        searchColumn={searchColumn}
        sortColumn={sortColumn}
        sortType={selectedSortOption?.type}
        sortDirection={sortDirection}
        setSearchResults={props.setSearchResults}
      />

      {/* Sort Column Selector */}
      <div>
        <label>Sort by:</label>
        <select
          value={sortColumn}
          onChange={(e) => setSortColumn(e.target.value)}
        >
          {props.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

    </div>
  );
}

export default Search;