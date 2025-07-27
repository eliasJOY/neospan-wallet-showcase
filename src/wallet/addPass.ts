// src/components/WalletPassGenerator.jsx
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { google } from 'googleapis';

export const generateWalletPass = async (formData) => {
  try {
    const credentials = {
      type: import.meta.env.VITE_GOOGLE_TYPE,
      project_id: import.meta.env.VITE_GOOGLE_PROJECT_ID,
      private_key_id: import.meta.env.VITE_GOOGLE_PRIVATE_KEY_ID,
      private_key: import.meta.env.VITE_GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: import.meta.env.VITE_GOOGLE_CLIENT_EMAIL,
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      auth_uri: import.meta.env.VITE_GOOGLE_AUTH_URI,
      token_uri: import.meta.env.VITE_GOOGLE_TOKEN_URI,
      auth_provider_x509_cert_url: import.meta.env.VITE_GOOGLE_AUTH_PROVIDER_CERT,
      client_x509_cert_url: import.meta.env.VITE_GOOGLE_CLIENT_CERT,
      universe_domain: import.meta.env.VITE_GOOGLE_UNIVERSE_DOMAIN,
    };

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/wallet_object.issuer'],
    });

    const walletClient = google.walletobjects({ version: 'v1', auth });

    const issuerId = '3388000000022974080';
    const classSuffix = 'receipt-class';
    const objectSuffix = uuidv4().replace(/-/g, '');

    const newClass = {
      id: `${issuerId}.${classSuffix}`,
      logo: {
        sourceUri: {
          uri: 'https://storage.googleapis.com/wallet-lab-tools-codelab-artifacts-public/pass_google_logo.jpg',
        },
      },
      hexBackgroundColor: '#4285f4',
    };

    const newObject = {
      id: `${issuerId}.${objectSuffix}`,
      classId: `${issuerId}.${classSuffix}`,
      state: 'ACTIVE',
      cardTitle: {
        defaultValue: {
          language: 'en-US',
          value: formData.merchantName || 'Receipt',
        },
      },
      header: {
        defaultValue: {
          language: 'en-US',
          value: formData.merchantName || 'Receipt',
        },
      },
      barcode: {
        type: 'QR_CODE',
        value: `${issuerId}.${objectSuffix}`,
      },
      textModulesData: [
        {
          header: 'TOTAL AMOUNT',
          body: `₹${formData.totalAmount?.toFixed(2)}`,
          id: 'total_amount',
        },
        {
          header: 'DATE',
          body: formData.date || '',
          id: 'date',
        },
        {
          header: 'CATEGORY',
          body: formData.category || '',
          id: 'category',
        },
        {
          header: 'TAX',
          body: `₹${formData.taxAmount?.toFixed(2)}`,
          id: 'tax',
        },
        {
          header: 'PRIORITY',
          body: formData.priority ? 'Yes' : 'No',
          id: 'priority',
        },
        {
          header: 'WARRANTY CARD',
          body: formData.isAWarrantyCard ? 'Yes' : 'No',
          id: 'warranty',
        },
        ...formData.items.map((item, index) => ({
          header: item.itemName,
          body: `₹${item.itemPrice?.toFixed(2)} x ${item.quantity}`,
          id: `item_${index}`,
        })),
      ],
    };

    const claims = {
      iss: credentials.client_email,
      aud: 'google',
      origins: ['http://localhost:5173'],
      typ: 'savetowallet',
      payload: {
        genericClasses: [newClass],
        genericObjects: [newObject],
      },
    };

    const token = jwt.sign(claims, credentials.private_key, { algorithm: 'RS256' });
    const saveLink = `https://pay.google.com/gp/v/save/${token}`;
    return saveLink;

  } catch (error) {
    console.error('Error generating wallet pass:', error);
    return null;
  }
};
