import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'; // Assuming you're using 'react-icons'

import './App.css';

function App() {
        const [links, setLinks] = useState([]);
        const [editing, setEditing] = useState(null); // To keep track of the link being edited
        const [editingLink, setEditingLink] = useState(null);
        const [activeTab, setActiveTab] = useState("Hyppigt Besøgte");
        const [formData, setFormData] = useState({
                title: '',
                link: '',
                color: '#FFFFFF',
                category: ''
        });

        useEffect(() => {
                fetchLinks();
        }, []);


        const resetForm = () => {
                setFormData({
                        title: "",
                        link: "",
                        color: "#ffffff",
                        category: ""
                });
        };



        function groupLinksByCategory(links) {
                return links.reduce((acc, link) => {
                        if (!acc[link.category]) {
                                acc[link.category] = [];
                        }
                        acc[link.category].push(link);
                        return acc;
                }, {});
        }


        const fetchLinks = () => {
                axios.get('http://localhost:3001/links')
                        .then(response => {
                                setLinks(response.data);
                        })
                        .catch(error => {
                                console.error('Error fetching data:', error);
                        });
        };

        const handleInputChange = (event) => {
                const { name, value } = event.target;
                setFormData(prevState => ({
                        ...prevState,
                        [name]: value
                }));
        };

        const handleDelete = (id) => {
                axios.delete(`http://localhost:3001/links/${id}`)
                        .then(response => {
                                fetchLinks(); // Refresh the links after deletion
                        })
                        .catch(error => {
                                console.error('Error deleting link:', error);
                        });
        };


        const handleSubmit = (event) => {
                event.preventDefault();

                if (editing) {
                        // Update the existing link
                        axios.put(`http://localhost:3001/links/${editing}`, formData)
                                .then(response => {
                                        fetchLinks();
                                        setFormData({ title: '', link: '', color: '#FFFFFF', category: '' });
                                        setEditing(null);  // Exit the editing mode
                                })
                                .catch(error => {
                                        console.error('Error updating link:', error);
                                });
                } else {
                        // Add a new link (existing code)
                        axios.post('http://localhost:3001/links', formData)
                                .then(response => {
                                        fetchLinks();
                                        setFormData({ title: '', link: '', color: '#FFFFFF', category: '' });
                                })
                                .catch(error => {
                                        console.error('Error adding link:', error);
                                });
                }
        };


        const handleEdit = (link) => {
                // If the link being edited is clicked again, reset and stop editing.
                if (editingLink && editingLink.id === link.id) {
                        setEditingLink(null);
                        resetForm();  // assuming you have a function to reset the form to its initial state
                } else {
                        // Begin the editing process for the clicked link
                        setFormData(link); // assuming you have this line to populate the form with the link's data
                        setEditingLink(link);
                }
        };


        const categorizedLinks = groupLinksByCategory(links);
        const categories = Object.keys(categorizedLinks);
        return (
                <div className="App bg-gray-100 min-h-screen p-0 m-0">



                        <div className="h-[35vh] w-full bg-cover bg-center relative" style={{ backgroundImage: 'url(https://images4.alphacoders.com/601/thumb-1920-601048.jpg)' }}>
                                <h1 className="text-4xl text-white font-bold absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">Google</h1>
                                <form action="http://www.google.com/search" method="get" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                        <input className="p-2 rounded-md" type="text" name="q" placeholder="Google Search" />
                                </form>
                        </div>



                        {/* Tabs Container */}
                        < div className="border-t border-gray-300" >


                                {/* Tabs */}
                                < div className="flex justify-center border-b border-gray-200" >
                                        {
                                                categories.map(category => (
                                                        <button
                                                                key={category}
                                                                onClick={() => setActiveTab(category)}
                                                                className={`py-2 px-4 rounded-none hover:bg-gray-100 focus:outline-none ${activeTab === category ? 'border-b-2 border-blue-600' : ''}`}
                                                        >
                                                                {category || "Uncategorized"}
                                                        </button>
                                                ))
                                        }
                                </div >

                        </div >





                        <div className="grid grid-cols-5 gap-4 m-10">
                                {activeTab && categorizedLinks[activeTab] && categorizedLinks[activeTab].map(link => (
                                        <div key={link.id} className="relative group p-6 bg-blue-100 hover:bg-blue-200 rounded-lg transition duration-300 ease-in-out">
                                                <a href={link.link} className="block w-full h-full absolute top-0 left-0 z-0 flex items-center justify-center text-lg font-semibold text-white rounded-lg" style={{ backgroundColor: link.color }}>
                                                        {link.title}
                                                </a>
                                                <div className="absolute top-2 right-2 z-10 hidden group-hover:flex">
                                                        <button
                                                                onClick={(e) => { e.stopPropagation(); handleEdit(link); console.log(links); }}
                                                                className="p-2 bg-gray-300 hover:bg-gray-400 text-white rounded-full transition duration-300 ease-in-out shadow-md"
                                                        >
                                                                <FaEdit className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                                onClick={(e) => { e.stopPropagation(); handleDelete(link.id); }}
                                                                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full ml-2 transition duration-300 ease-in-out shadow-md"
                                                        >
                                                                <FaTrash className="w-5 h-5" />
                                                        </button>
                                                </div>
                                        </div>
                                ))}
                        </div>


                        <div className="flex justify-center mt-10">
                                <div className="flex p-4  space-x-2">
                                        <div style={{ backgroundColor: "#EF476F" }} className="w-16 h-16 rounded-md flex items-center justify-center">
                                                <span className="text-white font-bold">EF476F</span>
                                        </div>
                                        <div style={{ backgroundColor: "#FFCAD4" }} className="w-16 h-16 rounded-md flex items-center justify-center">
                                                <span className="text-white font-bold">FFCAD4</span>
                                        </div>
                                        <div style={{ backgroundColor: "#FFD166" }} className="w-16 h-16 rounded-md flex items-center justify-center">
                                                <span className="text-white font-bold">FFD166</span>
                                        </div>
                                        <div style={{ backgroundColor: "#FF9F1C" }} className="w-16 h-16 rounded-md flex items-center justify-center">
                                                <span className="text-white font-bold">FF9F1C</span>
                                        </div>
                                        <div style={{ backgroundColor: "#06D6A0" }} className="w-16 h-16 rounded-md flex items-center justify-center">
                                                <span className="text-white font-bold">06D6A0</span>
                                        </div>
                                        <div style={{ backgroundColor: "#8AC4D0" }} className="w-16 h-16 rounded-md flex items-center justify-center">
                                                <span className="text-white font-bold">8AC4D0</span>
                                        </div>
                                        <div style={{ backgroundColor: "#118AB2" }} className="w-16 h-16 rounded-md flex items-center justify-center">
                                                <span className="text-white font-bold">118AB2</span>
                                        </div>
                                        <div style={{ backgroundColor: "#26547C" }} className="w-16 h-16 rounded-md flex items-center justify-center">
                                                <span className="text-white font-bold">26547C</span>
                                        </div>
                                        <div style={{ backgroundColor: "#073B4C" }} className="w-16 h-16 rounded-md flex items-center justify-center">
                                                <span className="text-white font-bold">073B4C</span>
                                        </div>
                                </div>
                        </div>
                        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md sticky-form">
                                <input
                                        className="border p-2 mr-2 rounded w-1/4"
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Title"
                                        required
                                />
                                <input
                                        className="border p-2 mr-2 rounded w-1/4"
                                        type="url"
                                        name="link"
                                        value={formData.link}
                                        onChange={handleInputChange}
                                        placeholder="Link"
                                        required
                                />
                                <input
                                        className="border p-2 mr-2 rounded w-16"
                                        type="color"
                                        name="color"
                                        value={formData.color}
                                        onChange={handleInputChange}
                                />
                                <input
                                        className="border p-2 mr-2 rounded w-1/4"
                                        type="text"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        placeholder="Category"
                                />
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                                        Add Link
                                </button>
                        </form>

                </div >
        );
}

export default App;

