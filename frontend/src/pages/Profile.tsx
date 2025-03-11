import useAuth from '@/hooks/useAuth';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user]);

    if (!user) {
        return null;
    }

    return (
        <div>
            <h1>Profile Page</h1>
            <div>
                <p><strong>Name:</strong> {user.full_name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                {/* Add more user details as needed */}
            </div>
        </div>
    );
};

export default Profile;
