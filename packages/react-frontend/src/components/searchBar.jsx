import { useState, useEffect } from "react";

// Props:
// items
// searchColumn
// sortColumn
// sortType ("string" | "number" | "date")
// sortDirection ("asc" | "desc")
// setSearchResults

function SearchBar(props) {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      let results = [...props.items]; // avoid mutating props

      // FILTER
      if (searchTerm.trim() !== "") {
        results = results.filter((item) => {
          const value = item[props.searchColumn];

          if (value === null || value === undefined) return false;

          return String(value)
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        });
      }

      if (props.sortColumn) {
        results.sort((a, b) => {
          let valA = a[props.sortColumn];
          let valB = b[props.sortColumn];

          if (props.sortType === "number") {
            valA = Number(valA);
            valB = Number(valB);
          }

          if (props.sortType === "date") {
            valA = new Date(valA).getTime();
            valB = new Date(valB).getTime();
          }

          if (props.sortType === "string") {
            valA = String(valA).toLowerCase();
            valB = String(valB).toLowerCase();
          }

          if (valA < valB) return props.sortDirection === "asc" ? -1 : 1;
          if (valA > valB) return props.sortDirection === "asc" ? 1 : -1;
          return 0;
        });
      }

      props.setSearchResults(results);
    }, 300);

    return () => clearTimeout(timeout);
  }, [
    props, searchTerm
  ]);

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search"
      />
    </div>
  );
}

export default SearchBar;