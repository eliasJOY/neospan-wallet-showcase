import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import app from "@/firebase/init";

const db = getFirestore(app);
const auth = getAuth(app);
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const fetchUserReceipts = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  const q = query(
    collection(db, "passes"),
    where("passType", "==", "receipt")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
};

const formatReceiptsForContext = (receipts) => {
  return receipts
    .map((r, i) => {
      const itemList = (r.items || [])
        .map(
          (item) => `- ${item.itemName}: ₹${item.itemPrice} x ${item.quantity}`
        )
        .join("\n");

      const date = r.date?.seconds
        ? new Date(r.date.seconds * 1000).toLocaleDateString()
        : "Unknown Date";

        console.log(`Receipt ${i + 1} from ${r.merchantName} on ${date}\nTotal: ₹${
        r.totalAmount
      }\n${itemList}`)

      return `Receipt ${i + 1} from ${r.merchantName} on ${date}\nTotal: ₹${
        r.totalAmount
      }\n${itemList}`;
    })
    .join("\n\n");
};

export const generateChatReplyWithHistory = async (
  userMessage,
  previousMessages
) => {
  const receipts = await fetchUserReceipts();
  console.log(receipts);
  const receiptContext = await formatReceiptsForContext(receipts);

  const chatContext = previousMessages
    .map((m) => `${m.type === "user" ? "User" : "AI"}: ${m.content}`)
    .join("\n");

  console.log("RECIPT");
  console.log(receiptContext);

  const prompt = `
You are a personal finance assistant. Use the user's receipt history and chat history to help.

Receipt Summary:
${receiptContext}

Conversation History:
${chatContext}

User: ${userMessage}
`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }),
    }
  );

  const data = await res.json();
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!reply) throw new Error("No AI response returned.");
  return reply;
};
