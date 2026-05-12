import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile as firebaseUpdateProfile
} from 'firebase/auth';
import { initializeFirestore, doc, getDocFromServer, terminate, clearIndexedDbPersistence } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Use initializeFirestore with settings to enable long polling
// This is often required in restrictive environments where WebSockets might be blocked
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId);

export const googleProvider = new GoogleAuthProvider();

// --- Auth Exports ---
export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
export const loginWithEmail = (email: string, pass: string) => signInWithEmailAndPassword(auth, email, pass);
export const registerWithEmail = (email: string, pass: string) => createUserWithEmailAndPassword(auth, email, pass);
export { firebaseUpdateProfile };
export const logout = () => signOut(auth);

// --- Firestore Error Handler (Global) ---
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test as per critical constraint
// Added retry logic and more descriptive logging
async function testConnection(retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      // Use shorter timeout for individual attempts
      await getDocFromServer(doc(db, 'test', 'connection'));
      console.log("Firestore connection successful");
      return;
    } catch (error) {
      console.warn(`Firestore connection attempt ${i + 1} failed:`, error);
      if (i === retries - 1) {
        if (error instanceof Error && (error.message.includes('the client is offline') || error.message.includes('deadline-exceeded'))) {
          console.error("Critical: Could not connect to Firestore. If this persists, the database may still be provisioning or network is blocked.");
        }
      }
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}
testConnection();
