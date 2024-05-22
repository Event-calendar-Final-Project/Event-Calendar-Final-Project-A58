import { getUserContactsList } from "../../services/users.service";
import { useEffect, useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import SearchUser from "../SearchUser/SearchUser";


export default function ContactsList() {

    const { userData } = useContext(AppContext);
    console.log(userData)
    return <SearchUser />
}

