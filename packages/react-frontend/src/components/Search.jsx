import SearchBar from "./searchBar";
import { useState } from "react";

// props.options, props.setSearchResults, props.items
function Search(props) {
  const [searchColumn, setSearchColumn] = useState(
    props.options[0].value
  );

  const handleChange = (event) => {
    setSearchColumn(event.target.value);
  };

  return (
    <div>
      <div>
        <label htmlFor="search-select">
          Choose a search column:
        </label>
        <select
          id="search-select"
          value={searchColumn}
          onChange={handleChange}
        >
          {props.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <SearchBar
        setSearchResults={props.setSearchResults}
        searchColumn={searchColumn}
        items={props.items}
      />
    </div>
  );
}

export default Search;
