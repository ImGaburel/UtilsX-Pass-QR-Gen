class PasswordGenerator {
    constructor() {
        this.characters = {
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
        };
    }

    generate(length, options) {
        let charset = '';
        
        if (options.lowercase) charset += this.characters.lowercase;
        if (options.uppercase) charset += this.characters.uppercase;
        if (options.numbers) charset += this.characters.numbers;
        if (options.symbols) charset += this.characters.symbols;
        
        if (charset === '') return '';
        
        let password = '';
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        
        return password;
    }

    calculateStrength(password) {
        let score = 0;
        
        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;
        if (password.length >= 16) score += 1;
        
        if (/[a-z]/.test(password)) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        
        const unique = new Set(password).size;
        if (unique > password.length * 0.7) score += 1;
        
        if (score <= 2) return { level: 'weak', text: 'Débil' };
        if (score <= 4) return { level: 'medium', text: 'Media' };
        if (score <= 6) return { level: 'strong', text: 'Fuerte' };
        return { level: 'very-strong', text: 'Muy Fuerte' };
    }
}