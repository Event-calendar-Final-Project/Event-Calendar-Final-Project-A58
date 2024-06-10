import { Link } from 'react-router-dom';

export default function MyContactsList({ myContacts }) {
    return (
        <div class="mx-auto max-w-screen-lg px-4 py-8 sm:px-8">
            <div class="flex items-center justify-between pb-6">
                <div>
                    <h2 class="font-semibold text-gray-700">My Contacts</h2>
                    <span class="text-xs text-gray-500">View and manage your contacts</span>
                </div>

            </div>
            <div class="overflow-y-hidden rounded-lg border">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="bg-blue-600 text-left text-xs font-semibold uppercase tracking-widest text-white">
                                <th class="px-5 py-3">Handle</th>
                                <th class="px-5 py-3">Name</th> 
                                <th class="px-5 py-3">Email</th>
                                <th class="px-5 py-3">Phone</th>
                                <th class="px-5 py-3">Address</th>
                            </tr>
                        </thead>
                        <tbody class="text-gray-500">
                            {myContacts.map((contact) => (
                                <tr key={contact.uid}>
                                    <td class="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                                        <Link to={`/${contact.handle}`} class="font-medium text-blue-600 hover:underline">
                                            {contact.handle}
                                        </Link>
                                    </td>
                                    <td class="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                                        {contact.firstName} {contact.lastName}
                                    </td>
                                    <td class="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                                        {contact.email}
                                    </td>
                                    <td class="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                                        {contact.phone || "N/A"}
                                    </td>
                                    <td class="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                                        {contact.address || "N/A"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div class="flex flex-col items-center border-t bg-white px-5 py-5 sm:flex-row sm:justify-between">
                    <span class="text-xs text-gray-600 sm:text-sm"> Showing 1 to {myContacts.length} of {myContacts.length} Entries </span>
                    <div class="mt-2 inline-flex sm:mt-0">
                        <button class="mr-2 h-12 w-12 rounded-full border text-sm font-semibold text-gray-600 transition duration-150 hover:bg-gray-100">Prev</button>
                        <button class="h-12 w-12 rounded-full border text-sm font-semibold text-gray-600 transition duration-150 hover:bg-gray-100">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
