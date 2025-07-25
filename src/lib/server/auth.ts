// src/lib/server/auth.ts

type User = {
	id: string;
	username: string;
	email: string;
	session: string;
};

// ตัวอย่าง mock user
const mockUsers: User[] = [
	{ id: '1', username: 'admin', email: 'admin@example.com', session: 'abc123' }
];

// จำลองการหาผู้ใช้จาก session token
export async function getUserBySessionToken(token: string): Promise<User | null> {
	const user = mockUsers.find((u) => u.session === token);
	return user ?? null;
}
