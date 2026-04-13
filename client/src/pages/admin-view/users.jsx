import React, {Fragment, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {createUser, deleteUser, fetchAllUsers, updateUser} from "../../store/admin/users-slice";
import "./users.css";
import {Button} from "@/components/ui/button.jsx";
import {Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {FaArrowLeft, FaArrowRight, FaEdit, FaPlus, FaTrash} from "react-icons/fa";

function AdminFeatures() {
    const dispatch = useDispatch();
    const {isLoading, userList} = useSelector((state) => state.adminUsers);
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const [editingUser, setEditingUser] = useState(null);
    const [openCreateUserDialog, setOpenCreateUserDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [showUserDialog, setShowUserDialog] = useState(false);
    const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
    useEffect(() => {
        dispatch(fetchAllUsers());
    }, [dispatch]);
    const handleCreateUser = (e) => {
        e.preventDefault();
        const newUser = {userName, email, password, role};
        dispatch(createUser(newUser));
        closeUserForm();
    };
    const closeUserForm = () => {
        setOpenCreateUserDialog(false);
        setEditingUser(null);
        setUserName("");
        setEmail("");
        setPassword("");
        setRole("user");
    };
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = userList.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(userList.length / usersPerPage);
    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    }
    const goToPreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };
    const handleUserClick = (user) => {
        setSelectedUser(user);
        setUserName(user.userName);
        setEmail(user.email);
        setRole(user.role);
        setIsEditMode(false);
        setShowUserDialog(true);
    };
    const handleUpdateUser = () => {
        if (selectedUser) {
            const updatedUser = {userName, email, role};
            dispatch(updateUser({id: selectedUser._id, userData: updatedUser}));
            setShowUserDialog(false);
            setSelectedUser(null);
        }
    };
    const handleDeleteUser = () => {
        if (selectedUser) {
            setShowDeleteConfirmDialog(true);
        }
    };
    const confirmDeleteUser = () => {
        if (selectedUser) {
            dispatch(deleteUser(selectedUser._id));
            setShowUserDialog(false);
            setShowDeleteConfirmDialog(false);
            setSelectedUser(null);
        }
    };
    const hasChanges = () => {
        if (!selectedUser) return false;
        return (
            selectedUser.userName !== userName ||
            selectedUser.email !== email ||
            selectedUser.role !== role
        );
    };

    const isSaveButtonDisabled = !hasChanges();

    return (
        <Fragment>
            <div>
                <Button style={{backgroundColor: '#1E90FF', color: '#ffffff'}}
                        onClick={() => setOpenCreateUserDialog(true)}>
                    <FaPlus className="mr-2"/>
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
                        </tr>
                        </thead>
                        <tbody>
                        {currentUsers.map((user) => (
                            <tr key={user._id} onClick={() => handleUserClick(user)} className="cursor-pointer">
                                <td>{user.userName}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div className="pagination-controls">
                        <button onClick={goToPreviousPage} disabled={currentPage === 1}>
                            <FaArrowLeft className="text-lg"/>
                        </button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button onClick={goToNextPage} disabled={currentPage === totalPages}>
                            <FaArrowRight className="text-lg"/>
                        </button>
                    </div>
                </>
            )}

            <Dialog open={showUserDialog} onOpenChange={() => setShowUserDialog(false)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>User Details</DialogTitle>
                    </DialogHeader>
                    <div className="mb-4">
                        <label>User Name:</label>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => {
                                setUserName(e.target.value);
                                setIsEditMode(true);
                            }}
                            className="admin-input"
                        />
                    </div>
                    <div className="mb-4">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setIsEditMode(true);
                            }}
                            className="admin-input"
                        />
                    </div>
                    <div className="mb-4">
                        <label>Role:</label>
                        <select
                            value={role}
                            onChange={(e) => {
                                setRole(e.target.value);
                                setIsEditMode(true);
                            }}
                            className="admin-input"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setShowUserDialog(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteUser}>
                            <FaTrash className="mr-2"/>
                            Delete
                        </Button>
                        <Button onClick={handleUpdateUser} disabled={isSaveButtonDisabled}>
                            <FaEdit className="mr-2"/> Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Sheet open={openCreateUserDialog} onOpenChange={closeUserForm}>
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
            <Dialog open={showDeleteConfirmDialog} onOpenChange={() => setShowDeleteConfirmDialog(false)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete this user?</p>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setShowDeleteConfirmDialog(false)}>
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
