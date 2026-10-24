import admin from 'firebase-admin';

/**
 * Firebase Admin SDK の初期化。
 *
 * サービスアカウントの秘密鍵は .env から読む(リポジトリには絶対にコミットしない)。
 * Firebaseコンソール > プロジェクトの設定 > サービスアカウント > 新しい秘密鍵を生成
 * で得たJSONの中身を、以下の3つの環境変数に移す。
 *
 *   FIREBASE_PROJECT_ID=your-project-id
 *   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
 *   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
 */

let initialized = false;

function initFirebaseAdmin(): void {
  if (initialized || admin.apps.length > 0) {
    initialized = true;
    return;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // .env内では改行が \n という2文字で書かれているため、実際の改行へ戻す
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Firebase Admin の環境変数が未設定です。' +
        'FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY を .env に設定してください。'
    );
  }

  admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
  });

  initialized = true;
}

/**
 * クライアントから送られてきたIDトークンを検証する。
 * 署名・有効期限・発行元プロジェクトはSDKが検証する。
 * checkRevoked=true にすることで、ログアウトやアカウント無効化を即座に反映する。
 */
async function verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
  initFirebaseAdmin();
  return await admin.auth().verifyIdToken(idToken, true);
}

export { initFirebaseAdmin, verifyIdToken };
export default admin;
