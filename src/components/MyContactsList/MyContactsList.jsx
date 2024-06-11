import { Link } from 'react-router-dom';
import Pagination from '../Pagination/Pagination';
import { useState } from 'react';



export default function MyContactsList({ myContacts }) {

    const [currentPageContacts, setCurrentPageContacts] = useState(1);
    const itemsPerPage = 6;

    const paginateContacts = (pageNumber) => setCurrentPageContacts(pageNumber);
    const indexOfLastContact = currentPageContacts * itemsPerPage;
    const indexOfFirstContact = indexOfLastContact - itemsPerPage;
    const currentContacts = myContacts.slice(indexOfFirstContact, indexOfLastContact);
    return (
        <div className="mx-auto max-w-screen-lg px-4 py-8 sm:px-8">
            <div className="flex items-center justify-between pb-6">
                <div>
                    <h2 className="font-semibold text-gray-700">My Contacts</h2>
                    <span className="text-xs text-gray-500">View and manage your contacts</span>
                </div>

            </div>
            <div className="overflow-y-hidden rounded-lg border">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-blue-600 text-left text-xs font-semibold uppercase tracking-widest text-white">
                                <th className="px-5 py-3">Handle</th>
                                <th className="px-5 py-3">Name</th> 
                                <th className="px-5 py-3">Email</th>
                                <th className="px-5 py-3">Phone</th>
                                <th className="px-5 py-3">Address</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-500">
                            {currentContacts.map((contact) => (
                                <tr key={contact.uid}>
                                    <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                                        <Link to={`/${contact.handle}`} class="font-medium text-blue-600 hover:underline">
                                            {contact.handle}
                                        </Link>
                                    </td>
                                    <td className="border-b border-gray-200 bg-white font-bold px-5 py-5 text-sm">
                                        {contact.firstName} {contact.lastName}
                                    </td>
                                    <td className="border-b border-gray-200 bg-white font-bold px-5 py-5 text-sm">
                                        {contact.email}
                                    </td>
                                    <td className="border-b border-gray-200 bg-white font-bold px-5 py-5 text-sm">
                                        {contact.phone || "N/A"}
                                    </td>
                                    <td className="border-b border-gray-200 bg-white font-bold px-5 py-5 text-sm">
                                        {contact.address || "N/A"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination
                            itemsPerPage={itemsPerPage}
                            totalItems={myContacts.length}
                            paginate={paginateContacts}
                            currentPage={currentPageContacts}
                        />
            </div>
        </div>
    );
}
