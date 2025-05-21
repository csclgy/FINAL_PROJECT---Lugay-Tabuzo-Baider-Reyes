import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserProfile = () => {
  const { user, authToken, updateUser } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    contactNumber: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        department: user.department || '',
        contactNumber: user.contactNumber || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      const updateData = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        contactNumber: profileData.contactNumber
      };
      
      if (profileData.currentPassword && profileData.newPassword) {
        updateData.currentPassword = profileData.currentPassword;
        updateData.newPassword = profileData.newPassword;
      }
      
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }
      
      const updatedUser = await response.json();
      
      updateUser({
        ...user,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        contactNumber: updatedUser.contactNumber
      });
      
      setProfileData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      setSuccess('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'An error occurred while updating your profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-gray-500">Loading user information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">User Profile</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Edit Profile
          </button>
        )}
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      {editing ? (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={profileData.firstName}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={profileData.lastName}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight bg-gray-100"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="department">
                Department
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={profileData.department}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight bg-gray-100"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Department is assigned by administrators</p>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contactNumber">
                Contact Number
              </label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                value={profileData.contactNumber}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
          
          <h3 className="font-semibold mt-8 mb-4">Change Password</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="currentPassword">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={profileData.currentPassword}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <p className="text-xs text-gray-500 mt-1">Leave blank if you don't want to change password</p>
            </div>
            
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={profileData.newPassword}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={profileData.confirmPassword}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-end mt-8">
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setError('');
                if (user) {
                  setProfileData({
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    email: user.email || '',
                    department: user.department || '',
                    contactNumber: user.contactNumber || '',
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                }
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-4 focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600">First Name</p>
            <p className="font-medium">{user.firstName || 'Not set'}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Last Name</p>
            <p className="font-medium">{user.lastName || 'Not set'}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Role</p>
            <p className="font-medium">{user.role}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Department</p>
            <p className="font-medium">{user.department || 'Not assigned'}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Contact Number</p>
            <p className="font-medium">{user.contactNumber || 'Not set'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;