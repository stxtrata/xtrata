import { randomBytes, scryptSync, createCipheriv, createDecipheriv } from 'node:crypto';
export function encryptWizard(key, password) {
  if (password.length < 16) throw new Error('Use a passphrase of at least 16 characters.');
  const salt = randomBytes(16), iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', scryptSync(password,salt,32),iv);
  const data = Buffer.concat([cipher.update(key,'utf8'),cipher.final()]);
  return { version:1, salt:salt.toString('hex'),iv:iv.toString('hex'),tag:cipher.getAuthTag().toString('hex'),data:data.toString('hex') };
}
export function decryptWizard(vault,password) {
  if (vault.version !== 1) throw new Error('Unsupported vault version.');
  const decipher = createDecipheriv('aes-256-gcm',scryptSync(password,Buffer.from(vault.salt,'hex'),32),Buffer.from(vault.iv,'hex'));
  decipher.setAuthTag(Buffer.from(vault.tag,'hex'));
  return Buffer.concat([decipher.update(Buffer.from(vault.data,'hex')),decipher.final()]).toString('utf8');
}
export function assertBudget(spent, next, cap, balance, floor) {
  if (next < 0n || cap <= 0n || spent + next > cap) throw new Error('Run spending cap exceeded or disabled.');
  if (balance - next < floor) throw new Error('Wallet balance floor would be breached.');
}
