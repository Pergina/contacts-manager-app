import { useState, useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";

import _ from "lodash";
import { useImmer } from "use-immer";
//Underline or Underscore

import { ContactContext } from "./context/contactContext";
import {
  AddContact,
  ViewContact,
  Contacts,
  EditContact,
  Navbar,
} from "./components";

import {
  getAllContacts,
  getAllGroups,
  createContact,
  deleteContact,
} from "./services/contactService";

import "./App.css";
import 'react-toastify/dist/ReactToastify.css';

import {
  CURRENTLINE,
  FOREGROUND,
  PURPLE,
  YELLOW,
  COMMENT,
} from "./helpers/colors";
import { toast, ToastContainer } from "react-toastify";

const App = () => {
  const [loading, setLoading] = useImmer(false);
  const [contacts, setContacts] = useImmer([]);
  const [filteredContacts, setFilteredContacts] = useImmer([]);
  const [groups, setGroups] = useImmer([]);

  const navigate = useNavigate();

  useEffect(() => {
    // console.log("Contact Manager App 🐧 ");

    const fetchData = async () => {
      try {
        setLoading(true);

        const { data: contactsData } = await getAllContacts();
        const { data: groupsData } = await getAllGroups();

        setContacts(contactsData);
        setFilteredContacts(contactsData);
        setGroups(groupsData);

        setLoading(false);
      } catch (err) {
        console.log(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const createContactForm = async (values) => {
    // event.preventDefault();
    try {
      setLoading(draft=> !draft);


      const { status, data } = await createContact(values);

      if (status === 201) {

        setContacts(draft=> {
          draft.push(data);
        })

        setFilteredContacts(draft=> {draft.push(data)})

        // setContact({});
        // setErrors([]);
        setLoading(false);
        navigate("/contacts");
      }
    } catch (err) {
      console.log(err.message);
      // setErrors(err.inner);
      setLoading(false);
    }
  };

  const confirmDelete = (contactId, contactFullname) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div
            dir="rtl"
            style={{
              backgroundColor: CURRENTLINE,
              border: `1px solid ${PURPLE}`,
              borderRadius: "1em",
            }}
            className="p-4"
          >
            <h1 style={{ color: YELLOW }}>پاک کردن مخاطب</h1>
            <p style={{ color: FOREGROUND }}>
              مطمئنی که میخوای مخاطب {contactFullname} رو پاک کنی ؟
            </p>
            <button
              onClick={() => {
                removeContact(contactId);
                onClose();
              }}
              className="btn mx-2"
              style={{ backgroundColor: PURPLE }}
            >
              مطمئن هستم
            </button>
            <button
              onClick={onClose}
              className="btn"
              style={{ backgroundColor: COMMENT }}
            >
              انصراف
            </button>
          </div>
        );
      },
    });
  };

  const removeContact = async (contactId) => {
    /*
     * NOTE
     * 1- forceRender -> setForceRender
     * 2- Server Request
     * 3- Delete Local State
     * 4- Delete State Before Server Request
     */

    // Contacts Copy
    const allContacts = [...contacts];
    try {

      setContacts(draft=> draft.filter(contact=> contact.id !== contactId))
      setFilteredContacts(draft=> draft.filter(contact=> contact.id !== contactId))

      // Sending delete request to server
      const { status } = await deleteContact(contactId);

      toast.error("Contact is succussfully cleared", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        // transition: Bounce,
      })

      if (status !== 200) {
        setContacts(allContacts);
        setFilteredContacts(allContacts);
      }
    } catch (err) {
      console.log(err.message);

      setContacts(allContacts);
      setFilteredContacts(allContacts);
    }
  };

  // let filterTimeout;
  const contactSearch = _.debounce((query) => {
    // clearTimeout(filterTimeout);

    if (!query) return setFilteredContacts([...contacts]);

    // filterTimeout = setTimeout(() => {
    // setFilteredContacts(
    //   contacts.filter((contact) => {
    //     return contact.fullname.toLowerCase().includes(query.toLowerCase());
    //   })
    // );
    setFilteredContacts(draft=> {
      return draft.filter(c=> {
        return c.fullname.toLowerCase().includes(query.toLowerCase())
      })
    })
    // }, 1000);
  }, 1000);

  return (
    <ContactContext.Provider
      value={{
        loading,
        setLoading,
        setContacts,
        setFilteredContacts,
        contacts,
        filteredContacts,
        groups,
        /* errors, */
        deleteContact: confirmDelete,
        createContact: createContactForm,
        contactSearch,
      }}
    >
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/contacts" />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="contacts/add" element={<AddContact />} />
          <Route path="contacts/:contactId" element={<ViewContact />} />
          <Route path="contacts/edit/:contactId" element={<EditContact />} />
        </Routes>
      <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </ContactContext.Provider>
  );
};

export default App;
