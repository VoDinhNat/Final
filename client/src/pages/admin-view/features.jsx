import React, {Fragment, useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers, createUser, updateUser, deleteUser } from "../../store/admin/users-slice";
import "./features.css";
import { Button } from "@/components/ui/button.jsx";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";



function AdminFeatures() {
    const dispatch = useDispatch();
    const { isLoading, userList } = useSelector((state) => state.adminUsers);

    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const [editingUser, setEditingUser] = useState(null);

    // State for managing the sheet's open/close status
    const [openCreateUserDialog, setOpenCreateUserDialog] = useState(false);

    // State for delete confirmation dialog
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    useEffect(() => {
        dispatch(fetchAllUsers());
    }, [dispatch]);

    const handleCreateUser = (e) => {
        e.preventDefault();
        const newUser = { userName, email, password, role };
        dispatch(createUser(newUser));
        closeUserForm();
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setUserName(user.userName);
        setEmail(user.email);
        setRole(user.role);
        setOpenCreateUserDialog(true); // Open sheet in edit mode
    };

    const handleUpdateUser = (e) => {
        e.preventDefault();
        if (editingUser) {
            const updatedUser = { userName, email, role };
            dispatch(updateUser({ id: editingUser._id, userData: updatedUser }));
            closeUserForm();
        }
    };

    const handleDeleteUser = (id) => {
        setUserToDelete(id);  // Set the user to delete
        setShowDeleteDialog(true);  // Show the confirmation dialog
    };

    const confirmDeleteUser = () => {
        dispatch(deleteUser(userToDelete));
        setShowDeleteDialog(false);
        setUserToDelete(null); // Clear userToDelete after deleting
    };

    const closeUserForm = () => {
        setOpenCreateUserDialog(false);
        setEditingUser(null);
        setUserName("");
        setEmail("");
        setPassword("");
        setRole("user");
    };

    // Calculate the users to display on the current page
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = userList.slice(indexOfFirstUser, indexOfLastUser);

    // Pagination controls
    const totalPages = Math.ceil(userList.length / usersPerPage);

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <Fragment>
            <div className="mb-5 w-full flex justify-end">
                <Button onClick={() => setOpenCreateUserDialog(true)}>
                    Add New User
                </Button>
            </div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <table className="admin-table">
                        <thead>
                        <tr>
                            <th>User Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentUsers.map((user) => (
                            <tr key={user._id}>
                                <td>{user.userName}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td class="actions">
                                    <button className="admin-btn admin-btn-edit"
                                            onClick={() => handleEditUser(user)}>Edit
                                    </button>
                                    <button className="admin-btn admin-btn-delete"
                                            onClick={() => handleDeleteUser(user._id)}>Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div className="pagination-controls">
                        <button onClick={goToPreviousPage} disabled={currentPage === 1}>Previous</button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button onClick={goToNextPage} disabled={currentPage === totalPages}>Next</button>
                    </div>
                </>
            )}

            <Sheet
                open={openCreateUserDialog}
                onOpenChange={closeUserForm}
            >
                <SheetContent side="right" className="overflow-auto">
                    <SheetHeader>
                        <SheetTitle>{editingUser ? "Edit User" : "Add New User"}</SheetTitle>
                    </SheetHeader>
                    <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser} className="p-6">
                        <div className="mb-4">
                            <label>User Name:</label>
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                required
                                className="admin-input"
                            />
                        </div>
                        <div className="mb-4">
                            <label>Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="admin-input"
                            />
                        </div>
                        {!editingUser && (
                            <div className="mb-4">
                                <label>Password:</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="admin-input"
                                />
                            </div>
                        )}
                        <div className="mb-4">
                            <label>Role:</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="admin-input"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <Button type="submit" className="w-full">
                            {editingUser ? "Update User" : "Add User"}
                        </Button>
                    </form>
                </SheetContent>
            </Sheet>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={() => setShowDeleteDialog(false)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete this user?</p>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setShowDeleteDialog(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDeleteUser}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Fragment>
    );
}

export default AdminFeatures;
