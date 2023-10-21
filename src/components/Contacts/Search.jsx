import { ContactContext } from "../../context/contactContext";
import { useContext } from "react";
const Search = () => {
  const {searchContact} = useContext(ContactContext);
  return(
    <div>
        <input
          type={"text"}
          onChange={searchContact}
        />
        <span>Search</span>
    </div>
  )
}
export default Search;