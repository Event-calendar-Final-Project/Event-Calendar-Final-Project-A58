import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import SearchUser from "../components/SearchUser/SearchUser";


export default function ContactsList() {

    const { userData } = useContext(AppContext);
    console.log(userData)
    return <SearchUser />
}

