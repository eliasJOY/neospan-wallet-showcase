import { getFirestore, collection, addDoc, Timestamp, serverTimestamp, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import app from "@/firebase/init";

const db = getFirestore(app);
const auth = getAuth(app);

const transformData = (data, user) => {
  const sanitizedItems = (data.items || []).map(item => ({
    itemName: item.itemName || "Unknown Item",
    itemPrice: item.itemPrice ?? 0,
    quantity: item.quantity ?? 1,
  }));

  const parsedDate = data.date && !isNaN(new Date(data.date).getTime())
    ? Timestamp.fromDate(new Date(data.date))
    : serverTimestamp();

  return {
    passType: data.passType || "receipt",
    merchantName: data.merchantName || "Unknown Merchant",
    date: parsedDate,
    totalAmount: data.totalAmount ?? 0,
    category: data.category ?? null,
    taxAmount: data.taxAmount ?? 0,
    priority: data.priority ?? false,
    isAWarrantyCard: data.isAWarrantyCard ?? false,
    items: sanitizedItems,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    userId: user ? user.uid : null
  };
};

const insertData = async (collectionName, data) => {
  try {
    const user = auth.currentUser;
    const transformedData = transformData(data, user);

    await addDoc(collection(db, collectionName), transformedData);
    console.log("Document successfully written.");
  } catch (error) {
    console.error("Error writing document:", error);
  }
};

export const getAllReciepts = async () => {
    try {
        const user = auth.currentUser;
        if (!user) {
        throw new Error("User not authenticated");
        }
    
        const querySnapshot = await getDocs(collection(db, "passes"));
        const receipts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        }));
    
        return receipts.filter(receipt => receipt.userId === user.uid);
    } catch (error) {
        console.error("Error fetching receipts:", error);
        return [];
    }
}

export default insertData;
