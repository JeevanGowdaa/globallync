// Mock authentication service for testing
// Replace with real API calls when backend is available

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

// Mock users database
const mockUsers: { [key: string]: MockUser & { password: string } } = {
  'user@example.com': {
    id: '1',
    name: 'John Doe',
    email: 'user@example.com',
    password: 'password123',
    role: 'user'
  },
  'admin@example.com': {
    id: '2',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  }
};

export const mockLogin = async (email: string, password: string): Promise<{ token: string; user: MockUser }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers[email];
      if (user && user.password === password) {
        // Generate a mock JWT token (JWT format: header.payload.signature)
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = btoa(JSON.stringify({ 
          id: user.id, 
          email: user.email, 
          role: user.role,
          name: user.name,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 86400
        }));
        const signature = btoa('mock-signature');
        const mockToken = `${header}.${payload}.${signature}`;
        
        resolve({
          token: mockToken,
          user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 500);
  });
};

export const mockSignup = async (name: string, email: string, password: string): Promise<{ token: string; user: MockUser }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mockUsers[email]) {
        reject(new Error('Email already registered'));
      } else {
        const newUser: MockUser & { password: string } = {
          id: Date.now().toString(),
          name,
          email,
          password,
          role: 'user'
        };
        mockUsers[email] = newUser;
        
        // Generate a mock JWT token (JWT format: header.payload.signature)
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = btoa(JSON.stringify({ 
          id: newUser.id, 
          email: newUser.email, 
          role: newUser.role,
          name: newUser.name,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 86400
        }));
        const signature = btoa('mock-signature');
        const mockToken = `${header}.${payload}.${signature}`;
        
        resolve({
          token: mockToken,
          user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
        });
      }
    }, 500);
  });
};
