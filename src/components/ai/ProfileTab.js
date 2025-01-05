


// 'use client';
// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import { Camera, Mail, User, Calendar, Shield, Edit2 } from 'lucide-react';
// import Image from 'next/image';
// import { useAuth } from '@/contexts/AuthContext';

// const ProfileTab = ({ isDarkMode }) => {
//   const { user } = useAuth();
//   const [isEditing, setIsEditing] = useState(false);

//   // Default profile image if user doesn't have one
//   const profileImage = user?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user?.email;

//   const formatDate = (date) => {
//     return new Intl.DateTimeFormat('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     }).format(date);
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 50 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.8 }}
//       className="max-w-4xl mx-auto p-4 pb-20"
//     >
//       {/* Profile Header */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg mb-6`}
//       >
//         <div className="flex items-center">
//           <div className="relative">
//             <Image
//               src={profileImage}
//               alt="Profile"
//               width={80}
//               height={80}
//               className="rounded-full border-4 border-blue-500"
//             />
//             <button
//               className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition duration-300"
//             >
//               <Camera size={20} />
//             </button>
//           </div>
//           <div className="ml-6 flex-1">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h2 className="text-2xl font-bold flex items-center gap-2">
//                   {user?.displayName || 'Guest User'}
//                   {user?.isAnonymous && (
//                     <span className="text-sm bg-yellow-500 text-black px-2 py-1 rounded-full">Guest</span>
//                   )}
//                 </h2>
//                 <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center gap-2`}>
//                   <Mail className="w-4 h-4" />
//                   {user?.email || 'No email provided'}
//                 </p>
//               </div>
//               <button
//                 onClick={() => setIsEditing(!isEditing)}
//                 className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
//               >
//                 <Edit2 className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </motion.div>

//       {/* Profile Details */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, delay: 0.2 }}
//         className="grid grid-cols-1 md:grid-cols-2 gap-6"
//       >
//         {/* Account Info */}
//         <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
//           <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
//             <User className="w-5 h-5" />
//             Account Information
//           </h3>
//           <div className="space-y-4">
//             <div>
//               <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>User ID</p>
//               <p className="font-medium">{user?.uid || 'Not available'}</p>
//             </div>
//             <div>
//               <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Account Type</p>
//               <p className="font-medium">{user?.isAnonymous ? 'Guest Account' : 'Registered User'}</p>
//             </div>
//             <div>
//               <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email Verification</p>
//               <p className={`font-medium flex items-center gap-2 ${user?.emailVerified ? 'text-green-500' : 'text-yellow-500'}`}>
//                 <Shield className="w-4 h-4" />
//                 {user?.emailVerified ? 'Verified' : 'Not Verified'}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Activity Stats */}
//         <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
//           <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
//             <Calendar className="w-5 h-5" />
//             Activity Statistics
//           </h3>
//           <div className="grid grid-cols-2 gap-4">
//             <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg text-center`}>
//               <p className="font-bold text-2xl text-blue-500">0</p>
//               <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Total Chats</p>
//             </div>
//             <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg text-center`}>
//               <p className="font-bold text-2xl text-green-500">0</p>
//               <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Completed Tasks</p>
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default ProfileTab;

'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Mail, User, Calendar, Shield, Edit2, Save, X } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { updateProfile } from 'firebase/auth';
import { auth } from '@/config/firebase';
import toast from 'react-hot-toast';

const ProfileTab = ({ isDarkMode }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(user?.displayName || '');
  const [isUpdating, setIsUpdating] = useState(false);

  // Default profile image if user doesn't have one
  const profileImage = user?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user?.email;

  const handleUpdateProfile = async () => {
    if (!newDisplayName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    try {
      setIsUpdating(true);
      const currentUser = auth.currentUser;
      
      if (currentUser) {
        await updateProfile(currentUser, {
          displayName: newDisplayName
        });
        
        // Force refresh the page to update the UI with new profile data
        window.location.reload();
        
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg mb-6`}
      >
        <div className="flex items-center">
          <div className="relative">
            <Image
              src={profileImage}
              alt="Profile"
              width={80}
              height={80}
              className="rounded-full border-4 border-blue-500"
            />
            <button
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition duration-300"
            >
              <Camera size={20} />
            </button>
          </div>
          <div className="ml-6 flex-1">
            <div className="flex items-center justify-between">
              <div>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newDisplayName}
                      onChange={(e) => setNewDisplayName(e.target.value)}
                      className={`text-xl font-bold bg-transparent border-b-2 border-blue-500 focus:outline-none ${
                        isDarkMode ? 'text-white' : 'text-black'
                      }`}
                      placeholder="Enter your name"
                    />
                    <button
                      onClick={handleUpdateProfile}
                      disabled={isUpdating}
                      className="p-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {isUpdating ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Updating...
                        </span>
                      ) : (
                        <Save className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setNewDisplayName(user?.displayName || '');
                      }}
                      className="p-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    {user?.displayName || 'Guest User'}
                    {user?.isAnonymous && (
                      <span className="text-sm bg-yellow-500 text-black px-2 py-1 rounded-full">Guest</span>
                    )}
                  </h2>
                )}
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center gap-2`}>
                  <Mail className="w-4 h-4" />
                  {user?.email || 'No email provided'}
                </p>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Profile Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Account Info */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Account Information
          </h3>
          <div className="space-y-4">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>User ID</p>
              <p className="font-medium">{user?.uid || 'Not available'}</p>
            </div>
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Account Type</p>
              <p className="font-medium">{user?.isAnonymous ? 'Guest Account' : 'Registered User'}</p>
            </div>
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email Verification</p>
              <p className={`font-medium flex items-center gap-2 ${user?.emailVerified ? 'text-green-500' : 'text-yellow-500'}`}>
                <Shield className="w-4 h-4" />
                {user?.emailVerified ? 'Verified' : 'Not Verified'}
              </p>
            </div>
          </div>
        </div>

        {/* Activity Stats */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Activity Statistics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg text-center`}>
              <p className="font-bold text-2xl text-blue-500">0</p>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Total Chats</p>
            </div>
            <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg text-center`}>
              <p className="font-bold text-2xl text-green-500">0</p>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Completed Tasks</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileTab;