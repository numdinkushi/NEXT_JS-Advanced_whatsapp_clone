import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { GET_INITIAL_CONTACTS_ROUTE } from "@/utils/ApiRoutes";
import React, { useEffect } from "react";
import ChatLIstItem from "./ChatLIstItem";
import axios from "axios";

function List() {
	const [{ userInfo, userContacts }, dispatch] = useStateProvider();

  console.log(111, userContacts);

	useEffect(() => {
		const getContacts = async () => {
			try {
				const {
					data: { users, onlineUsers },
				} = await axios(`${GET_INITIAL_CONTACTS_ROUTE}/${userInfo.id}}`);
        console.log(222, users)
				dispatch({ type: reducerCases.SET_ONLINE_USERS, onlineUsers });
				dispatch({ type: reducerCases.SET_USER_CONTACTS, userContacts:users });
			} catch (error) {
        console.log(333, error)
      }
		};

		if(userInfo?.id) getContacts();
	}, [userInfo]);

	return (
		<div className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar">
			{userContacts.map((contact) => (
				<ChatLIstItem data={contact} key={contact.id} />
			))}
		</div>
	);
}

export default List;
