import { useState, useEffect, useContext } from "react";
import { fetchContactLists } from "../../services/users.service";
import { AppContext } from "../../context/AppContext";
import { inviteUser } from "../../services/event.service";
import PropTypes from "prop-types";

export default function InviteContactList({ initialEvent, onUserAdded }) {
  const [contactLists, setContactLists] = useState([]);
  const [selectedListName, setSelectedListName] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const { userData } = useContext(AppContext);
  const [inputKey, setInputKey] = useState(0);

  useEffect(() => {
    fetchContactLists(userData.handle)
      .then((fetchedLists) => {
        console.log("Fetched contact lists:", fetchedLists);
        const listsArray = fetchedLists.reduce((acc, list) => {
          acc[list.users.listName] = list.users.contacts;
          return acc;
        }, []);
        console.log("Lists array:", listsArray);
        setContactLists(listsArray);
      })
      .catch((error) => {
        console.error("Error fetching contact lists:", error);
      });
  }, [userData.handle, initialEvent.id]);
  console.log(contactLists);

  const handleInviteClick = async () => {
    if (!selectedListName) {
      setFeedbackMessage("Please enter a contact list name to invite.");
      return;
    }
    console.log("Selected list name:", selectedListName);
    console.log("Contact list:", contactLists[selectedListName]);
    setFeedbackMessage("Assuming contact list invited successfully!");
    setSelectedListName("");
    setInputKey((prevKey) => prevKey + 1);
    onUserAdded();
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        key={inputKey}
        value={selectedListName}
        onChange={(e) => setSelectedListName(e.target.value)}
        placeholder="Contact list name"
        className="input input-bordered input-xs"
        list="contacts-lists"
      />
      <datalist id="contacts-lists">
        {Object.keys(contactLists).map(
          (listName) => (
            console.log("List name:", listName),
            (<option key={listName} value={listName} />)
          )
        )}
      </datalist>
      <button
        onClick={handleInviteClick}
        className="btn btn-xs btn-outline btn-success"
      >
        Invite Contact List
      </button>
      {feedbackMessage && <p>{feedbackMessage}</p>}
    </div>
  );
}

InviteContactList.propTypes = {
  initialEvent: PropTypes.object,
  onUserAdded: PropTypes.func,
};
