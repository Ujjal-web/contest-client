import { createContext, useEffect, useState } from "react";
import {
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile
} from "firebase/auth";
import { app } from "../firebase/firebase.config";
import useAxiosPublic from "../hooks/useAxiosPublic";

export const AuthContext = createContext(null);
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const googleProvider = new GoogleAuthProvider();
    const axiosPublic = useAxiosPublic();

    // 1. Create User (Email/Password)
    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    // 2. Login User (Email/Password)
    const signIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    // 3. Google Sign In
    const googleSignIn = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    };

    // 4. Logout
    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    };

    // 5. Update Profile (Name & Photo)
    const updateUserProfile = (name, photo) => {
        return updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: photo
        });
    };

    // 6. Monitor Auth State & Handle JWT
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                try {
                    // 1) Get JWT
                    const userInfoForJwt = { email: currentUser.email };
                    const jwtRes = await axiosPublic.post("/jwt", userInfoForJwt);

                    if (jwtRes.data.token) {
                        localStorage.setItem("access-token", jwtRes.data.token);
                    }

                    // 2) Ensure user exists in MongoDB
                    const userForDb = {
                        name: currentUser.displayName || "User",
                        email: currentUser.email,
                        photoURL: currentUser.photoURL || "",
                        role: "user",
                    };

                    await axiosPublic.post("/users", userForDb);
                } catch (error) {
                    console.error("Auth state sync error:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                // User logged out
                localStorage.removeItem("access-token");
                setLoading(false);
            }
        });

        return () => {
            unsubscribe();
        };
    }, [axiosPublic]);

    const authInfo = {
        user,
        loading,
        createUser,
        signIn,
        googleSignIn,
        logOut,
        updateUserProfile
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;