-- ============================================================
-- Firebase Authentication 導入に伴う users テーブルの変更
--
-- 適用方法:
--   mysql -u <user> -p <database> < docs/migrations/001_add_firebase_uid.sql
--
-- 認証の実体はFirebaseが持ち、自前DBは「Firebase UID ↔ アプリ内ユーザーID」の
-- 対応表として users テーブルを使う。パスワードはFirebase側が保持するため、
-- 新規ユーザーの users.password は常に NULL のままになる。
-- ============================================================

ALTER TABLE `users`
  ADD COLUMN `firebase_uid` VARCHAR(128) DEFAULT NULL AFTER `id`,
  ADD UNIQUE KEY `uk_users_firebase_uid` (`firebase_uid`);

-- auth_provider の値の意味を固定しておく:
--   1 = password (メール+パスワード)
--   2 = google.com
--   3 = apple.com
--
-- 既存レコードはメール+パスワード想定のデフォルト値1のままでよい。

-- 既存の平文/未使用パスワードを念のため消す。
-- Firebase移行後はアプリ側でこのカラムを一切参照しない。
UPDATE `users` SET `password` = NULL WHERE `password` IS NOT NULL;
