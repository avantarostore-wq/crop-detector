// ==========================================================================
// AUTHENTICATION SYSTEM
// ==========================================================================

(function() {
    class AuthSystem {
        constructor() {
            this.currentUser = null;
            this.checkAuth();
        }

        checkAuth() {
            const savedUser = localStorage.getItem('mimeahub_user');
            if (savedUser) {
                this.currentUser = JSON.parse(savedUser);
            }
        }

        isLoggedIn() {
            return this.currentUser !== null;
        }

        login(email, password) {
            const users = JSON.parse(localStorage.getItem('mimeahub_users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                this.currentUser = { id: user.id, name: user.name, email: user.email };
                localStorage.setItem('mimeahub_user', JSON.stringify(this.currentUser));
                return { success: true, user: this.currentUser };
            }
            return { success: false, error: 'Invalid email or password' };
        }

        register(name, email, password) {
            const users = JSON.parse(localStorage.getItem('mimeahub_users') || '[]');
            
            if (users.find(u => u.email === email)) {
                return { success: false, error: 'Email already registered' };
            }
            
            const newUser = { id: Date.now().toString(), name, email, password };
            users.push(newUser);
            localStorage.setItem('mimeahub_users', JSON.stringify(users));
            
            this.currentUser = { id: newUser.id, name: newUser.name, email: newUser.email };
            localStorage.setItem('mimeahub_user', JSON.stringify(this.currentUser));
            return { success: true, user: this.currentUser };
        }

        logout() {
            this.currentUser = null;
            localStorage.removeItem('mimeahub_user');
        }

        getUserData() {
            return this.currentUser;
        }
    }

    window.auth = new AuthSystem();

    window.handlePageRouting = function() {
        const currentPath = window.location.pathname;
        const isDashboard = currentPath.includes('dashboard.html');
        
        if (window.auth.isLoggedIn()) {
            if (!isDashboard) {
                window.location.href = 'dashboard.html';
            } else {
                const userGreeting = document.getElementById('user-greeting');
                if (userGreeting) {
                    const user = window.auth.getUserData();
                    userGreeting.textContent = `Welcome, ${user.name}`;
                }
            }
        } else {
            if (isDashboard) {
                window.location.href = 'index.html';
            }
        }
    };

    window.showAuthModal = function() {
        const modal = document.getElementById('auth-modal');
        if (modal) modal.classList.remove('hidden');
    };

    window.closeAuthModal = function() {
        const modal = document.getElementById('auth-modal');
        if (modal) modal.classList.add('hidden');
    };

    window.switchAuthForm = function(formType) {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        if (formType === 'register') {
            loginForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
        } else {
            registerForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        }
    };

    window.handleLogin = function() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        if (!email || !password) { alert('Please fill in all fields'); return; }
        const result = window.auth.login(email, password);
        if (result.success) {
            window.closeAuthModal();
            window.location.href = 'dashboard.html';
        } else {
            alert(result.error);
        }
    };

    window.handleRegister = function() {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirm = document.getElementById('register-confirm').value;
        if (!name || !email || !password || !confirm) { alert('Please fill in all fields'); return; }
        if (password !== confirm) { alert('Passwords do not match'); return; }
        if (password.length < 6) { alert('Password must be at least 6 characters'); return; }
        const result = window.auth.register(name, email, password);
        if (result.success) {
            window.closeAuthModal();
            window.location.href = 'dashboard.html';
        } else {
            alert(result.error);
        }
    };

    window.handleLogout = function() {
        window.auth.logout();
        window.location.href = 'index.html';
    };

    document.addEventListener('DOMContentLoaded', () => {
        window.handlePageRouting();
    });
})();