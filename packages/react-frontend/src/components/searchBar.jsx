import { useState, useEffect } from "react";

// Takes props.items, props.searchColumn, props.setSearchResults
function SearchBar(props) {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchTerm.trim() === "") {
        props.setSearchResults(props.items);
      } else {
        const results = props.items.filter((item) =>
          item[props.searchColumn]
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
        props.setSearchResults(results);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchTerm, props]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <form>
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Search"
          />
        </div>
      </form>
    </div>
  );
}

export default SearchBar;
